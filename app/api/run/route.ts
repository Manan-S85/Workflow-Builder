import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Workflow from '@/models/Workflow';
import Run from '@/models/Run';
import { runWorkflowSchema } from '@/lib/validations';
import { processWorkflow } from '@/lib/workflowProcessor';

export const maxDuration = 60;

// Rate limiting (simple in-memory store for demo)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(userId, {
            count: 1,
            resetTime: now + 60000, // 1 minute
        });
        return true;
    }

    if (userLimit.count >= 10) {
        // 10 requests per minute
        return false;
    }

    userLimit.count++;
    return true;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check rate limit
        if (!checkRateLimit(session.user.id)) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await req.json();
        const validatedData = runWorkflowSchema.parse(body);

        await dbConnect();

        // Get workflow
        const workflow = await Workflow.findOne({
            _id: validatedData.workflowId,
            userId: session.user.id,
        });

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        // Process workflow
        const result = await processWorkflow(workflow.steps, validatedData.inputText);

        // Save run
        const run = await Run.create({
            userId: session.user.id,
            workflowId: workflow._id,
            workflowName: workflow.name,
            inputText: validatedData.inputText,
            stepOutputs: result.stepOutputs,
            executionTime: result.executionTime,
        });

        return NextResponse.json(
            {
                run: {
                    id: run._id,
                    workflowName: run.workflowName,
                    inputText: run.inputText,
                    stepOutputs: run.stepOutputs,
                    executionTime: run.executionTime,
                    createdAt: run.createdAt,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error running workflow:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        const errorMessage = String(error?.message ?? '');
        if (/quota exceeded|too many requests/i.test(errorMessage)) {
            return NextResponse.json(
                { error: errorMessage || 'Gemini quota exceeded. Please retry later.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to run workflow' },
            { status: 500 }
        );
    }
}
