import { ToastOptions } from 'react-hot-toast';

/**
 * Configurações padrão para todos os toasts
 */
export const toastDefaultOptions: ToastOptions = {
    position: 'top-right',
    duration: 4000,
    style: {
        background: 'var(--card)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '0.875rem 1rem',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-sans)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        maxWidth: '420px',
        lineHeight: '1.5',
    },
    className: 'toast-custom',
};

/**
 * Configurações específicas para toasts de sucesso
 */
export const toastSuccessOptions: ToastOptions = {
    className: 'toast-success',
    style: {
        background: 'var(--card)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid var(--success)',
        borderRadius: 'var(--radius)',
    },
    iconTheme: {
        primary: 'var(--success)',
        secondary: 'var(--success-foreground)',
    },
};

/**
 * Configurações específicas para toasts de erro
 */
export const toastErrorOptions: ToastOptions = {
    className: 'toast-error',
    style: {
        background: 'var(--card)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid var(--destructive)',
        borderRadius: 'var(--radius)',
    },
    iconTheme: {
        primary: 'var(--destructive)',
        secondary: 'var(--destructive-foreground)',
    },
};

/**
 * Configurações específicas para toasts de aviso
 */
export const toastWarningOptions: ToastOptions = {
    icon: '⚠️',
    className: 'toast-warning',
    style: {
        background: 'var(--card)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid var(--warning)',
        borderRadius: 'var(--radius)',
        padding: '0.875rem 1rem',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-sans)',
    },
    iconTheme: {
        primary: 'var(--warning)',
        secondary: 'var(--warning-foreground)',
    },
};

/**
 * Configurações específicas para toasts informativos
 */
export const toastInfoOptions: ToastOptions = {
    icon: 'ℹ️',
    className: 'toast-info',
    style: {
        background: 'var(--card)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid var(--info)',
        borderRadius: 'var(--radius)',
        padding: '0.875rem 1rem',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-sans)',
    },
    iconTheme: {
        primary: 'var(--info)',
        secondary: 'var(--info-foreground)',
    },
};
