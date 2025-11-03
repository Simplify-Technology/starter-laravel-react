import { PageInfo, type PageInfoProps } from '@/components/page-info';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type PageHeaderAction = {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline' | 'ghost';
};

export type PageHeaderProps = {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconGradient?: { from: string; to: string };
    helpTitle?: string;
    helpContent?: ReactNode;
    actions?: PageHeaderAction[];
    className?: string;
};

export function PageHeader({ title, subtitle, icon: Icon, iconGradient, helpTitle, helpContent, actions = [], className }: PageHeaderProps) {
    const pageInfoProps: PageInfoProps | undefined = helpTitle
        ? {
              title: helpTitle,
              children: helpContent,
          }
        : undefined;

    return (
        <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', className)}>
            <div className="flex items-start gap-3">
                {Icon && (
                    <div
                        className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                            iconGradient
                                ? `bg-gradient-to-br from-${iconGradient.from} to-${iconGradient.to} text-white shadow-sm`
                                : 'bg-muted text-muted-foreground',
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
                </div>
                {pageInfoProps && <PageInfo {...pageInfoProps} />}
            </div>
            {actions.length > 0 && (
                <div className="flex shrink-0 gap-2">
                    {actions.map((action, index) => {
                        const ActionIcon = action.icon;
                        return (
                            <Button key={index} variant={action.variant || 'default'} onClick={action.onClick} className="gap-2">
                                <ActionIcon className="h-4 w-4" />
                                {action.label}
                            </Button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
