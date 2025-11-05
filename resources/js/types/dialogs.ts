import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * Tipos genéricos para componentes de diálogo
 * Reutilizáveis em todos os módulos
 */

// ============================================================================
// Module Info Dialog Types
// ============================================================================

export type InfoSection = {
    title: string;
    icon: LucideIcon;
    iconColor: string;
    content: ReactNode;
};

export type ModuleInfoDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    icon: LucideIcon;
    iconBgColor?: string;
    iconColor?: string;
    sections: InfoSection[];
    onClose?: () => void;
};

// ============================================================================
// Generic Dialog Types
// ============================================================================

export type DialogAction = {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: boolean;
    loading?: boolean;
};

export type BaseDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children?: ReactNode;
    actions?: DialogAction[];
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    processing?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};
