<?php

namespace App\Services\Export;

use App\Models\DataSet;

interface ExporterInterface
{
    public const NAMESPACE = __NAMESPACE__;

    public function export(DataSet $dataSet): void;
}