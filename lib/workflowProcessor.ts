import { generateWithGeminiFallback, isGeminiQuotaExceededError } from './gemini';
import { STEP_TYPES, type StepType } from './stepTypes';

export interface StepOutput {
    stepName: string;
    output: string;
}

export interface ProcessResult {
    stepOutputs: StepOutput[];
    executionTime: number;
}

// Re-export for backward compatibility
export { STEP_TYPES, type StepType };

const ALLOW_LOCAL_AI_FALLBACK = process.env.ALLOW_LOCAL_AI_FALLBACK === 'true';


// Step processor functions
async function cleanText(input: string): Promise<string> {
    // Local processing - remove extra whitespace, trim, normalize
    return input
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n');
}

function shouldUseLocalFallback(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false;
    }

    if (isGeminiQuotaExceededError(error)) {
        return true;
    }

    return /quota exceeded|too many requests|model unavailable|not found|failed to list gemini models|failed to list openrouter models|invalid api key|unauthorized|forbidden|authenticate request with clerk|openrouter request failed \((401|403|429|500|502|503)/i.test(
        error.message
    );
}

async function runWithLocalFallback(
    stepName: string,
    prompt: string,
    fallback: () => string
): Promise<string> {
    try {
        return await generateWithGeminiFallback(prompt);
    } catch (error) {
        if (!ALLOW_LOCAL_AI_FALLBACK) {
            throw error;
        }

        if (shouldUseLocalFallback(error)) {
            console.warn(`Falling back to local processing for step: ${stepName}`);
            return fallback();
        }

        throw error;
    }
}

function summarizeLocally(input: string): string {
    const normalized = input.replace(/\s+/g, ' ').trim();

    if (!normalized) {
        return '';
    }

    const sentences = normalized
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

    if (sentences.length === 0) {
        return normalized.length > 400 ? `${normalized.slice(0, 400).trim()}...` : normalized;
    }

    const selected = sentences.slice(0, Math.min(5, Math.max(3, sentences.length)));
    return selected.join(' ');
}

function extractKeyPointsLocally(input: string): string {
    const normalized = input.replace(/\s+/g, ' ').trim();
    if (!normalized) {
        return '- No key points found.';
    }

    const sentences = normalized
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean)
        .slice(0, 5);

    const points = sentences.length > 0 ? sentences : [normalized.slice(0, 160)];
    return points.map((point) => `- ${point}`).join('\n');
}

function tagCategoryLocally(input: string): string {
    const text = input.toLowerCase();
    const categoryKeywords: Record<string, string[]> = {
        Technology: ['software', 'ai', 'tech', 'app', 'digital', 'code', 'data'],
        Business: ['market', 'revenue', 'business', 'customer', 'sales', 'company'],
        Finance: ['budget', 'finance', 'investment', 'profit', 'cost', 'money'],
        Health: ['health', 'medical', 'wellness', 'patient', 'treatment'],
        Education: ['education', 'learning', 'school', 'student', 'course', 'training'],
    };

    const matchedCategories = Object.entries(categoryKeywords)
        .filter(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))
        .map(([category]) => category);

    if (matchedCategories.length === 0) {
        return 'General';
    }

    return matchedCategories.join(', ');
}

function sentimentAnalysisLocally(input: string): string {
    const text = input.toLowerCase();
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'happy', 'success', 'improve'];
    const negativeWords = ['bad', 'poor', 'negative', 'sad', 'fail', 'problem', 'issue'];

    const positiveScore = positiveWords.reduce(
        (total, word) => total + (text.includes(word) ? 1 : 0),
        0
    );
    const negativeScore = negativeWords.reduce(
        (total, word) => total + (text.includes(word) ? 1 : 0),
        0
    );

    if (positiveScore > negativeScore) {
        return 'Positive';
    }

    if (negativeScore > positiveScore) {
        return 'Negative';
    }

    return 'Neutral';
}

