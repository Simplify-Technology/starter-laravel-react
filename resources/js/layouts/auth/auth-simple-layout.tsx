import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-muted/30 dark:bg-background relative flex min-h-svh items-center justify-center p-6 md:p-10">
            <div
                aria-hidden
                className="to-background dark:to-background pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent"
            />

            <div className="relative w-full max-w-md">
                <div className="border-border/60 bg-background dark:bg-card rounded-2xl border p-8 shadow-sm">
                    <div className="flex flex-col items-center gap-5">
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

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
                            <p className="text-muted-foreground text-sm text-balance">{description}</p>
                        </div>
                    </div>

                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
