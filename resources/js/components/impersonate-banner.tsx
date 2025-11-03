import { router } from '@inertiajs/react';

interface ImpersonateBannerProps {
  active: boolean;
  originalUserName: string | null;
  impersonatedUserName: string | null;
}

export function ImpersonateBanner({ active, originalUserName, impersonatedUserName }: ImpersonateBannerProps) {
  if (!active) {
    return null;
  }

  const stopImpersonation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.delete(route('users.impersonate.stop'));
  };

  // Mostra o nome do usuário que está sendo impersonado (não o impersonador)
  const displayName = impersonatedUserName || originalUserName || 'este usuário';

  return (
    <div className="bg-teal-500 text-white py-1.5 px-4 text-center rounded-md text-sm mb-2">
      <span>
        Você está impersonando <strong>{displayName}</strong>,{' '}
        <a
          href="#"
          onClick={stopImpersonation}
          className="underline hover:no-underline cursor-pointer"
        >
          clique aqui para sair
        </a>
        .
      </span>
    </div>
  );
}
