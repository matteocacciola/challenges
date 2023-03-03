<?php

namespace App\Repositories;

use App\Exceptions\FileMissingException;
use App\Models\DataRow;
use App\Models\DataSet;
use App\Traits\HasConfig;

class FileRepository implements RepositoryInterface
{
    use HasConfig;

    protected $source;

    public function __construct()
    {
        $this->load(getenv('CONFIG_PATH') . '/report/file.yaml');

        $this->source = $this->config->get('path');
    }

    public function findByDateAndStatus(\DateTimeInterface $date, string $status): DataSet
    {
        $lines = $this->parseFile(function ($row) use ($date, $status) {
            [$rowTimestamp, $rowBytes, $rowStatus, $rowRemoteAddress] = $row;
            $rowDate = (new \DateTimeImmutable())->setTimestamp($rowTimestamp);

            return $rowDate->format('Y-m-d') === $date->format('Y-m-d') && $rowStatus === $status;
        }, ';');

        $dataset = new DataSet();
        foreach ($lines as $line) {
            $dataset->add(new DataRow(...$line));
        }

        return $dataset;
    }

    /**
     * @param callable $callback
     * @param string $separator
     *
     * @return array
     * @throws FileMissingException
     */
    private function parseFile(callable $callback, string $separator = ','): array
    {
        if (!file_exists($this->source)) {
            throw new FileMissingException();
        }

        $handle = fopen($this->source, 'rb');

        $results = [];
        while (($line = fgets($handle)) !== false) {
            // [timestamp, bytes, status, remote_address
            $row = explode($separator, $line);

            if ($callback($row)) {
                $results[] = $row;
            }
        }

        fclose($handle);

        return $results;
    }
}