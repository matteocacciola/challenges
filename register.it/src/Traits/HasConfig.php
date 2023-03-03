<?php

namespace App\Traits;

use App\Config\Config;

trait HasConfig
{
    /** @var Config */
    protected $config;

    /**
     * @param string $yaml
     *
     * @return void
     */
    public function load(string $yaml): void
    {
        $this->config = Config::loadYaml($yaml);
    }

    public function getConfig(): Config
    {
        return $this->config;
    }
}