import Heading from '@/components/heading';
import { Box, Flex, Tabs } from '@radix-ui/themes';
import { ReactNode } from 'react';

interface PermissionsLayoutProps {
    roles?: Record<string, { label: string; permissions: Record<string, string> }>;
    children: ReactNode;
}

export default function PermissionsLayout({ roles, children }: PermissionsLayoutProps) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6">
            <Heading title="Configurações" description="Configure preferências do sistema" />

            <Tabs.Root defaultValue="admin" asChild>
                <Flex direction="row" gap="8">
                    <Tabs.List>
                        <Flex direction="column">
                            {roles &&
                                Object.entries(roles).map(([key, value]) => (
                                    <Tabs.Trigger key={key} value={key}>
                                        {value.label}
                                    </Tabs.Trigger>
                                ))}
                        </Flex>
                    </Tabs.List>

                    <Box pt="3">{children}</Box>
                </Flex>
            </Tabs.Root>

            {/*<div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">*/}
            {/*    <aside className="w-full max-w-3xl lg:w-48">*/}
            {/*        <nav className="flex flex-col space-y-1 space-x-0">*/}
            {/*            {sidebarNavItems?.map((item) => (*/}
            {/*                <Button*/}
            {/*                    key={item.url}*/}
            {/*                    size="sm"*/}
            {/*                    variant="ghost"*/}
            {/*                    asChild*/}
            {/*                    className={cn('w-full justify-start', {*/}
            {/*                        'bg-muted': currentPath === item.url,*/}
            {/*                    })}*/}
            {/*                >*/}
            {/*                    <Link href={item.url} prefetch>*/}
            {/*                        {item.title}*/}
            {/*                    </Link>*/}
            {/*                </Button>*/}
            {/*            ))}*/}
            {/*        </nav>*/}
            {/*    </aside>*/}

            {/*    <Separator className="my-6 md:hidden" />*/}

            {/*    <div className="flex-1 md:max-w-4xl">*/}
            {/*        <section className="max-w-4xl space-y-12">{children}</section>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}
