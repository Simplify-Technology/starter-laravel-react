import { cn } from '@/lib/utils';
import type { TableColumn, TableHeaderProps } from '@/types/data-table';
import { Table } from '@radix-ui/themes';

/**
 * Componente genérico de cabeçalho de tabela
 * Reutilizável em qualquer módulo (Usuários, CRM, Financeiro, etc.)
 */
export function DataTableHeader({ columns, onSort, currentSort, className }: TableHeaderProps) {
    const handleSort = (column: TableColumn) => {
        if (!onSort || !column.sortable) return;

        const newOrder = currentSort?.column === column.key && currentSort?.order === 'asc' ? 'desc' : 'asc';
        onSort(column.key, newOrder);
    };

    return (
        <Table.Header className={cn('bg-muted/10', className)}>
            <Table.Row>
                {columns.map((column) => {
                    const isSorted = currentSort?.column === column.key;
                    const Icon = column.icon;

                    return (
                        <Table.ColumnHeaderCell
                            key={column.key}
                            className={cn(
                                'text-sm font-semibold',
                                column.align === 'right' && 'text-end',
                                column.align === 'center' && 'text-center',
                                column.sortable && 'hover:bg-muted/20 cursor-pointer',
                                column.className,
                            )}
                            onClick={() => column.sortable && handleSort(column)}
                        >
                            <div
                                className={cn(
                                    'flex items-center gap-1.5',
                                    column.align === 'right' && 'justify-end',
                                    column.align === 'center' && 'justify-center',
                                )}
                            >
                                {Icon && <Icon className={cn('h-4 w-4', isSorted && 'text-primary', !isSorted && 'text-muted-foreground')} />}
                                <span>{column.label}</span>
                                {isSorted && column.sortable && (
                                    <span className="text-muted-foreground text-xs">{currentSort?.order === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </div>
                        </Table.ColumnHeaderCell>
                    );
                })}
            </Table.Row>
        </Table.Header>
    );
}
