import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Role } from '@/types';
import { Head, Link } from '@inertiajs/react';

type RolesProps = {
    roles: Record<string, Role>;
};
export default function roles({ roles }: RolesProps) {
    return (
        <Layout>
            <Head title="roles" />

            {Object.entries(roles).map(([key, value]) => {
                console.log({ key, value });
                return (
                    <Button
                        key={key}
                        size="sm"
                        variant="ghost"
                        asChild
                        className={cn('w-full justify-start', {
                            'bg-muted': !key,
                        })}
                    >
                        <Link href={`/permissions/role/${key}`} prefetch>
                            {key}
                        </Link>
                    </Button>
                );
            })}
        </Layout>
    );
}
