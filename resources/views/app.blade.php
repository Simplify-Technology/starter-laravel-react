<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
<head >
    <meta charset="utf-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1" >

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script >
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script >

    {{-- Inline style to set the HTML background color --}}
    <style >
        html {
            background-color: white;
            transition: background-color 0.2s ease;
        }

        html.dark {
            background-color: var(--color-primary-dark);
            transition: background-color 0.2s ease;
        }
    </style >


    <title inertia >{{ config('app.name', 'Laravel') }}</title >

    {{-- Preload fonts for immediate availability --}}
    {{-- Aptos: UI, menus e navegação --}}
    <link rel="preload" href="/fonts/woff2/aptos/aptos.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <link rel="preload" href="/fonts/woff2/aptos/aptos-semibold.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <link rel="preload" href="/fonts/woff2/aptos/aptos-bold.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    {{-- Montserrat: Títulos e indicadores-chave --}}
    <link rel="preload" href="/fonts/woff2/montserrat/montserrat-v31-latin-800.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    {{-- Merriweather Sans: Subtítulos e textos de apoio --}}
    <link rel="preload" href="/fonts/woff2/merriweather-sans/merriweather-sans-v28-latin-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">

    <link rel="preconnect" href="https://fonts.bunny.net" >

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head >
<body class="font-sans antialiased" >
@inertia
</body >
</html >
