'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Sparkles, RefreshCw, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ServiceHealth {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    message: string;
}

interface HealthStatus {
    backend: ServiceHealth;
    database: ServiceHealth;
    llm: ServiceHealth;
    timestamp: string;
}

export default function StatusPage() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/health');
            if (response.ok) {
                const data = await response.json();
                setHealth(data);
                setLastChecked(new Date());
            }
        } catch (error) {
            console.error('Failed to fetch health status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchHealth, 30000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-800';
            case 'degraded':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800';
            case 'down':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-800';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300 dark:border-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
            case 'degraded':
                return <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
            case 'down':
                return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
            default:
                return null;
        }
    };

    const services = [
        {
            name: 'Backend API',
            icon: Server,
            data: health?.backend,
            description: 'Core application server status',
        },
        {
            name: 'Database',
            icon: Database,
            data: health?.database,
            description: 'MongoDB connection status',
        },
        {
            name: 'AI Service',
            icon: Sparkles,
            data: health?.llm,
            description: 'Google Gemini API status',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        System Status
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor the health of all system components
                    </p>
                </div>
                <Button
                    onClick={fetchHealth}
                    disabled={loading}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Last Checked */}
            {lastChecked && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                        Last checked: {lastChecked.toLocaleTimeString()} • Auto-refreshes every 30 seconds
                    </span>
                </div>
            )}

            {/* Status Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {services.map((service) => {
                    const Icon = service.icon;
                    const data = service.data;

                    return (
                        <Card key={service.name} className="relative overflow-hidden">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                            <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{service.name}</CardTitle>
                                        </div>
                                    </div>
                                    {data && getStatusIcon(data.status)}
                                </div>
                                <CardDescription>{service.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {loading && !data ? (
                                    <div className="space-y-3">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-2/3" />
                                    </div>
                                ) : data ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Status</span>
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(data.status)}
                                            >
                                                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Response Time</span>
                                            <span className="text-sm text-muted-foreground">
                                                {data.responseTime}ms
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t">
                                            <p className="text-sm text-muted-foreground">
                                                {data.message}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No data available</p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Overall Status Summary */}
            {health && (
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {health.backend.status === 'healthy' &&
                                health.database.status === 'healthy' &&
                                health.llm.status === 'healthy' ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    All Systems Operational
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                    Some Services Degraded
                                </>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Overall system health summary
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {[health.backend, health.database, health.llm].filter(s => s.status === 'healthy').length}
                                </div>
                                <div className="text-sm text-muted-foreground">Healthy</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {[health.backend, health.database, health.llm].filter(s => s.status === 'degraded').length}
                                </div>
                                <div className="text-sm text-muted-foreground">Degraded</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {[health.backend, health.database, health.llm].filter(s => s.status === 'down').length}
                                </div>
                                <div className="text-sm text-muted-foreground">Down</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
