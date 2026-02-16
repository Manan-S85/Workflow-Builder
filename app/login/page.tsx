'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Workflow, Sparkles, Zap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('Login successful!');
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-400 rounded-full blur-3xl"></div>
                </div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                            <Workflow className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">Workflow Builder Pro</span>
                    </div>

                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        AI-Powered<br />Automation Studio
                    </h1>
                    <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed">
                        Build intelligent workflows that transform your content with the power of AI
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 group">
                            <div className="h-11 w-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                <Sparkles className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1.5 text-base">AI-Powered Processing</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Transform text with advanced AI steps</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="h-11 w-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                <Zap className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1.5 text-base">Lightning Fast</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Process workflows in seconds</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="h-11 w-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                <Workflow className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1.5 text-base">Flexible Workflows</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Chain 2-4 steps for custom automation</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-slate-500 text-sm">
                    © 2026 Workflow Builder Pro. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient orbs */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                    <div className="absolute top-1/2 -left-32 w-80 h-80 bg-slate-100 dark:bg-slate-800/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-blue-50 dark:bg-blue-950/20 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>

                    {/* Floating shapes */}
                    <div className="absolute top-20 right-20 w-2 h-2 bg-blue-400/20 rounded-full animate-float"></div>
                    <div className="absolute top-40 right-40 w-3 h-3 bg-slate-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-32 left-20 w-2 h-2 bg-blue-300/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-slate-300/20 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg">
                            <Workflow className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Workflow Builder Pro
                        </span>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-10">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="text-slate-600 dark:text-gray-400 text-base">
                                Sign in to continue to your dashboard
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={isLoading}
                                        className="pl-10 h-12 border-gray-300 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        disabled={isLoading}
                                        className="pl-10 h-12 border-gray-300 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium text-base shadow-sm hover:shadow-md transition-all duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/register"
                                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    Create one now →
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-500 dark:text-gray-600 mt-8">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
