<?php

namespace App\Repositories;

use App\Models\DataSet;

interface RepositoryInterface
{
    public const NAMESPACE = __NAMESPACE__;

    public function findByDateAndStatus(\DateTimeInterface $date, string $status): DataSet;
}