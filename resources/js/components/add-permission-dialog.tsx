import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AddPermissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: {
        id: number;
        name: string;
        custom_permissions_list: Array<{
            name: string;
            label: string;
            meta?: {
                can_impersonate_any?: boolean;
            };
        }>;
    };
}

interface Permission {
    id: number;
    name: string;
    label: string;
}

export function AddPermissionDialog({ open, onOpenChange, user }: AddPermissionDialogProps) {
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [selectedPermission, setSelectedPermission] = useState<string>('');
    const [canImpersonateAny, setCanImpersonateAny] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch permissions when dialog opens
    useEffect(() => {
        if (open) {
            setIsLoading(true);
            fetch(route('users.permissions.show', user.id))
                .then((res) => res.json())
                .then((data) => {
                    setAllPermissions(data.all_permissions || []);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, [open, user.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPermission) return;

        setIsSubmitting(true);

        const formData = {
            permission: selectedPermission,
            ...(selectedPermission === 'impersonate_users' && { can_impersonate_any: canImpersonateAny }),
        };

        router.post(route('users.permissions.grant', user.id), formData, {
            onSuccess: () => {
                onOpenChange(false);
                setSelectedPermission('');
                setCanImpersonateAny(false);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleClose = () => {
        onOpenChange(false);
        setSelectedPermission('');
        setCanImpersonateAny(false);
    };

    // Get available permissions (not already assigned)
    const userPermissionNames = user.custom_permissions_list.map((p) => p.name);
    const availablePermissions = allPermissions.filter((p) => !userPermissionNames.includes(p.name));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Adicionar Permissão</span>
                    </DialogTitle>
                    <DialogDescription>
                        Conceder uma nova permissão individual para <strong>{user.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Permission Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="permission">Permissão</Label>
                        <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma permissão" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading ? (
                                    <div className="text-muted-foreground px-2 py-1.5 text-sm">Carregando permissões...</div>
                                ) : availablePermissions.length === 0 ? (
                                    <div className="text-muted-foreground px-2 py-1.5 text-sm">Todas as permissões já foram concedidas</div>
                                ) : (
                                    availablePermissions.map((permission) => (
                                        <SelectItem key={permission.id} value={permission.name}>
                                            {permission.label}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Special options for impersonate_users permission */}
                    {selectedPermission === 'impersonate_users' && (
                        <Card className="border-amber-200 bg-amber-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center space-x-2 text-sm">
                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                    <span>Opções Especiais</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="can_impersonate_any"
                                        checked={canImpersonateAny}
                                        onCheckedChange={(checked) => setCanImpersonateAny(checked as boolean)}
                                    />
                                    <Label htmlFor="can_impersonate_any" className="text-sm">
                                        Pode personificar qualquer usuário (incluindo SUPER_USER)
                                    </Label>
                                </div>
                                <p className="mt-2 text-xs text-amber-700">
                                    Se desmarcado, só poderá personificar usuários com papel de menor prioridade.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current permissions preview */}
                    {user.custom_permissions_list.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <Label className="text-sm font-medium">Permissões Atuais</Label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {user.custom_permissions_list.map((permission) => (
                                        <Badge key={permission.name} variant="outline" className="text-xs">
                                            {permission.label}
                                            {permission.meta?.can_impersonate_any && <span className="ml-1 text-amber-600">(Qualquer)</span>}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedPermission || isSubmitting || availablePermissions.length === 0}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Concedendo...' : 'Conceder Permissão'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
