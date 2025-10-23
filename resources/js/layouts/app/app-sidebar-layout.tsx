import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ImpersonateBanner } from '@/components/impersonate-banner';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage().props as { auth?: { impersonating?: { active?: boolean; originalUserName?: string | null } } };

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <ImpersonateBanner
                    active={auth?.impersonating?.active || false}
                    originalUserName={auth?.impersonating?.originalUserName || null}
                />
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
