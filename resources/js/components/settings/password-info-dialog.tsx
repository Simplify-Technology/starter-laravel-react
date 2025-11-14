import { ModuleInfoDialog } from '@/components/dialogs/module-info-dialog';
import { InfoFeatureList } from '@/components/page-info';
import type { InfoSection } from '@/types/dialogs';
import { KeyRound, Lock, Shield, Zap } from 'lucide-react';

interface PasswordInfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Componente de diálogo de informações sobre a seção de Senha
 */
export function PasswordInfoDialog({ open, onOpenChange }: PasswordInfoDialogProps) {
    const sections: InfoSection[] = [
        {
            title: 'Segurança da Senha',
            icon: Shield,
            iconColor: 'text-green-600 dark:text-green-400',
            content: (
                <div className="space-y-2 text-sm leading-relaxed">
                    <p>
                        Sua senha é a primeira linha de defesa da sua conta. É importante usar uma senha forte e única para proteger suas informações.
                    </p>
                    <ul className="space-y-1.5 text-sm">
                        <li>• Use pelo menos 8 caracteres</li>
                        <li>• Combine letras maiúsculas, minúsculas, números e símbolos</li>
                        <li>• Evite informações pessoais óbvias</li>
                        <li>• Não reutilize senhas de outras contas</li>
                    </ul>
                </div>
            ),
        },
        {
            title: 'Como Alterar',
            icon: KeyRound,
            iconColor: 'text-cyan-600 dark:text-cyan-400',
            content: (
                <InfoFeatureList
                    features={[
                        { label: 'Digite sua senha atual para confirmar identidade' },
                        { label: 'Crie uma nova senha forte e segura' },
                        { label: 'Confirme a nova senha digitando novamente' },
                        { label: 'Clique em "Salvar Senha" para aplicar as alterações' },
                    ]}
                />
            ),
        },
        {
            title: 'Requisitos de Senha',
            icon: Lock,
            iconColor: 'text-blue-600 dark:text-blue-400',
            content: (
                <ul className="space-y-1.5 text-sm">
                    <li>• Mínimo de 8 caracteres</li>
                    <li>• Deve conter letras e números</li>
                    <li>• Recomendado: símbolos especiais</li>
                    <li>• Não pode ser igual à senha anterior</li>
                    <li>• Deve ser diferente da senha atual</li>
                </ul>
            ),
        },
        {
            title: 'Dicas de Segurança',
            icon: Zap,
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            content: (
                <ul className="space-y-1.5 text-sm">
                    <li>• Altere sua senha regularmente (a cada 3-6 meses)</li>
                    <li>• Use um gerenciador de senhas para criar senhas fortes</li>
                    <li>• Nunca compartilhe sua senha com ninguém</li>
                    <li>• Se suspeitar de acesso não autorizado, altere imediatamente</li>
                    <li>• Ative autenticação de dois fatores se disponível</li>
                </ul>
            ),
        },
    ];

    return (
        <ModuleInfoDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Informações sobre Senha"
            description="Aprenda como gerenciar e proteger sua senha de acesso à plataforma."
            icon={Lock}
            iconBgColor="bg-cyan-100 dark:bg-cyan-900/40"
            iconColor="text-cyan-600 dark:text-cyan-300"
            sections={sections}
        />
    );
}
