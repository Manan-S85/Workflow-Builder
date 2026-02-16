'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Play, CheckCircle2, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Workflow {
    _id: string;
    name: string;
    steps: string[];
}

interface StepOutput {
    stepName: string;
    output: string;
}

interface RunResult {
    id: string;
    workflowName: string;
    stepOutputs: StepOutput[];
    executionTime: number;
}

export default function RunPage() {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
    const [inputText, setInputText] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [result, setResult] = useState<RunResult | null>(null);
    const RUN_WORKFLOW_TIMEOUT_MS = 120000;

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const fetchWorkflows = async () => {
        try {
            const response = await fetch('/api/workflows');
            if (response.ok) {
                const data = await response.json();
                setWorkflows(data.workflows);
            }
        } catch (error) {
            toast.error('Failed to fetch workflows');
        }
    };

    const handleRun = async () => {
        if (!selectedWorkflow) {
            toast.error('Please select a workflow');
            return;
        }

        if (!inputText.trim()) {
            toast.error('Please enter input text');
            return;
        }

        if (inputText.length > 5000) {
            toast.error('Input text must not exceed 5000 characters');
            return;
        }

        setIsRunning(true);
        setCurrentStep(0);
        setResult(null);

        const workflow = workflows.find((w) => w._id === selectedWorkflow);
        if (!workflow) {
            setIsRunning(false);
            toast.error('Selected workflow not found. Please refresh and try again.');
            return;
        }

        // Simulate step progression
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < workflow.steps.length - 1) {
                    return prev + 1;
                }
                clearInterval(stepInterval);
                return prev;
            });
        }, 1000);

        const requestController = new AbortController();
        const requestTimeout = setTimeout(() => {
            requestController.abort();
        }, RUN_WORKFLOW_TIMEOUT_MS);

        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: requestController.signal,
                body: JSON.stringify({
                    workflowId: selectedWorkflow,
                    inputText,
                }),
            });

            clearInterval(stepInterval);
            clearTimeout(requestTimeout);

            if (response.ok) {
                const data = await response.json();
                setResult(data.run);
                toast.success('Workflow completed successfully!');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to run workflow');
            }
        } catch (error: unknown) {
            clearInterval(stepInterval);

            if (error instanceof Error && error.name === 'AbortError') {
                toast.error('Workflow timed out. Please try again.');
            } else {
                toast.error('An error occurred');
            }
        } finally {
            clearTimeout(requestTimeout);
            setIsRunning(false);
        }
    };

    const copyOutput = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const downloadResults = () => {
        if (!result) return;

        const data = JSON.stringify(result, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workflow-result-${result.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Results downloaded');
    };

    const selectedWorkflowData = workflows.find((w) => w._id === selectedWorkflow);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Run Workflow</h1>
                <p className="text-muted-foreground">Execute a workflow with your input</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Workflow</CardTitle>
                    <CardDescription>Choose a workflow to execute</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Workflow</Label>
                        <select
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={selectedWorkflow}
                            onChange={(e) => setSelectedWorkflow(e.target.value)}
                            disabled={isRunning}
                        >
                            <option value="">Select a workflow...</option>
                            {workflows.map((workflow) => (
                                <option key={workflow._id} value={workflow._id}>
                                    {workflow.name} ({workflow.steps.length} steps)
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedWorkflowData && (
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm font-medium mb-2">Workflow Steps:</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {selectedWorkflowData.steps.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-sm px-3 py-1 bg-white dark:bg-gray-800 rounded-full border">
                                            {step.replace(/_/g, ' ')}
                                        </span>
                                        {idx < selectedWorkflowData.steps.length - 1 && (
                                            <span className="text-purple-600">→</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="input">Input Text</Label>
                        <Textarea
                            id="input"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter your text here..."
                            rows={6}
                            disabled={isRunning}
                            maxLength={5000}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {inputText.length}/5000 characters
                        </p>
                    </div>

                    <Button onClick={handleRun} disabled={isRunning || !selectedWorkflow} className="w-full">
                        {isRunning ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                Run Workflow
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {isRunning && selectedWorkflowData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Processing...</CardTitle>
                        <CardDescription>Executing workflow steps</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {selectedWorkflowData.steps.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    {idx < currentStep ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : idx === currentStep ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                    )}
                                    <span
                                        className={`text-sm ${idx <= currentStep ? 'font-medium' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {step.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Results</CardTitle>
                                <CardDescription>
                                    Completed in {(result.executionTime / 1000).toFixed(2)}s
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={downloadResults}>
                                <Download className="h-4 w-4 mr-2" />
                                Download JSON
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.stepOutputs.map((stepOutput, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Step {idx + 1}: {stepOutput.stepName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyOutput(stepOutput.output)}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{stepOutput.output}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
