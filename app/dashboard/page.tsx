'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workflow, Play, Clock, TrendingUp } from 'lucide-react';
import { formatDateTime, formatExecutionTime } from '@/lib/utils';
import Link from 'next/link';

interface Stats {
    totalWorkflows: number;
    totalRuns: number;
    lastRunTime: string | null;
}

interface Run {
    _id: string;
    workflowName: string;
    executionTime: number;
    createdAt: string;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentRuns, setRecentRuns] = useState<Run[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, historyRes] = await Promise.all([
                    fetch('/api/stats'),
                    fetch('/api/history?limit=5'),
                ]);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                if (historyRes.ok) {
                    const historyData = await historyRes.json();
                    setRecentRuns(historyData.runs);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Welcome back, {session?.user?.name || 'User'}!
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your AI-powered workflows and automation
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-purple-200 dark:border-purple-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
                        <Workflow className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalWorkflows || 0}</div>
                        <p className="text-xs text-muted-foreground">Active automation workflows</p>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 dark:border-blue-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalRuns || 0}</div>
                        <p className="text-xs text-muted-foreground">Workflow executions</p>
                    </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Run</CardTitle>
                        <Clock className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.lastRunTime ? formatDateTime(stats.lastRunTime).split(',')[0] : 'Never'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.lastRunTime ? formatDateTime(stats.lastRunTime).split(',')[1] : 'No runs yet'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Runs */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Runs</CardTitle>
                    <CardDescription>Your latest workflow executions</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentRuns.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No runs yet. Start by running a workflow!</p>
                            <Button asChild className="mt-4">
                                <Link href="/run">Run Workflow</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentRuns.map((run) => (
                                <div
                                    key={run._id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                                >
                                    <div>
                                        <p className="font-medium">{run.workflowName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDateTime(run.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-green-600">
                                            {formatExecutionTime(run.executionTime)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/history">View All History</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/workflows')}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Workflow className="h-5 w-5 text-purple-600" />
                            Manage Workflows
                        </CardTitle>
                        <CardDescription>Create, edit, and organize your workflows</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/run')}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-blue-600" />
                            Run Workflow
                        </CardTitle>
                        <CardDescription>Execute a workflow with your input</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
