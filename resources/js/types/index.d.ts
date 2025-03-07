import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    roles: Role[];
    permissions: Permission[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permission?: string;
    role?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };

    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    roles: Role[];
    permissions: Permission[];
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
    label?: string;
}

export interface Permission {
    id: number;
    name: string;
    label?: string;
}

export interface PermissionGuardProps {
    permission?: string;
    role?: string;
    children: ReactNode;

    [key: string]: unknown;
}
