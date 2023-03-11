<?php

namespace DataMat;

class Path
{
    public string $currentPath;

    public function __construct(string $path)
    {
        $this->currentPath = $path;
    }

    public function cd(string $newPath) : Path
    {
        $parts = explode('/', $newPath);
        $currentPathParts = explode('/', $this->currentPath);

        foreach ($parts as $part) {
            if ($part === '..') {
                array_pop($currentPathParts);
                continue;
            }
            if ($part !== '.') {
                $currentPathParts[] = $part;
            }
        }

        $this->currentPath = rtrim(implode('/', $currentPathParts), '/');

        return $this;
    }
}
