<?php

beforeEach(function(): void {
    $this->environmentKeys = [
        'APP_NAME',
        'CACHE_PREFIX',
        'REDIS_PREFIX',
        'SESSION_COOKIE',
    ];

    $this->environmentSnapshot = collect($this->environmentKeys)
        ->mapWithKeys(function(string $key): array {
            $value = getenv($key);

            return [$key => $value === false ? null : $value];
        })
        ->all();
});

afterEach(function(): void {
    foreach ($this->environmentSnapshot as $key => $value) {
        setEnvironmentValue($key, $value);
    }
});

it('uses Laravel 13 cache and session defaults when overrides are absent', function(): void {
    setEnvironmentValue('APP_NAME', 'Boilerplate App');
    setEnvironmentValue('CACHE_PREFIX', null);
    setEnvironmentValue('REDIS_PREFIX', null);
    setEnvironmentValue('SESSION_COOKIE', null);

    $cacheConfig    = require config_path('cache.php');
    $databaseConfig = require config_path('database.php');
    $sessionConfig  = require config_path('session.php');

    expect($cacheConfig['prefix'])->toBe('boilerplate-app-cache-')
        ->and($cacheConfig['serializable_classes'])->toBeFalse()
        ->and($databaseConfig['redis']['options']['prefix'])->toBe('boilerplate-app-database-')
        ->and($sessionConfig['cookie'])->toBe('boilerplate-app-session');
});

it('honors explicit cache and session overrides to avoid namespace churn', function(): void {
    setEnvironmentValue('APP_NAME', 'Boilerplate App');
    setEnvironmentValue('CACHE_PREFIX', 'legacy_cache_');
    setEnvironmentValue('REDIS_PREFIX', 'legacy_database_');
    setEnvironmentValue('SESSION_COOKIE', 'legacy_session');

    $cacheConfig    = require config_path('cache.php');
    $databaseConfig = require config_path('database.php');
    $sessionConfig  = require config_path('session.php');

    expect($cacheConfig['prefix'])->toBe('legacy_cache_')
        ->and($databaseConfig['redis']['options']['prefix'])->toBe('legacy_database_')
        ->and($sessionConfig['cookie'])->toBe('legacy_session');
});

function setEnvironmentValue(string $key, ?string $value): void
{
    if ($value === null) {
        putenv($key);
        unset($_ENV[$key], $_SERVER[$key]);

        return;
    }

    putenv("{$key}={$value}");
    $_ENV[$key]    = $value;
    $_SERVER[$key] = $value;
}
