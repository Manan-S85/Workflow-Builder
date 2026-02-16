import { Navbar } from '@/components/navbar';

export default function RunLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    );
}
