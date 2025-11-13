import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PaginationProps } from '@/types/data-table';

/**
 * Componente genérico de paginação
 * Reutilizável em qualquer módulo (Usuários, CRM, Financeiro, etc.)
 */
export function Pagination({ currentPage, lastPage, perPage, total, onPageChange, itemLabel = 'itens', className }: PaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, total);

    return (
        <div className={cn('flex flex-col items-center justify-between gap-2 sm:flex-row', className)}>
            <div className="text-muted-foreground text-xs font-medium">
                Mostrando {startItem.toLocaleString('pt-BR')} até {endItem.toLocaleString('pt-BR')} de {total.toLocaleString('pt-BR')} {itemLabel}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    Anterior
                </Button>
                <span className="text-muted-foreground flex items-center px-4 text-sm font-medium">
                    Página {currentPage} de {lastPage}
                </span>
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    Próxima
                </Button>
            </div>
        </div>
    );
}
