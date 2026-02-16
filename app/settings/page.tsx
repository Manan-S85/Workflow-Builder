'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-lg">{session?.user?.name}</p>
                            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About</CardTitle>
                    <CardDescription>Workflow Builder Pro - AI Automation Studio</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Build and execute AI-powered workflows with ease. Automate your text processing tasks using advanced AI models.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
