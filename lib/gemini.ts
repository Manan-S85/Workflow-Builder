import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'models/gemini-2.0-flash').trim();
const GEMINI_TIMEOUT_MS = Number.parseInt(
    process.env.GEMINI_TIMEOUT_MS || process.env.OPENROUTER_TIMEOUT_MS || '8000',
    10
);

if (!GEMINI_API_KEY) {
    throw new Error('Please define GEMINI_API_KEY in .env');
}

if (/^sk-or-v1/i.test(GEMINI_API_KEY)) {
    throw new Error('GEMINI_API_KEY appears to be an OpenRouter key (sk-or-v1...). Use your Google Gemini API key instead.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export class GeminiQuotaExceededError extends Error {
    retryAfterSeconds?: number;

    constructor(message: string, retryAfterSeconds?: number, options?: ErrorOptions) {
        super(message, options);
        this.name = 'GeminiQuotaExceededError';
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

function normalizeModelName(modelName: string): string {
    return modelName.trim();
}

async function getModelCandidates(): Promise<string[]> {
    const selectedModel = normalizeModelName(GEMINI_MODEL);

    if (!selectedModel) {
        throw new Error('No Gemini model configured. Set GEMINI_MODEL in your environment.');
    }

    return [selectedModel];
}

function isModelNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const maybeError = error as { status?: number; message?: string };
    const message = maybeError.message ?? '';

    return maybeError.status === 404 || /not found|no such model|model unavailable|not supported/i.test(message);
}

function isQuotaExceededError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const maybeError = error as { status?: number; message?: string };
    const message = maybeError.message ?? '';

    return maybeError.status === 429 || /quota exceeded|too many requests|rate limit|resource exhausted/i.test(message);
}

function extractRetryAfterSeconds(error: unknown): number | undefined {
    if (!error || typeof error !== 'object') {
        return undefined;
    }

    const maybeError = error as { message?: string };
    const message = maybeError.message ?? '';
    const retryMatch = message.match(/retry (?:after|in)\s+([\d.]+)s/i);

    if (retryMatch?.[1]) {
        const value = Number.parseFloat(retryMatch[1]);
        if (Number.isFinite(value)) {
            return Math.ceil(value);
        }
    }

    return undefined;
}

function createApiError(message: string, status: number, cause?: unknown): Error & { status: number } {
    const apiError = new Error(message, { cause }) as Error & { status: number };
    apiError.status = status;
    return apiError;
}

function isTransientProviderError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const maybeError = error as { status?: number; message?: string };
    const status = maybeError.status;
    const message = maybeError.message ?? '';

    if (status === 402 || status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504) {
        return true;
    }

    return /timed out|timeout|temporarily|rate-limited upstream|retry shortly|internal error|service unavailable/i.test(message);
}

async function generateWithGemini(modelName: string, prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
        const result = await Promise.race([
            model.generateContent(prompt),
            new Promise<never>((_, reject) => {
                setTimeout(() => {
                    reject(
                        createApiError(
                            `Gemini request timed out after ${GEMINI_TIMEOUT_MS}ms for model ${modelName}.`,
                            504
                        )
                    );
                }, GEMINI_TIMEOUT_MS);
            }),
        ]);

        const response = await result.response;
        const text = response.text().trim();

        if (!text) {
            throw createApiError('Gemini returned an empty response.', 502);
        }

        return text;
    } catch (error) {
        const maybeError = error as { status?: number; message?: string };
        const message = maybeError?.message ?? '';

        if (maybeError?.status === 401 || maybeError?.status === 403 || /api key|permission|unauthorized|forbidden/i.test(message)) {
            throw createApiError(
                'Gemini authentication failed. Verify GEMINI_API_KEY in your environment and ensure Generative Language API access is enabled.',
                maybeError?.status || 403,
                error
            );
        }

        if (isModelNotFoundError(error)) {
            throw createApiError(
                `Gemini model ${modelName} is unavailable for this key/version. Set GEMINI_MODEL to an available model (for example: models/gemini-2.0-flash).`,
                404,
                error
            );
        }

        if (isQuotaExceededError(error)) {
            throw new GeminiQuotaExceededError(
                'Gemini quota/rate limit exceeded for the configured model.',
                extractRetryAfterSeconds(error),
                { cause: error }
            );
        }

        throw error;
    }
}

export function isGeminiQuotaExceededError(error: unknown): error is GeminiQuotaExceededError {
    return error instanceof GeminiQuotaExceededError;
}

export const getGeminiModel = (modelName?: string) => {
    const selectedModel = normalizeModelName(modelName || GEMINI_MODEL);

    if (!selectedModel) {
        throw new Error('No Gemini model configured. Set GEMINI_MODEL in your environment.');
    }

    return {
        generateContent: async (prompt: string) => {
            const text = await generateWithGemini(selectedModel, prompt);

            return {
                response: Promise.resolve({
                    text: () => text,
                }),
            };
        },
    };
};

export async function generateWithGeminiFallback(prompt: string): Promise<string> {
    let lastError: unknown;
    let quotaDetected = false;
    let retryAfterSeconds: number | undefined;
    const candidates = await getModelCandidates();
    for (const modelName of candidates) {

        try {
            return await generateWithGemini(modelName, prompt);
        } catch (error) {
            lastError = error;

            if (isModelNotFoundError(error)) {
                console.warn(`Gemini model unavailable: ${modelName}.`);
                continue;
            }

            if (isQuotaExceededError(error)) {
                quotaDetected = true;
                retryAfterSeconds = retryAfterSeconds ?? extractRetryAfterSeconds(error);
                console.warn(`Gemini quota/rate limit hit on model ${modelName}.`);
                continue;
            }

            if (isTransientProviderError(error)) {
                console.warn(`Gemini transient issue on model ${modelName}.`);
                continue;
            }

            throw error;
        }
    }

    if (quotaDetected) {
        const retryMessage = retryAfterSeconds
            ? ` Retry after about ${retryAfterSeconds} seconds.`
            : '';

        throw new GeminiQuotaExceededError(
            `Gemini quota/rate limit hit for configured model.${retryMessage}`,
            retryAfterSeconds,
            { cause: lastError }
        );
    }

    throw new Error(
        `No supported Gemini model is available. Tried: ${candidates.join(', ')}`,
        { cause: lastError }
    );
}

const aiProviderClient = {
    provider: 'gemini',
};

export default aiProviderClient;
