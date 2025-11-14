import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Lock, Palette, Settings, User2 } from 'lucide-react';
import { useMemo } from 'react';

interface SettingsNavItem {
    title: string;
    url: string;
    icon: typeof User2;
}

const settingsNavItems: SettingsNavItem[] = [
    {
        title: 'Perfil',
        url: '/settings/profile',
        icon: User2,
    },
    {
        title: 'Senha',
        url: '/settings/password',
        icon: Lock,
    },
    {
        title: 'Aparência',
        url: '/settings/appearance',
        icon: Palette,
    },
];

interface SettingsSidebarProps {
    currentPath: string;
    onSelectItem?: () => void;
}

/**
 * Sidebar vertical para navegação entre configurações
 * Estilo limpo e funcional, seguindo o padrão de RolesSidebar
 */
export function SettingsSidebar({ currentPath, onSelectItem }: SettingsSidebarProps) {
    const totalItems = useMemo(() => settingsNavItems.length, []);

    return (
        <aside className="bg-card border-border/40 flex w-full shrink-0 flex-col overflow-hidden rounded-lg border shadow-sm lg:w-64 lg:max-w-xs">
            {/* Settings Header */}
            <div className="bg-muted/20 border-border/30 border-b backdrop-blur-sm">
                <div className="flex items-center gap-2 px-3 py-2">
                    <Settings className="h-4 w-4 text-cyan-600 transition-colors duration-200 dark:text-cyan-500" />
                    <h2 className="dark:text-foreground text-base font-semibold tracking-tight">Configurações</h2>
                    <span className="text-muted-foreground/80 dark:text-muted-foreground/70 text-xs font-medium">
                        • {totalItems} {totalItems === 1 ? 'opção' : 'opções'}
                    </span>
                </div>
            </div>
            <nav className="flex flex-1 flex-col overflow-y-auto p-2">
                {settingsNavItems.map((item) => {
                    const isActive = currentPath === item.url;
                    const Icon = item.icon;

                    return (
                        <Button
                            key={item.url}
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={cn(
                                'h-auto w-full justify-start gap-2 px-3 py-2.5 text-left transition-all duration-200',
                                isActive
                                    ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-l-2 dark:border-cyan-500 dark:bg-cyan-500/20 dark:text-cyan-200 dark:shadow-sm dark:hover:bg-cyan-500/30'
                                    : 'hover:bg-muted/60 hover:text-foreground dark:text-foreground/90 dark:hover:text-foreground dark:hover:bg-muted/60',
                            )}
                            asChild
                            onClick={onSelectItem}
                        >
                            <Link href={item.url} prefetch>
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className={cn('text-sm font-medium', isActive ? 'dark:text-cyan-200' : 'dark:text-foreground/90')}>
                                    {item.title}
                                </span>
                            </Link>
                        </Button>
                    );
                })}
            </nav>
        </aside>
    );
}
