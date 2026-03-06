import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="border-border/60 dark:border-border/40 relative hidden h-full flex-col justify-between overflow-hidden border-r bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 text-white lg:flex">
                <Link href={route('home')} className="flex items-center gap-3 text-lg font-medium" aria-label="Ir para a página inicial">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-950 ring-1 ring-white/15">
                        <img
                            src="/logo-simplify.png"
                            alt="Simplify"
                            className="h-7 w-7 object-contain"
                            loading="eager"
                            decoding="async"
                            draggable={false}
                        />
                    </div>
                    <span className="text-white/90">{name}</span>
                </Link>
                {quote && (
                    <div className="mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg text-white/90">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-white/60">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="w-full lg:p-10">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
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
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
