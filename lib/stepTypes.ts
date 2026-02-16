// Available step types for workflows
export const STEP_TYPES = [
    'clean_text',
    'summarize',
    'extract_key_points',
    'tag_category',
    'sentiment_analysis',
    'rewrite_professional',
    'generate_title',
] as const;

export type StepType = (typeof STEP_TYPES)[number];

// Human-readable step names
export const STEP_NAMES: Record<StepType, string> = {
    clean_text: 'Clean Text',
    summarize: 'Summarize',
    extract_key_points: 'Extract Key Points',
    tag_category: 'Tag Category',
    sentiment_analysis: 'Sentiment Analysis',
    rewrite_professional: 'Rewrite Professional',
    generate_title: 'Generate Title',
};
