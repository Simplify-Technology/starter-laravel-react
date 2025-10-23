import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { router } from '@inertiajs/react';
import {
  Calendar,
  Eye,
  Key,
  Mail,
  Phone,
  Settings,
  Shield,
  User,
  UserCheck
} from 'lucide-react';
import { useState } from 'react';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: number;
    name: string;
    email: string;
    cpf_cnpj?: string;
    phone?: string;
    mobile?: string;
    is_active: boolean;
    role?: {
      name: string;
      label: string;
    };
    permissions?: Array<{
      name: string;
      label: string;
    }>;
    custom_permissions_count: number;
    custom_permissions_list: Array<{
      name: string;
      label: string;
      meta?: {
        can_impersonate_any?: boolean;
      };
    }>;
    can_impersonate: boolean;
    created_at: string;
    updated_at: string;
  };
  canManagePermissions: boolean;
}

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
  canManagePermissions
}: UserDetailsDialogProps) {
  const [isImpersonating, setIsImpersonating] = useState(false);

  const handleImpersonate = () => {
    setIsImpersonating(true);
    router.post(route('users.impersonate', user.id), {}, {
      onSuccess: () => {
        // Redirect will happen automatically
      },
      onError: () => {
        setIsImpersonating(false);
      },
    });
  };

  const handleManagePermissions = () => {
    // This would open another dialog or navigate to permissions page
    router.visit(route('permissions.individual'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Detalhes do Usuário</span>
          </DialogTitle>
          <DialogDescription>
            Informações completas e permissões do usuário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {user.cpf_cnpj && (
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">CPF/CNPJ</p>
                      <p className="text-sm text-muted-foreground">{user.cpf_cnpj}</p>
                    </div>
                  </div>
                )}

                {user.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Telefone</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.mobile && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Celular</p>
                      <p className="text-sm text-muted-foreground">{user.mobile}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role and Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Papel e Permissões</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Papel Atual</p>
                {user.role ? (
                  <Badge variant="outline" className="text-sm">
                    {user.role.label}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Nenhum papel atribuído</span>
                )}
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Permissões Individuais</p>
                  <Badge variant="secondary">
                    {user.custom_permissions_count} permissões
                  </Badge>
                </div>

                {user.custom_permissions_list.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.custom_permissions_list.map((permission) => (
                      <Badge key={permission.name} variant="outline" className="text-xs">
                        {permission.label}
                        {permission.meta?.can_impersonate_any && (
                          <span className="ml-1 text-amber-600">(Qualquer)</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Nenhuma permissão individual</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            {user.can_impersonate && (
              <Button
                onClick={handleImpersonate}
                disabled={isImpersonating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {isImpersonating ? 'Personificando...' : 'Personificar Usuário'}
              </Button>
            )}

            {canManagePermissions && (
              <Button
                variant="outline"
                onClick={handleManagePermissions}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Permissões
              </Button>
            )}

            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <Eye className="h-4 w-4 mr-2" />
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