function rewriteProfessionalLocally(input: string): string {
    const normalized = input
        .replace(/\s+/g, ' ')
        .replace(/\b(can't)\b/gi, 'cannot')
        .replace(/\b(won't)\b/gi, 'will not')
        .trim();

    if (!normalized) {
        return '';
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function generateTitleLocally(input: string): string {
    const cleaned = input
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s-]/g, '')
        .trim();

    if (!cleaned) {
        return 'Untitled';
    }

    const words = cleaned.split(' ').filter(Boolean).slice(0, 8);
    const title = words.join(' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
}

async function summarize(input: string): Promise<string> {
    const prompt = `Summarize the following text in 3-5 concise sentences. Maintain clarity and key meaning. Do not add any preamble or explanation, just provide the summary.

Text to summarize:
${input}`;

    return runWithLocalFallback('summarize', prompt, () => summarizeLocally(input));
}

async function extractKeyPoints(input: string): Promise<string> {
    const prompt = `Extract the key insights from the following text as clear bullet points. Return only the bullet points without any preamble or explanation.

Text to analyze:
${input}`;

    return runWithLocalFallback('extract_key_points', prompt, () => extractKeyPointsLocally(input));
}

async function tagCategory(input: string): Promise<string> {
    const prompt = `Analyze the following text and assign it to the most appropriate category or categories. Return only the category names separated by commas, without any explanation.

Common categories include: Business, Technology, Health, Education, Entertainment, Science, Politics, Sports, Finance, Lifestyle, etc.

Text to categorize:
${input}`;

    return runWithLocalFallback('tag_category', prompt, () => tagCategoryLocally(input));
}

async function sentimentAnalysis(input: string): Promise<string> {
    const prompt = `Analyze the sentiment of the following text and return ONLY one of these three words: Positive, Neutral, or Negative. Do not include any explanation or additional text.

Text to analyze:
${input}`;

    const sentiment = await runWithLocalFallback('sentiment_analysis', prompt, () =>
        sentimentAnalysisLocally(input)
    );

    // Ensure we return only valid sentiment
    if (sentiment.includes('Positive')) return 'Positive';
    if (sentiment.includes('Negative')) return 'Negative';
    return 'Neutral';
}

async function rewriteProfessional(input: string): Promise<string> {
    const prompt = `Rewrite the following text in a professional, polished tone suitable for business communication. Maintain the core message but improve clarity, grammar, and professionalism. Return only the rewritten text without any preamble.

Text to rewrite:
${input}`;

    return runWithLocalFallback('rewrite_professional', prompt, () => rewriteProfessionalLocally(input));
}

async function generateTitle(input: string): Promise<string> {
    const prompt = `Generate a clear, concise, and engaging title for the following text. The title should be no more than 10 words. Return only the title without quotes or any explanation.

Text:
${input}`;

    const generatedTitle = await runWithLocalFallback('generate_title', prompt, () =>
        generateTitleLocally(input)
    );
    return generatedTitle.replace(/^["']|["']$/g, '');
}

// Main workflow processor
export async function processWorkflow(
    steps: string[],
    inputText: string
): Promise<ProcessResult> {
    const startTime = Date.now();
    const stepOutputs: StepOutput[] = [];
    let currentInput = inputText;

    for (const step of steps) {
        let output: string;

        try {
            switch (step) {
                case 'clean_text':
                    output = await cleanText(currentInput);
                    break;
                case 'summarize':
                    output = await summarize(currentInput);
                    break;
                case 'extract_key_points':
                    output = await extractKeyPoints(currentInput);
                    break;
                case 'tag_category':
                    output = await tagCategory(currentInput);
                    break;
                case 'sentiment_analysis':
                    output = await sentimentAnalysis(currentInput);
                    break;
                case 'rewrite_professional':
                    output = await rewriteProfessional(currentInput);
                    break;
                case 'generate_title':
                    output = await generateTitle(currentInput);
                    break;
                default:
                    throw new Error(`Unknown step type: ${step}`);
            }

            stepOutputs.push({
                stepName: step,
                output,
            });

            // Use output as input for next step
            currentInput = output;
        } catch (error) {
            console.error(`Error processing step ${step}:`, error);

            if (error instanceof Error) {
                throw new Error(`Failed to process step: ${step}. ${error.message}`, {
                    cause: error,
                });
            }

            throw new Error(`Failed to process step: ${step}`);
        }
    }

    const executionTime = Date.now() - startTime;

    return {
        stepOutputs,
        executionTime,
    };
}
