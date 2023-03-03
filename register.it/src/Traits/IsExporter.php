<?php

namespace App\Traits;

use App\Config\Config;

trait IsExporter
{
    /** @var string */
    protected $path;

    /** @var string */
    protected $filename;

    protected $extension;

    /**
     * @param Config $config
     *
     * @return void
     */
    protected function buildPath(Config $config): void
    {
        $this->path = $config->get('report.destination.folder');

        if (!is_dir($this->path) && !mkdir($concurrentDirectory = $this->path, 0755, true) && !is_dir($concurrentDirectory)) {
            throw new \RuntimeException(sprintf('Directory "%s" was not created', $concurrentDirectory));
        }

        $this->filename = $config->get('report.destination.prefix') . '_' . (new \DateTime())->format('Ymd');
    }

    /**
     * @return string
     */
    protected function getFullPath(): string
    {
        return str_replace(
            DIRECTORY_SEPARATOR . DIRECTORY_SEPARATOR,
            DIRECTORY_SEPARATOR,
            $this->path . DIRECTORY_SEPARATOR . $this->filename . '.' . $this->extension
        );
    }
}