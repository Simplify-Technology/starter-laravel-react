import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/use-permissions';
import { Role, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface UserFormData {
    name: string;
    email: string;
    cpf_cnpj?: string;
    phone?: string;
    mobile?: string;
    password?: string;
    password_confirmation?: string;
    role_id?: number | null;
    is_active?: boolean;
    user_notes?: string;
}

interface UserFormProps {
    user?: User | null;
    roles: Role[];
    onSubmit?: (data: UserFormData) => void;
    isProcessing?: boolean;
    errors?: Record<string, string>;
    routeName: string;
    routeParams?: Record<string, string | number>;
}

export default function UserForm({
    user,
    roles,
    onSubmit,
    isProcessing: externalProcessing,
    errors: externalErrors = {},
    routeName,
    routeParams = {},
}: UserFormProps) {
    const { hasPermission } = usePermissions();
    const canAssignRoles = hasPermission('assign_roles');

    const {
        data,
        setData,
        post,
        put,
        processing: formProcessing,
        errors: formErrors,
    } = useForm<UserFormData>({
        name: user?.name || '',
        email: user?.email || '',
        cpf_cnpj: user?.cpf_cnpj || '',
        phone: user?.phone || '',
        mobile: user?.mobile || '',
        password: '',
        password_confirmation: '',
        role_id: user?.role?.id || null,
        is_active: user?.is_active ?? true,
        user_notes: user?.user_notes || '',
    });

    const processing = externalProcessing ?? formProcessing;
    const errors = { ...formErrors, ...externalErrors };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Prepare submit data
        const submitData: UserFormData = { ...data };

        // Remove password fields if empty (for update)
        if (user && !submitData.password) {
            delete submitData.password;
            delete submitData.password_confirmation;
        }

        // Ensure role_id is null (not 0 or empty string) when no role is selected
        if (submitData.role_id === null || submitData.role_id === undefined || submitData.role_id === 0) {
            submitData.role_id = null;
        }

        // Clean empty optional fields
        if (!submitData.cpf_cnpj) submitData.cpf_cnpj = undefined;
        if (!submitData.phone) submitData.phone = undefined;
        if (!submitData.mobile) submitData.mobile = undefined;
        if (!submitData.user_notes) submitData.user_notes = undefined;

        // Update form data before submission
        Object.keys(submitData).forEach((key) => {
            const typedKey = key as keyof UserFormData;
            setData(typedKey, submitData[typedKey]);
        });

        if (onSubmit) {
            onSubmit(submitData);
        } else {
            // Submit using Inertia directly - Inertia will use the form data automatically
            if (user) {
                put(route(routeName, { ...routeParams, user: user.id }), {
                    preserveScroll: true,
                });
            } else {
                post(route(routeName, routeParams), {
                    preserveScroll: true,
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Nome */}
                <div className="grid gap-2">
                    <Label htmlFor="name">
                        Nome <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Nome completo"
                        aria-invalid={errors.name ? true : undefined}
                    />
                    <InputError message={errors.name} />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                    <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="email@exemplo.com"
                        aria-invalid={errors.email ? true : undefined}
                    />
                    <InputError message={errors.email} />
                </div>

                {/* CPF/CNPJ */}
                <div className="grid gap-2">
                    <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                    <Input
                        id="cpf_cnpj"
                        value={data.cpf_cnpj}
                        onChange={(e) => setData('cpf_cnpj', e.target.value)}
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        aria-invalid={errors.cpf_cnpj ? true : undefined}
                    />
                    <InputError message={errors.cpf_cnpj} />
                </div>

                {/* Telefone */}
                <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="(00) 0000-0000"
                        aria-invalid={errors.phone ? true : undefined}
                    />
                    <InputError message={errors.phone} />
                </div>

                {/* Celular */}
                <div className="grid gap-2">
                    <Label htmlFor="mobile">Celular</Label>
                    <Input
                        id="mobile"
                        type="tel"
                        value={data.mobile}
                        onChange={(e) => setData('mobile', e.target.value)}
                        placeholder="(00) 00000-0000"
                        aria-invalid={errors.mobile ? true : undefined}
                    />
                    <InputError message={errors.mobile} />
                </div>

                {/* Cargo - Só aparece se o usuário tiver permissão assign_roles */}
                {canAssignRoles && (
                    <div className="grid gap-2">
                        <Label htmlFor="role_id">Cargo</Label>
                        <Select
                            value={data.role_id ? data.role_id.toString() : 'none'}
                            onValueChange={(value) => {
                                // Se value é 'none', seta null, senão converte para number
                                setData('role_id', value === 'none' ? null : Number(value));
                            }}
                        >
                            <SelectTrigger id="role_id" aria-invalid={errors.role_id ? true : undefined}>
                                <SelectValue placeholder="Selecione um cargo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sem cargo</SelectItem>
                                {Array.isArray(roles) && roles.length > 0
                                    ? roles.map((role) => {
                                          const roleId = role.id || role.name;
                                          return (
                                              <SelectItem key={roleId} value={roleId.toString()}>
                                                  {role.label || role.name}
                                              </SelectItem>
                                          );
                                      })
                                    : null}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role_id} />
                    </div>
                )}
            </div>

            {/* Senha */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="password">
                        {user ? 'Nova Senha' : 'Senha'} {!user && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        placeholder={user ? 'Deixe em branco para manter a atual' : 'Mínimo 8 caracteres'}
                        aria-invalid={errors.password ? true : undefined}
                    />
                    <InputError message={errors.password} />
                    {user && <p className="text-muted-foreground text-xs">Deixe em branco para manter a senha atual</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">
                        {user ? 'Confirmar Nova Senha' : 'Confirmar Senha'} {!user && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        placeholder="Confirme a senha"
                        aria-invalid={errors.password_confirmation ? true : undefined}
                    />
                    <InputError message={errors.password_confirmation} />
                </div>
            </div>

            {/* Status Ativo */}
            <div className="flex items-center space-x-2">
                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                <Label htmlFor="is_active" className="cursor-pointer text-sm font-normal">
                    Usuário ativo
                </Label>
                <InputError message={errors.is_active} />
            </div>

            {/* Notas */}
            <div className="grid gap-2">
                <Label htmlFor="user_notes">Notas</Label>
                <Textarea
                    id="user_notes"
                    value={data.user_notes}
                    onChange={(e) => setData('user_notes', e.target.value)}
                    placeholder="Informações adicionais sobre o usuário..."
                    rows={4}
                    aria-invalid={errors.user_notes ? true : undefined}
                />
                <InputError message={errors.user_notes} />
            </div>

            {/* Botões */}
            <div className="flex items-center gap-4">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Salvando...' : user ? 'Atualizar Usuário' : 'Criar Usuário'}
                </Button>
            </div>
        </form>
    );
}
