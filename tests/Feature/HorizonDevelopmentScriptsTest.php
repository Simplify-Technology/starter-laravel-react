<?php

it('runs Horizon and the scheduler in local development scripts', function(): void {
    $composer = json_decode(file_get_contents(base_path('composer.json')), true, 512, JSON_THROW_ON_ERROR);

    expect($composer['scripts']['dev'][1])->toContain('php artisan horizon:listen')
        ->and($composer['scripts']['dev'][1])->toContain('php artisan schedule:work')
        ->and($composer['scripts']['dev:ssr'][2])->toContain('php artisan horizon:listen')
        ->and($composer['scripts']['dev:ssr'][2])->toContain('php artisan schedule:work');
});

it('exposes a deployment-safe Horizon termination script and watcher dependency', function(): void {
    $composer = json_decode(file_get_contents(base_path('composer.json')), true, 512, JSON_THROW_ON_ERROR);
    $package  = json_decode(file_get_contents(base_path('package.json')), true, 512, JSON_THROW_ON_ERROR);

    expect($composer['scripts']['horizon:terminate'])->toBe('@php artisan horizon:terminate')
        ->and($package['devDependencies'])->toHaveKey('chokidar')
        ->and($package['devDependencies']['chokidar'])->not->toBeEmpty();
});
