import { PermissionGuard } from '@/layouts/permissions/PermissionsGuard';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/use-permissions', () => ({
    usePermissions: () => ({
        hasPermission: (permission: string) => permission === 'allowed-permission',
        hasRole: (role: string) => role === 'allowed-role',
    }),
}));

describe('PermissionGuard', () => {
    it('renders children when only permission is provided and allowed', () => {
        render(
            <PermissionGuard permission="allowed-permission">
                <div>content</div>
            </PermissionGuard>,
        );

        expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('renders children when only role is provided and allowed', () => {
        render(
            <PermissionGuard role="allowed-role">
                <div>content</div>
            </PermissionGuard>,
        );

        expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('blocks when permission is provided but not allowed', () => {
        render(
            <PermissionGuard permission="denied-permission">
                <div>content</div>
            </PermissionGuard>,
        );

        expect(screen.queryByText('content')).toBeNull();
    });

    it('blocks when role is provided but not allowed', () => {
        render(
            <PermissionGuard role="denied-role">
                <div>content</div>
            </PermissionGuard>,
        );

        expect(screen.queryByText('content')).toBeNull();
    });

    it('renders children when neither permission nor role is provided', () => {
        render(
            <PermissionGuard>
                <div>content</div>
            </PermissionGuard>,
        );

        expect(screen.getByText('content')).toBeInTheDocument();
    });
});
