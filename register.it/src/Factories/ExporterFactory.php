<?php

namespace App\Factories;

use App\Config\Config;
use App\Services\Export\ExporterInterface;

class ExporterFactory
{
    public static function build(): ExporterInterface
    {
        $config = Config::loadYaml(getenv('CONFIG_PATH') . '/report.yaml');

        $source = $config->get('report.format');

        $class = ExporterInterface::NAMESPACE . '\\' . ucfirst($source) . 'Exporter';
        if (class_exists($class)) {
            return new $class();
        }

        throw new \Exception('The exporter ' . $class . ' does not exist.');
    }
}