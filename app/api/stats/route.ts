import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Workflow from '@/models/Workflow';
import Run from '@/models/Run';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const [totalWorkflows, totalRuns, lastRun] = await Promise.all([
            Workflow.countDocuments({ userId: session.user.id }),
            Run.countDocuments({ userId: session.user.id }),
            Run.findOne({ userId: session.user.id })
                .sort({ createdAt: -1 })
                .select('createdAt')
                .lean(),
        ]);

        return NextResponse.json(
            {
                totalWorkflows,
                totalRuns,
                lastRunTime: lastRun?.createdAt || null,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
