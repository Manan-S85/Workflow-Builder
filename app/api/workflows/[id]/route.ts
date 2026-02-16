import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Workflow from '@/models/Workflow';
import { workflowSchema } from '@/lib/validations';

// GET - Get a single workflow
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const workflow = await Workflow.findOne({
            _id: id,
            userId: session.user.id,
        });

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        return NextResponse.json({ workflow }, { status: 200 });
    } catch (error) {
        console.error('Error fetching workflow:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workflow' },
            { status: 500 }
        );
    }
}

// PUT - Update a workflow
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = workflowSchema.parse(body);

        await dbConnect();

        const workflow = await Workflow.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            {
                name: validatedData.name,
                steps: validatedData.steps,
            },
            { new: true }
        );

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        return NextResponse.json({ workflow }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating workflow:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update workflow' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a workflow
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const workflow = await Workflow.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Workflow deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting workflow:', error);
        return NextResponse.json(
            { error: 'Failed to delete workflow' },
            { status: 500 }
        );
    }
}
