'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { STEP_TYPES } from '@/lib/stepTypes';


interface Workflow {
    _id: string;
    name: string;
    steps: string[];
    createdAt: string;
}

export default function WorkflowsPage() {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        steps: [] as string[],
    });

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
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.steps.length < 2 || formData.steps.length > 4) {
            toast.error('Workflow must have 2-4 steps');
            return;
        }

        try {
            const url = editingId ? `/api/workflows/${editingId}` : '/api/workflows';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingId ? 'Workflow updated!' : 'Workflow created!');
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', steps: [] });
                fetchWorkflows();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save workflow');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleEdit = (workflow: Workflow) => {
        setFormData({ name: workflow.name, steps: workflow.steps });
        setEditingId(workflow._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this workflow?')) return;

        try {
            const response = await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Workflow deleted');
                fetchWorkflows();
            }
        } catch (error) {
            toast.error('Failed to delete workflow');
        }
    };

    const handleDuplicate = async (id: string) => {
        try {
            const response = await fetch('/api/workflows/duplicate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workflowId: id }),
            });

            if (response.ok) {
                toast.success('Workflow duplicated');
                fetchWorkflows();
            }
        } catch (error) {
            toast.error('Failed to duplicate workflow');
        }
    };

    const toggleStep = (step: string) => {
        setFormData((prev) => ({
            ...prev,
            steps: prev.steps.includes(step)
                ? prev.steps.filter((s) => s !== step)
                : [...prev.steps, step],
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Workflows</h1>
                    <p className="text-muted-foreground">Manage your automation workflows</p>
                </div>
                <Button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setFormData({ name: '', steps: [] });
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Workflow' : 'Create New Workflow'}</CardTitle>
                        <CardDescription>Select 2-4 steps for your workflow</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Workflow Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="My Workflow"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Steps ({formData.steps.length}/4)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {STEP_TYPES.map((step) => (
                                        <button
                                            key={step}
                                            type="button"
                                            onClick={() => toggleStep(step)}
                                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.steps.includes(step)
                                                ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-500'
                                                : 'hover:bg-accent'
                                                }`}
                                        >
                                            {step.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Selected steps will run in order: {formData.steps.join(' → ') || 'None'}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">
                                    {editingId ? 'Update Workflow' : 'Create Workflow'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setFormData({ name: '', steps: [] });
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            ) : workflows.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">No workflows yet. Create your first one!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workflows.map((workflow) => (
                        <Card key={workflow._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                                <CardDescription>{workflow.steps.length} steps</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    {workflow.steps.map((step, idx) => (
                                        <div key={idx} className="text-sm flex items-center gap-2">
                                            <span className="text-purple-600 font-medium">{idx + 1}.</span>
                                            <span className="text-muted-foreground">
                                                {step.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(workflow)}>
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDuplicate(workflow._id)}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(workflow._id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
