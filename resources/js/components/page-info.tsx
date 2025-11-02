import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CheckCircle2, InfoIcon, type LucideIcon } from 'lucide-react';
import { type ReactNode, useState } from 'react';

export type PageInfoProps = {
    title: string;
    description?: string;
    children?: ReactNode;
    triggerAriaLabel?: string;
    maxWidthClassName?: string;
};

export type InfoSectionProps = {
    title: string;
    icon: LucideIcon;
    iconColor?: string;
    children: ReactNode;
    className?: string;
};

export type InfoFeatureProps = {
    label: string;
    badge?: string;
    badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
};

export function InfoSection({ title, icon: Icon, iconColor = 'text-blue-600', children, className }: InfoSectionProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center gap-2">
                <Icon className={cn('h-4 w-4', iconColor)} />
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <div className="text-muted-foreground pl-6 text-sm leading-relaxed">{children}</div>
        </div>
    );
}

export function InfoFeatureList({ features }: { features: InfoFeatureProps[] }) {
    return (
        <ul className="space-y-2 pl-6">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                    <span className="text-sm">{feature.label}</span>
                    {feature.badge && (
                        <Badge variant={feature.badgeVariant || 'secondary'} className="text-xs">
                            {feature.badge}
                        </Badge>
                    )}
                </li>
            ))}
        </ul>
    );
}

export function PageInfo({ title, description, children, triggerAriaLabel = 'Abrir informações da página', maxWidthClassName }: PageInfoProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary transition-all duration-300 ease-in-out hover:scale-110"
                aria-label={triggerAriaLabel}
                onClick={() => setOpen(true)}
                role="button"
            >
                <InfoIcon className="h-4 w-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={cn('max-h-[85vh] overflow-y-auto', maxWidthClassName ?? 'sm:max-w-3xl')}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="bg-primary/10 rounded-lg p-2">
                                <InfoIcon className="text-primary h-5 w-5" />
                            </div>
                            <span>{title}</span>
                        </DialogTitle>
                        {description && <DialogDescription className="text-base">{description}</DialogDescription>}
                    </DialogHeader>
                    <Separator />
                    <div className="space-y-4 py-2">{children}</div>
                    <Separator />
                    <DialogFooter className="sm:justify-between">
                        <p className="text-muted-foreground text-xs">Pressione ESC para fechar</p>
                        <Button variant="default" size="sm" onClick={() => setOpen(false)}>
                            Entendi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
