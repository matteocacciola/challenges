<?php

namespace App\Config;

use Noodlehaus\Config as BaseConfig;
use Noodlehaus\Parser\Yaml;

class Config extends BaseConfig
{
    public static function loadYaml($values, ?bool $string = false)
    {
        return parent::load($values, new Yaml(), $string);
    }

    public function get($key, $default = null)
    {
        $var = parent::get($key, $default);

        return str_replace(
            ['%app_path%', '%config_path%', '%public_path%'],
            [getenv('APP_PATH'), getenv('CONFIG_PATH'), getenv('PUBLIC_PATH')],
            $var
        );
    }
}