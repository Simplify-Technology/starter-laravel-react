import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="bg-muted/30 dark:bg-background relative flex min-h-svh items-center justify-center p-6 md:p-10">
            <div
                aria-hidden
                className="to-background dark:to-background pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent"
            />

            <div className="relative flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex items-center justify-center" aria-label="Ir para a página inicial">
                    <div className="ring-border/60 flex size-14 items-center justify-center rounded-2xl bg-zinc-950 ring-1">
                        <img
                            src="/logo-simplify.png"
                            alt="Simplify"
                            className="h-10 w-10 object-contain"
                            loading="eager"
                            decoding="async"
                            draggable={false}
                        />
                    </div>
                </Link>

                <Card className="border-border/60 bg-background dark:bg-card rounded-2xl shadow-sm">
                    <CardHeader className="px-8 pt-8 pb-0 text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-balance">{title}</CardTitle>
                        <CardDescription className="text-balance">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 py-8">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
