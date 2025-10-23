import { router } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ImpersonateBannerProps {
  active: boolean;
  originalUserName: string | null;
}

export function ImpersonateBanner({ active, originalUserName }: ImpersonateBannerProps) {
  if (!active) {
    return null;
  }

  const stopImpersonation = () => {
    router.delete(route('users.impersonate.stop'));
  };

  return (
    <div className="bg-yellow-500 text-white p-2 text-center flex items-center justify-center gap-2 text-sm">
      <XCircle className="h-4 w-4" />
      <span>
        Você está personificando a conta de <strong>{originalUserName}</strong>.
      </span>
      <Button
        onClick={stopImpersonation}
        variant="secondary"
        size="sm"
        className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        Voltar para minha conta
      </Button>
    </div>
  );
}
