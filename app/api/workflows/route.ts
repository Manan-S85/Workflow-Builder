import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Workflow from '@/models/Workflow';
import { workflowSchema } from '@/lib/validations';

// GET - List all workflows for the current user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const workflows = await Workflow.find({ userId: session.user.id }).sort({
            createdAt: -1,
        });

        return NextResponse.json({ workflows }, { status: 200 });
    } catch (error) {
        console.error('Error fetching workflows:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workflows' },
            { status: 500 }
        );
    }
}

// POST - Create a new workflow
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = workflowSchema.parse(body);

        await dbConnect();

        const workflow = await Workflow.create({
            userId: session.user.id,
            name: validatedData.name,
            steps: validatedData.steps,
            isTemplate: false,
        });

        return NextResponse.json({ workflow }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating workflow:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create workflow' },
            { status: 500 }
        );
    }
}
