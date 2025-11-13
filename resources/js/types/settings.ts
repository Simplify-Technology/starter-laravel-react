/**
 * Tipos relacionados ao módulo de Settings
 */

export type ProfileFormData = {
    name: string;
    email: string;
};

export type PasswordFormData = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export type ProfilePageProps = {
    mustVerifyEmail: boolean;
    status?: string;
};

export type PasswordPageProps = Record<string, never>;

export type AppearancePageProps = Record<string, never>;

export type SettingsActionHandlers = {
    updateProfile: (name: string, email: string) => Promise<void>;
    updatePassword: (currentPassword: string, password: string, passwordConfirmation: string) => Promise<void>;
};

export type UseSettingsActionsOptions = {
    onUpdateProfileSuccess?: () => void;
    onUpdateProfileError?: () => void;
    onUpdatePasswordSuccess?: () => void;
    onUpdatePasswordError?: () => void;
};

export type UseSettingsActionsReturn = SettingsActionHandlers & {
    isUpdatingProfile: boolean;
    isUpdatingPassword: boolean;
    profileErrors: Record<string, string>;
    passwordErrors: Record<string, string>;
};
