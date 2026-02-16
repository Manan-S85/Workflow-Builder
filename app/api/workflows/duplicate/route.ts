import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Workflow from '@/models/Workflow';

// POST - Duplicate a workflow
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { workflowId } = await req.json();

        if (!workflowId) {
            return NextResponse.json(
                { error: 'Workflow ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const originalWorkflow = await Workflow.findOne({
            _id: workflowId,
            userId: session.user.id,
        });

        if (!originalWorkflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        const duplicatedWorkflow = await Workflow.create({
            userId: session.user.id,
            name: `${originalWorkflow.name} (Copy)`,
            steps: originalWorkflow.steps,
            isTemplate: false,
        });

        return NextResponse.json({ workflow: duplicatedWorkflow }, { status: 201 });
    } catch (error) {
        console.error('Error duplicating workflow:', error);
        return NextResponse.json(
            { error: 'Failed to duplicate workflow' },
            { status: 500 }
        );
    }
}
