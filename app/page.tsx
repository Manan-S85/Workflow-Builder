'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Workflow, Sparkles, Zap, ArrowRight, CheckCircle, Layers, BarChart3 } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
            {/* Navigation */}
            <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                                <Workflow className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Workflow Builder Pro
                            </span>
                        </div>
                        <Link href="/login">
                            <Button variant="outline" className="border-slate-300 dark:border-gray-700">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-1/2 -left-32 w-80 h-80 bg-slate-200 dark:bg-slate-800/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-blue-100 dark:bg-blue-950/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                            AI-Powered Workflow
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-slate-600 dark:from-blue-400 dark:to-slate-400 bg-clip-text text-transparent">
                                Automation Studio
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-slate-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Transform your content with intelligent AI workflows. Build, automate, and scale your processes in minutes—no coding required.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/login">
                                <Button className="h-14 px-8 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="h-14 px-8 border-2 border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white font-medium text-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-200"
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Learn More
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">7</div>
                                <div className="text-sm text-slate-600 dark:text-gray-400">AI Steps</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">2-4</div>
                                <div className="text-sm text-slate-600 dark:text-gray-400">Steps per Workflow</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">∞</div>
                                <div className="text-sm text-slate-600 dark:text-gray-400">Possibilities</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 lg:py-32 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            Everything You Need to Automate
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Powerful features designed to streamline your workflow and boost productivity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                <Sparkles className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                7 AI-Powered Steps
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                Clean, summarize, analyze, translate, extract, format, and transform your text with advanced AI processing powered by Google Gemini.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                <Workflow className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                Custom Workflows
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                Chain 2-4 steps together to create powerful automation pipelines tailored to your specific needs and use cases.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                Instant Results
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                Get processed output in seconds with our optimized AI pipeline. No waiting, no delays—just instant automation.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-slate-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                <Layers className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                Personal Dashboard
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                Save, manage, and track all your workflows in one centralized place with full history and detailed analytics.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-slate-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                <CheckCircle className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                No Coding Required
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                Build sophisticated automation workflows with our intuitive interface—no programming knowledge needed.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-slate-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                <BarChart3 className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                Run History & Analytics
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                Track every workflow execution with detailed logs, timestamps, and performance metrics for complete visibility.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Ready to Automate Your Workflow?
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Join thousands of users who are transforming their content with AI-powered automation.
                    </p>
                    <Link href="/login">
                        <Button className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                            Get Started for Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                <Workflow className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                Workflow Builder Pro
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                            © 2026 Workflow Builder Pro. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
