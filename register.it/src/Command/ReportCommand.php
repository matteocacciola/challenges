<?php

namespace App\Command;

use App\Factories\ExporterFactory;
use App\Factories\RepositoryFactory;

class ReportCommand
{
    public function __invoke(): void
    {
        $repository = RepositoryFactory::build();
        $exporter = ExporterFactory::build();

        $exporter->export(
            $repository->findByDateAndStatus(new \DateTimeImmutable(), 'OK')
        );
    }
}