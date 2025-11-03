import { Toaster, ToastOptions } from 'react-hot-toast';

const toastOptions: ToastOptions = {
    position: 'top-right',
    reverseOrder: false,
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
    success: {
        iconTheme: {
            primary: 'var(--success)',
            secondary: 'var(--success-foreground)',
        },
        style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--success)',
            borderRadius: 'var(--radius)',
            padding: '0.875rem 1rem',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        className: 'toast-success',
    },
    error: {
        iconTheme: {
            primary: 'var(--destructive)',
            secondary: 'var(--destructive-foreground)',
        },
        style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--destructive)',
            borderRadius: 'var(--radius)',
            padding: '0.875rem 1rem',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        className: 'toast-error',
    },
};

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={toastOptions}
            containerClassName="toast-container"
            containerStyle={{
                top: '1rem',
                right: '1rem',
                gap: '0.75rem',
            }}
            gutter={12}
        />
    );
}
