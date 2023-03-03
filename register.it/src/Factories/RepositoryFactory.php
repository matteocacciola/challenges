<?php

namespace App\Factories;

use App\Config\Config;
use App\Repositories\RepositoryInterface;

class RepositoryFactory
{
    public static function build(): RepositoryInterface
    {
        $config = Config::loadYaml(getenv('CONFIG_PATH') . '/report.yaml');

        $source = $config->get('report.source');

        $class = RepositoryInterface::NAMESPACE . '\\' . ucfirst($source) . 'Repository';
        if (class_exists($class)) {
            return new $class();
        }

        throw new \Exception('The repository ' . $class . ' does not exist.');
    }
}