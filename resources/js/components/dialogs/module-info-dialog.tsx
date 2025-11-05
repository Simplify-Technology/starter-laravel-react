import { InfoSection } from '@/components/page-info';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ModuleInfoDialogProps } from '@/types/dialogs';

/**
 * Componente genérico de diálogo de informações sobre módulo
 * Reutilizável em todos os módulos (Usuários, CRM, Financeiro, etc.)
 */
export function ModuleInfoDialog({
    open,
    onOpenChange,
    title,
    description,
    icon: Icon,
    iconBgColor = 'bg-cyan-100 dark:bg-cyan-900/40',
    iconColor = 'text-cyan-600 dark:text-cyan-300',
    sections,
    onClose,
}: ModuleInfoDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBgColor)}>
                            <Icon className={cn('h-5 w-5', iconColor)} />
                        </div>
                        <span>{title}</span>
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-base">{description}</DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="space-y-4 py-2">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-muted/50 dark:bg-muted/30 border-border/50 rounded-lg border p-4">
                            <InfoSection title={section.title} icon={section.icon} iconColor={section.iconColor}>
                                {section.content}
                            </InfoSection>
                        </div>
                    ))}
                </div>

                <Separator />

                <DialogFooter className="sm:justify-between">
                    <p className="text-muted-foreground text-xs">Pressione ESC para fechar</p>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                            onClose?.();
                            onOpenChange(false);
                        }}
                        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Entendi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
