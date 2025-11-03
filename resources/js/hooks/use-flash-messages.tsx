import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

// Store global para rastrear flashes já exibidos (persiste entre navegações)
// Usa Map com timestamp para limpeza automática
const displayedFlashes = new Map<string, number>();

// Limpa flashes antigos periodicamente (evita memory leak)
// Usa uma única instância do interval para evitar múltiplos timers
if (typeof window !== 'undefined' && !(window as any).__flashCleanupInterval) {
    (window as any).__flashCleanupInterval = setInterval(() => {
        const now = Date.now();
        const maxAge = 10000; // 10 segundos
        
        for (const [key, timestamp] of displayedFlashes.entries()) {
            if (now - timestamp > maxAge) {
                displayedFlashes.delete(key);
            }
        }
    }, 5000);
}

export function useFlashMessages() {
    const { flash, url } = usePage<{ flash?: FlashMessages; url?: string }>().props;
    const componentRef = useRef<{ lastFlash: string; lastUrl: string }>({
        lastFlash: '',
        lastUrl: '',
    });

    useEffect(() => {
        const currentUrl = url || '';

        // Se mudou de URL, reseta o flash local (permite novos flashes em nova página)
        if (currentUrl !== componentRef.current.lastUrl) {
            componentRef.current.lastFlash = '';
            componentRef.current.lastUrl = currentUrl;
        }

        // Se não há flash ou flash vazio, não faz nada
        if (!flash || (!flash.success && !flash.error && !flash.warning && !flash.info)) {
            return;
        }

        // Cria uma string única identificando o flash atual
        const flashContent = JSON.stringify(flash);
        const flashKey = `${currentUrl}::${flashContent}`;

        // Verifica se já foi exibido antes (globalmente ou nesta instância)
        const alreadyDisplayed =
            flashContent === componentRef.current.lastFlash || displayedFlashes.has(flashKey);

        if (!alreadyDisplayed) {
            // Exibe as notificações
            if (flash.success) {
                toast.success(flash.success, {
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
                });
            }
            if (flash.error) {
                toast.error(flash.error, {
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
                });
            }
            if (flash.warning) {
                toast(flash.warning, {
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
                });
            }
            if (flash.info) {
                toast(flash.info, {
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
                });
            }

            // Marca como exibido (globalmente e localmente)
            displayedFlashes.set(flashKey, Date.now());
            componentRef.current.lastFlash = flashContent;
            componentRef.current.lastUrl = currentUrl;
        }
    }, [flash, url]);
}
