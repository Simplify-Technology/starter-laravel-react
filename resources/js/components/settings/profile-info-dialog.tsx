import { ModuleInfoDialog } from '@/components/dialogs/module-info-dialog';
import type { InfoSection } from '@/types/dialogs';
import { Mail, Shield, User2, Zap } from 'lucide-react';

interface ProfileInfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Componente de diálogo de informações sobre a seção de Perfil
 */
export function ProfileInfoDialog({ open, onOpenChange }: ProfileInfoDialogProps) {
    const sections: InfoSection[] = [
        {
            title: 'Dados Pessoais',
            icon: User2,
            iconColor: 'text-cyan-600 dark:text-cyan-400',
            content: (
                <div className="space-y-2 text-sm leading-relaxed">
                    <p>
                        Atualize suas informações pessoais como nome e endereço de email. Essas informações são usadas para identificação na
                        plataforma e comunicação.
                    </p>
                    <ul className="space-y-1.5 text-sm">
                        <li>• O nome é exibido em toda a plataforma</li>
                        <li>• O email é usado para login e notificações</li>
                        <li>• Alterações são salvas imediatamente após confirmar</li>
                    </ul>
                </div>
            ),
        },
        {
            title: 'Verificação de Email',
            icon: Mail,
            iconColor: 'text-blue-600 dark:text-blue-400',
            content: (
                <div className="space-y-2 text-sm leading-relaxed">
                    <p>
                        Para garantir a segurança da sua conta, é necessário verificar seu endereço de email. Um email de verificação será enviado
                        quando você alterar seu email.
                    </p>
                    <ul className="space-y-1.5 text-sm">
                        <li>• Verifique sua caixa de entrada e spam</li>
                        <li>• Clique no link de verificação no email</li>
                        <li>• Você pode reenviar o email a qualquer momento</li>
                        <li>• Contas não verificadas têm acesso limitado</li>
                    </ul>
                </div>
            ),
        },
        {
            title: 'Segurança',
            icon: Shield,
            iconColor: 'text-green-600 dark:text-green-400',
            content: (
                <ul className="space-y-1.5 text-sm">
                    <li>• Suas informações são criptografadas e protegidas</li>
                    <li>• Alterações de email requerem verificação</li>
                    <li>• Notificações são enviadas para mudanças importantes</li>
                    <li>• Mantenha seus dados atualizados para melhor segurança</li>
                </ul>
            ),
        },
        {
            title: 'Dicas de Uso',
            icon: Zap,
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            content: (
                <ul className="space-y-1.5 text-sm">
                    <li>• Mantenha seu nome atualizado para facilitar identificação</li>
                    <li>• Use um email válido e verificado para receber notificações</li>
                    <li>• Verifique seu email após alterá-lo para manter acesso completo</li>
                    <li>• As alterações são salvas automaticamente ao clicar em "Salvar Alterações"</li>
                </ul>
            ),
        },
    ];

    return (
        <ModuleInfoDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Informações sobre Perfil"
            description="Conheça como gerenciar suas informações pessoais e configurações de conta."
            icon={User2}
            iconBgColor="bg-cyan-100 dark:bg-cyan-900/40"
            iconColor="text-cyan-600 dark:text-cyan-300"
            sections={sections}
        />
    );
}
