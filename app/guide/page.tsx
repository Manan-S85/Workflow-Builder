'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb, AlertCircle, CheckCircle2, Workflow } from 'lucide-react';

export default function GuidePage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Workflow Guide
                </h1>
                <p className="text-muted-foreground mt-2">
                    Learn how to build effective AI-powered workflows
                </p>
            </div>

            {/* How Chaining Works */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-purple-600" />
                        How Workflow Chaining Works
                    </CardTitle>
                    <CardDescription>Understanding the flow of data through your workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm">
                        Workflows process your input text through a series of steps. Each step receives the{' '}
                        <strong>output from the previous step</strong> as its input, creating a chain of transformations.
                    </p>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                            <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border font-medium">
                                Your Input Text
                            </div>
                            <ArrowRight className="h-4 w-4 text-purple-600" />
                            <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border">
                                Step 1
                            </div>
                            <ArrowRight className="h-4 w-4 text-purple-600" />
                            <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border">
                                Step 2
                            </div>
                            <ArrowRight className="h-4 w-4 text-purple-600" />
                            <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border">
                                Step 3
                            </div>
                            <ArrowRight className="h-4 w-4 text-purple-600" />
                            <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border font-medium">
                                Final Output
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            💡 Key Concept: The output of Step 1 becomes the input of Step 2, and so on.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Step Types */}
            <Card>
                <CardHeader>
                    <CardTitle>Step Types</CardTitle>
                    <CardDescription>Understanding the two categories of workflow steps</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Transformation Steps */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Transformation Steps
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            These steps modify, transform, or process your text while preserving its essence.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg">
                                <h4 className="font-medium text-sm">Clean Text</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Removes extra whitespace and normalizes formatting
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <h4 className="font-medium text-sm">Summarize</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Condenses text into 3-5 concise sentences
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <h4 className="font-medium text-sm">Extract Key Points</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Pulls out main insights as bullet points
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <h4 className="font-medium text-sm">Rewrite Professional</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Transforms text into polished business language
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Steps */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            Analysis Steps
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            These steps analyze and classify your text, outputting only the classification result.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg border-orange-200 dark:border-orange-900">
                                <h4 className="font-medium text-sm">Tag Category</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Classifies text into categories (e.g., Business, Technology)
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg border-orange-200 dark:border-orange-900">
                                <h4 className="font-medium text-sm">Sentiment Analysis</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Determines if text is Positive, Neutral, or Negative
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg border-orange-200 dark:border-orange-900">
                                <h4 className="font-medium text-sm">Generate Title</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Creates a concise title for your text
                                </p>
                            </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900">
                            <p className="text-sm font-medium text-orange-900 dark:text-orange-100 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Important:</strong> Analysis steps currently output only their classification (e.g., &quot;Neutral&quot;),
                                    discarding the original text. This means if you use them before transformation steps,
                                    those steps will only receive the classification word.
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                        Best Practices
                    </CardTitle>
                    <CardDescription>Tips for building effective workflows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-sm">Use Analysis Steps Last</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Since analysis steps only output classifications, place them at the end of your workflow
                                    to avoid breaking the chain.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-sm">Start with Clean Text</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Beginning with Clean Text ensures consistent formatting for subsequent steps.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-sm">Chain Transformation Steps</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Transformation steps work well together: Clean → Summarize → Rewrite Professional
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-sm">Avoid Analysis → Transformation</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Don&apos;t place transformation steps after analysis steps, as they&apos;ll only receive the
                                    classification word (e.g., &quot;Neutral&quot; → &quot;Neutral Position&quot;).
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Example Workflows */}
            <Card>
                <CardHeader>
                    <CardTitle>Example Workflows</CardTitle>
                    <CardDescription>Common workflow patterns that work well</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Example 1 */}
                    <div className="space-y-2">
                        <h4 className="font-medium">📝 Professional Content Writer</h4>
                        <div className="flex items-center gap-2 flex-wrap text-sm">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                                Clean Text
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                                Rewrite Professional
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                                Generate Title
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Perfect for turning rough drafts into polished business content with a title.
                        </p>
                    </div>

                    {/* Example 2 */}
                    <div className="space-y-2">
                        <h4 className="font-medium">📊 Content Analyzer</h4>
                        <div className="flex items-center gap-2 flex-wrap text-sm">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                                Clean Text
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                                Extract Key Points
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full border border-orange-300 dark:border-orange-700">
                                Tag Category
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full border border-orange-300 dark:border-orange-700">
                                Sentiment Analysis
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Extracts insights first, then analyzes. Note: Final output will be just the sentiment.
                        </p>
                    </div>

                    {/* Example 3 */}
                    <div className="space-y-2">
                        <h4 className="font-medium">✨ Smart Summarizer</h4>
                        <div className="flex items-center gap-2 flex-wrap text-sm">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                                Clean Text
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                                Summarize
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-700">
                                Rewrite Professional
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Creates a concise, professional summary of long content.
                        </p>
                    </div>

                    {/* Bad Example */}
                    <div className="space-y-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
                        <h4 className="font-medium text-red-900 dark:text-red-100">❌ Avoid This Pattern</h4>
                        <div className="flex items-center gap-2 flex-wrap text-sm">
                            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border">
                                Clean Text
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full border border-orange-300 dark:border-orange-700">
                                Sentiment Analysis
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border">
                                Rewrite Professional
                            </span>
                        </div>
                        <p className="text-xs text-red-900 dark:text-red-100">
                            This will produce nonsensical output like &quot;Neutral Position&quot; because Rewrite Professional
                            receives only the word &quot;Neutral&quot; from Sentiment Analysis.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
