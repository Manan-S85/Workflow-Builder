type OpenRouterCompletionResponse = {
    choices?: Array<{
        message?: {
            content?: string | Array<{ type?: string; text?: string }>;
        };
    }>;
};

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_TIMEOUT_MS = Number.parseInt(process.env.OPENROUTER_TIMEOUT_MS || '12000', 10);
const OPENROUTER_TOTAL_TIMEOUT_MS = Number.parseInt(process.env.OPENROUTER_TOTAL_TIMEOUT_MS || '45000', 10);
const OPENROUTER_MAX_MODELS = Math.max(1, Number.parseInt(process.env.OPENROUTER_MAX_MODELS || '2', 10));

if (!OPENROUTER_API_KEY) {
    throw new Error('Please define OPENROUTER_API_KEY in .env');
}

if (/^AIza/i.test(OPENROUTER_API_KEY)) {
    throw new Error('OPENROUTER_API_KEY appears to be a Google/Gemini key (AIza...). Use your OpenRouter key instead.');
}

const DEFAULT_MODEL_CANDIDATES = [
    'deepseek/deepseek-r1-0528:free',
    process.env.OPENROUTER_MODEL,
    process.env.GEMINI_MODEL,
    'meta-llama/llama-3.3-70b-instruct:free',
    'xiaomi/mimo-v2-flash:free',
    'google/gemini-2.0-flash-exp:free',
    'mistralai/mistral-7b-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',
].filter((model): model is string => Boolean(model));

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

function getOpenRouterHeaders(): HeadersInit {
    const headers: HeadersInit = {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'Workflow Builder Lite',
    };

    return headers;
}

function parseOpenRouterContent(content: string | Array<{ type?: string; text?: string }> | undefined): string {
    if (typeof content === 'string') {
        return content;
    }

    if (Array.isArray(content)) {
        return content
            .map((part) => part.text ?? '')
            .join(' ')
            .trim();
    }

    return '';
}

async function getModelCandidates(): Promise<string[]> {
    return Array.from(new Set(DEFAULT_MODEL_CANDIDATES.map(normalizeModelName).filter(Boolean))).slice(
        0,
        OPENROUTER_MAX_MODELS
    );
}

function isModelNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const maybeError = error as { status?: number; message?: string };
    const message = maybeError.message ?? '';

    return maybeError.status === 404 || /not found|no such model|model unavailable/i.test(message);
}

function isQuotaExceededError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const maybeError = error as { status?: number; message?: string };
    const message = maybeError.message ?? '';

    return maybeError.status === 429 || /quota exceeded|too many requests|rate limit/i.test(message);
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

    return /timed out|timeout|temporarily|provider returned error|rate-limited upstream|retry shortly/i.test(message);
}

async function generateWithOpenRouter(modelName: string, prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

    let response: Response;

    try {
        response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: getOpenRouterHeaders(),
            signal: controller.signal,
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.2,
                max_tokens: 1024,
            }),
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw createApiError(
                `OpenRouter request timed out after ${OPENROUTER_TIMEOUT_MS}ms for model ${modelName}.`,
                504,
                error
            );
        }

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }

    if (!response.ok) {
        const errorText = await response.text();
        const lowerErrorText = errorText.toLowerCase();

        if (response.status === 401 || response.status === 403 || lowerErrorText.includes('authenticate request with clerk')) {
            throw createApiError(
                'OpenRouter authentication failed. Verify OPENROUTER_API_KEY in .env and ensure it is active for your OpenRouter account.',
                response.status
            );
        }

        throw createApiError(
            `OpenRouter request failed (${response.status} ${response.statusText}): ${errorText.slice(0, 500)}`,
            response.status
        );
    }

    const data = (await response.json()) as OpenRouterCompletionResponse;
    const text = parseOpenRouterContent(data.choices?.[0]?.message?.content).trim();

    if (!text) {
        throw createApiError('OpenRouter returned an empty response.', 502);
    }

    return text;
}

export function isGeminiQuotaExceededError(error: unknown): error is GeminiQuotaExceededError {
    return error instanceof GeminiQuotaExceededError;
}

export const getGeminiModel = (modelName?: string) => {
    const selectedModel = normalizeModelName(modelName || DEFAULT_MODEL_CANDIDATES[0]);

    if (!selectedModel) {
        throw new Error('No OpenRouter model configured. Set OPENROUTER_MODEL in your environment.');
    }

    return {
        generateContent: async (prompt: string) => {
            const text = await generateWithOpenRouter(selectedModel, prompt);

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
    const startedAt = Date.now();

    for (const modelName of candidates) {
        if (Date.now() - startedAt >= OPENROUTER_TOTAL_TIMEOUT_MS) {
            throw new Error(
                `OpenRouter total timeout reached after ${OPENROUTER_TOTAL_TIMEOUT_MS}ms while trying fallback models.`,
                { cause: lastError }
            );
        }

        try {
            return await generateWithOpenRouter(modelName, prompt);
        } catch (error) {
            lastError = error;

            if (isModelNotFoundError(error)) {
                console.warn(`OpenRouter model unavailable: ${modelName}. Trying next model...`);
                continue;
            }

            if (isQuotaExceededError(error)) {
                quotaDetected = true;
                retryAfterSeconds = retryAfterSeconds ?? extractRetryAfterSeconds(error);
                console.warn(`OpenRouter quota/rate limit hit on model ${modelName}. Trying next model...`);
                continue;
            }

            if (isTransientProviderError(error)) {
                console.warn(`OpenRouter transient issue on model ${modelName}. Trying next model...`);
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
            `OpenRouter quota/rate limit hit for all configured models.${retryMessage}`,
            retryAfterSeconds,
            { cause: lastError }
        );
    }

    throw new Error(
        `No supported OpenRouter model is available. Tried: ${candidates.join(', ')}`,
        { cause: lastError }
    );
}

const aiProviderClient = {
    provider: 'openrouter',
};

export default aiProviderClient;
