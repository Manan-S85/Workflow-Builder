'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import {
    LayoutDashboard,
    Workflow,
    Play,
    History,
    Settings,
    LogOut,
    Moon,
    Sun,
    BookOpen,
    Activity
} from 'lucide-react';
import { useTheme } from 'next-themes';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Workflows', href: '/workflows', icon: Workflow },
    { name: 'Run', href: '/run', icon: Play },
    { name: 'History', href: '/history', icon: History },
    { name: 'Status', href: '/status', icon: Activity },
    { name: 'Guide', href: '/guide', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                <Workflow className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-lg hidden sm:inline">Workflow Builder Pro</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                        {session && (
                            <Button variant="ghost" size="icon" onClick={handleSignOut}>
                                <LogOut className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
