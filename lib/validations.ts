import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const workflowSchema = z.object({
    name: z.string().min(1, 'Workflow name is required').max(100),
    steps: z
        .array(z.string())
        .min(2, 'Workflow must have at least 2 steps')
        .max(4, 'Workflow can have at most 4 steps'),
});

export const runWorkflowSchema = z.object({
    workflowId: z.string().min(1, 'Workflow ID is required'),
    inputText: z
        .string()
        .min(1, 'Input text is required')
        .max(5000, 'Input text must not exceed 5000 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WorkflowInput = z.infer<typeof workflowSchema>;
export type RunWorkflowInput = z.infer<typeof runWorkflowSchema>;
