<?php

declare(strict_types = 1);

use Rector\Config\RectorConfig;
use Rector\DeadCode\Rector\Property\RemoveUselessReadOnlyTagRector;
use Rector\Exception\Configuration\InvalidConfigurationException;
use Rector\TypeDeclaration\Rector\Property\TypedPropertyFromStrictConstructorRector;

try {
    return RectorConfig::configure()
        ->withPaths([
            __DIR__ . '/app',
            __DIR__ . '/bootstrap/app.php',
            __DIR__ . '/database',
            __DIR__ . '/routes',
        ])
        // uncomment to reach your current PHP version
//        ->withPhpSets()
        ->withPhpVersion(PHP_VERSION_ID)
        ->withRules([
            TypedPropertyFromStrictConstructorRector::class
        ])
        ->withTypeCoverageLevel(0)
        ->withPreparedSets(
            deadCode: true,
            codeQuality: true
        )
        ->withSkip([
            RemoveUselessReadOnlyTagRector::class

        ]);
} catch (InvalidConfigurationException $e) {
    echo $e->getMessage();
}
