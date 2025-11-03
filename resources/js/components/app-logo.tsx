import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            {/* Fallback para quando a imagem existir */}
            {/*<div className="bg-card-foreground dark:bg-card flex aspect-square size-8 items-center justify-center rounded-md">*/}
            {/*    <img src="/storage/logos/icon-simplify.png" className={'h-full rounded-md object-cover'} alt="Logo" />*/}
            {/*</div>*/}
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Simplify Starter Kit</span>
            </div>
        </>
    );
}
