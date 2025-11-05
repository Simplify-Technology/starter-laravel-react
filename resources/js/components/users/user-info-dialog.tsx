import { ModuleInfoDialog } from '@/components/dialogs/module-info-dialog';
import { InfoFeatureList } from '@/components/page-info';
import type { InfoSection } from '@/types/dialogs';
import type { UserInfoDialogProps } from '@/types/users';
import { Filter, Shield, Sparkles, Users as UsersIcon, Zap } from 'lucide-react';

/**
 * Componente específico de diálogo de informações sobre módulo de usuários
 * Usa o componente genérico ModuleInfoDialog internamente
 */
export function UserInfoDialog({ open, onOpenChange }: UserInfoDialogProps) {
    const sections: InfoSection[] = [
        {
            title: 'Visão Geral',
            icon: UsersIcon,
            iconColor: 'text-cyan-600 dark:text-cyan-400',
            content: (
                <p className="text-sm leading-relaxed">
                    O módulo de Usuários centraliza o gerenciamento de todas as contas da plataforma, permitindo cadastro, edição, vinculação com
                    cargos e controle de permissões.
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
                        { label: 'Cadastro individual de usuários com dados completos' },
                        { label: 'Gestão de perfis de acesso e permissões' },
                        { label: 'Ativação/desativação de contas' },
                        { label: 'Histórico de atividades e auditoria', badge: 'Auditoria' },
                        { label: 'Busca e filtros avançados' },
                        { label: 'Paginação eficiente para grandes volumes' },
                    ]}
                />
            ),
        },
        {
            title: 'Filtros e Busca',
            icon: Filter,
            iconColor: 'text-orange-600 dark:text-orange-400',
            content: (
                <InfoFeatureList
                    features={[
                        { label: 'Busca textual - Pesquise por nome ou email' },
                        { label: 'Filtro por Cargo - Visualize usuários por perfil' },
                        { label: 'Filtro por Status - Ativo ou Inativo' },
                        { label: 'Ordenação por colunas' },
                    ]}
                />
            ),
        },
        {
            title: 'Perfis de Acesso',
            icon: Shield,
            iconColor: 'text-red-600 dark:text-red-400',
            content: (
                <InfoFeatureList
                    features={[
                        { label: 'Super User - Acesso total ao sistema', badge: 'Máximo' },
                        { label: 'Admin - Gerencia usuários e configurações', badge: 'Gestão' },
                        { label: 'Manager - Acesso intermediário', badge: 'Intermediário' },
                        { label: 'Outros perfis - Permissões customizadas', badge: 'Customizado' },
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
                    <li>• A busca é instantânea e procura em nome e email simultaneamente</li>
                    <li>• Combine filtros de cargo e status para segmentar usuários</li>
                    <li>• Ao editar, você pode alterar cargo e permissões vinculadas</li>
                    <li>• Usuários inativos não conseguem fazer login na plataforma</li>
                    <li>• Use os ícones de ação rápida na tabela para operações frequentes</li>
                </ul>
            ),
        },
    ];

    return (
        <ModuleInfoDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Informações sobre Usuários"
            description="Conheça as funcionalidades e recursos disponíveis no módulo de gerenciamento de usuários."
            icon={UsersIcon}
            iconBgColor="bg-cyan-100 dark:bg-cyan-900/40"
            iconColor="text-cyan-600 dark:text-cyan-300"
            sections={sections}
        />
    );
}
