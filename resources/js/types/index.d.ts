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
    mobile?: string;
    phone?: string;
    avatar?: string;
    email_verified_at: string | null;
    role: Role;
    permissions: Permission[];
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}

export interface Permission {
    name: string;
    label: string;
}

export interface Role {
    name: string;
    label: string;
    permissions: Permission[];
    users: User[];
}

export interface PermissionGuardProps {
    permission?: string;
    role?: string;
    children: ReactNode;

    [key: string]: unknown;
}
