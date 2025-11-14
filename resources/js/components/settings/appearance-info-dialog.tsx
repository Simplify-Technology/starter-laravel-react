import { ModuleInfoDialog } from '@/components/dialogs/module-info-dialog';
import { InfoFeatureList } from '@/components/page-info';
import type { InfoSection } from '@/types/dialogs';
import { Monitor, Moon, Palette, Sun, Zap } from 'lucide-react';

interface AppearanceInfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Componente de diálogo de informações sobre a seção de Aparência
 */
export function AppearanceInfoDialog({ open, onOpenChange }: AppearanceInfoDialogProps) {
    const sections: InfoSection[] = [
        {
            title: 'Temas Disponíveis',
            icon: Palette,
            iconColor: 'text-cyan-600 dark:text-cyan-400',
            content: (
                <div className="space-y-3 text-sm leading-relaxed">
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <Sun className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                            <div>
                                <p className="font-medium">Tema Claro</p>
                                <p className="text-muted-foreground text-xs">Interface com cores claras, ideal para ambientes bem iluminados</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Moon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="font-medium">Tema Escuro</p>
                                <p className="text-muted-foreground text-xs">Interface com cores escuras, reduz fadiga visual em ambientes escuros</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-gray-600 dark:text-gray-400" />
                            <div>
                                <p className="font-medium">Seguir Sistema</p>
                                <p className="text-muted-foreground text-xs">Acompanha automaticamente as preferências do seu sistema operacional</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Como Funciona',
            icon: Monitor,
            iconColor: 'text-blue-600 dark:text-blue-400',
            content: (
                <InfoFeatureList
                    features={[
                        { label: 'Selecione o tema desejado clicando no botão correspondente' },
                        { label: 'A alteração é aplicada instantaneamente' },
                        { label: 'Sua preferência é salva automaticamente' },
                        { label: 'O tema escolhido será mantido em todas as sessões' },
                    ]}
                />
            ),
        },
        {
            title: 'Benefícios',
            icon: Zap,
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            content: (
                <ul className="space-y-1.5 text-sm">
                    <li>• Reduz fadiga visual durante uso prolongado</li>
                    <li>• Melhora a experiência em diferentes condições de iluminação</li>
                    <li>• Personalização conforme sua preferência</li>
                    <li>• Ajuste automático com "Seguir Sistema"</li>
                    <li>• Preferência salva entre sessões</li>
                </ul>
            ),
        },
        {
            title: 'Dicas de Uso',
            icon: Zap,
            iconColor: 'text-purple-600 dark:text-purple-400',
            content: (
                <ul className="space-y-1.5 text-sm">
                    <li>• Use tema claro durante o dia e escuro à noite</li>
                    <li>• A preferência é salva automaticamente, não precisa confirmar</li>
                    <li>• Você pode alternar entre temas a qualquer momento</li>
                    <li>• O tema escolhido afeta toda a interface da plataforma</li>
                </ul>
            ),
        },
    ];

    return (
        <ModuleInfoDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Informações sobre Aparência"
            description="Personalize a aparência da plataforma escolhendo o tema que melhor se adapta ao seu ambiente e preferências."
            icon={Palette}
            iconBgColor="bg-cyan-100 dark:bg-cyan-900/40"
            iconColor="text-cyan-600 dark:text-cyan-300"
            sections={sections}
        />
    );
}
