import { ModuleInfoDialog } from '@/components/dialogs/module-info-dialog';
import { InfoFeatureList } from '@/components/page-info';
import type { InfoSection } from '@/types/dialogs';
import type { RoleInfoDialogProps } from '@/types/permissions';
import { Filter, Shield, Sparkles, Zap } from 'lucide-react';

/**
 * Componente de diálogo de informações sobre módulo de Permissões e Roles
 */
export function RoleInfoDialog({ open, onOpenChange }: RoleInfoDialogProps) {
    const sections: InfoSection[] = [
        {
            title: 'Visão Geral',
            icon: Shield,
            iconColor: 'text-cyan-600 dark:text-cyan-400',
            content: (
                <p className="text-sm leading-relaxed">
                    O módulo de Permissões permite gerenciar funções (roles) e suas permissões associadas. Cada função pode ter múltiplas permissões e
                    usuários podem ser atribuídos a diferentes funções.
                </p>
            ),
        },
        {
            title: 'Funcionalidades Principais',
            icon: Sparkles,
            iconColor: 'text-purple-600 dark:text-purple-400',
            content: (
                <InfoFeatureList
                    features={[
                        { label: 'Gerenciamento de funções (roles) e suas permissões' },
                        { label: 'Atribuição de permissões a funções' },
                        { label: 'Visualização de usuários por função' },
                        { label: 'Atribuição e remoção de funções a usuários' },
                        { label: 'Organização por abas para cada função' },
                        { label: 'Salvamento em tempo real de alterações', badge: 'Tempo Real' },
                    ]}
                />
            ),
        },
        {
            title: 'Como Funciona',
            icon: Filter,
            iconColor: 'text-orange-600 dark:text-orange-400',
            content: (
                <InfoFeatureList
                    features={[
                        { label: 'Selecione uma função na sidebar lateral' },
                        { label: 'Marque/desmarque permissões para a função' },
                        { label: 'Clique em "Salvar Permissões" para aplicar' },
                        { label: 'Visualize usuários com essa função na tabela' },
                    ]}
                />
            ),
        },
        {
            title: 'Dicas de Uso',
            icon: Zap,
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            content: (
                <ul className="space-y-1.5 text-sm">
                    <li>• As alterações de permissões são salvas por função</li>
                    <li>• Usuários com uma função herdam todas as permissões dessa função</li>
                    <li>• Você pode atribuir múltiplas funções a um usuário</li>
                    <li>• Use a sidebar para navegar entre diferentes funções</li>
                    <li>• As permissões são aplicadas imediatamente após salvar</li>
                </ul>
            ),
        },
    ];

    return (
        <ModuleInfoDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Informações sobre Permissões"
            description="Conheça as funcionalidades e recursos disponíveis no módulo de gerenciamento de permissões e funções."
            icon={Shield}
            iconBgColor="bg-cyan-100 dark:bg-cyan-900/40"
            iconColor="text-cyan-600 dark:text-cyan-300"
            sections={sections}
        />
    );
}
