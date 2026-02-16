'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateTime, formatExecutionTime, truncateText } from '@/lib/utils';

interface Run {
    _id: string;
    workflowName: string;
    inputText: string;
    stepOutputs: { stepName: string; output: string }[];
    executionTime: number;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function HistoryPage() {
    const [runs, setRuns] = useState<Run[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRun, setExpandedRun] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory(pagination.page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchHistory = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/history?page=${page}&limit=10`);
            if (response.ok) {
                const data = await response.json();
                setRuns(data.runs);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        fetchHistory(newPage);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Run History</h1>
                <p className="text-muted-foreground">View your past workflow executions</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            ) : runs.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">No run history yet. Execute a workflow to see results here!</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {runs.map((run) => (
                            <Card key={run._id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{run.workflowName}</CardTitle>
                                            <CardDescription>{formatDateTime(run.createdAt)}</CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-green-600">
                                                {formatExecutionTime(run.executionTime)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {run.stepOutputs.length} steps
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium mb-1">Input:</p>
                                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                            {truncateText(run.inputText, 200)}
                                        </p>
                                    </div>

                                    {expandedRun === run._id && (
                                        <div className="space-y-3 border-t pt-4">
                                            <p className="text-sm font-medium">Step Outputs:</p>
                                            {run.stepOutputs.map((stepOutput, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <p className="text-xs font-medium text-purple-600">
                                                        Step {idx + 1}: {stepOutput.stepName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                    </p>
                                                    <div className="bg-muted p-3 rounded-lg">
                                                        <p className="text-sm whitespace-pre-wrap">{stepOutput.output}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setExpandedRun(expandedRun === run._id ? null : run._id)}
                                    >
                                        {expandedRun === run._id ? 'Hide Details' : 'Show Details'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
