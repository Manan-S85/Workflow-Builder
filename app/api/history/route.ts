import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Run from '@/models/Run';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const workflowId = searchParams.get('workflowId');

        await dbConnect();

        const query: any = { userId: session.user.id };
        if (workflowId) {
            query.workflowId = workflowId;
        }

        const skip = (page - 1) * limit;

        const [runs, total] = await Promise.all([
            Run.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Run.countDocuments(query),
        ]);

        return NextResponse.json(
            {
                runs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json(
            { error: 'Failed to fetch history' },
            { status: 500 }
        );
    }
}
