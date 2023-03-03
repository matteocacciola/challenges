<?php

use App\Command\ReportCommand;
use App\Helpers;

require '../vendor/autoload.php';

$basePath = __DIR__ . '/..';

putenv('APP_PATH=' . $basePath);
putenv('PUBLIC_PATH=' . str_replace('//', '/', $basePath . '/public'));
putenv('CONFIG_PATH=' . str_replace('//', '/', $basePath . '/config'));

try {
    $command = new ReportCommand();
    $command();

    echo 'Export completed';
} catch (\Exception $exception) {
    Helpers::printPretty($exception->getMessage());
    Helpers::printPretty($exception->getTraceAsString());
}

