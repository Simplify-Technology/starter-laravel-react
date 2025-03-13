import { Icon } from '@/components/ui/icon';
import { Box, Flex, Table, Text } from '@radix-ui/themes';
import { FileQuestion, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    type?: 'row' | 'default';
}

export function EmptyState({ title, description, icon = FileQuestion, type = 'default' }: EmptyStateProps) {
    if (type === 'row') {
        return (
            <Table.Row>
                <Table.Cell colSpan={100}>
                    <Flex align="center" justify="center" py="6" direction="column" gap="2">
                        <Icon iconNode={icon} className="text-muted-foreground" />
                        <Text weight="medium">{title}</Text>
                        {description && (
                            <Text size="2" color="gray">
                                {description}
                            </Text>
                        )}
                    </Flex>
                </Table.Cell>
            </Table.Row>
        );
    }

    return (
        <Box>
            <Flex align="center" justify="center" py="8" direction="column" gap="2">
                <Icon iconNode={icon} className="text-muted-foreground" />
                <Text weight="medium">{title}</Text>
                {description && (
                    <Text size="2" color="gray">
                        {description}
                    </Text>
                )}
            </Flex>
        </Box>
    );
}
