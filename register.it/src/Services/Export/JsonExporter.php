<?php

namespace App\Services\Export;

use App\Helpers;
use App\Models\DataSet;
use App\Traits\HasConfig;
use App\Traits\IsExporter;

class JsonExporter implements ExporterInterface
{
    use IsExporter;
    use HasConfig;

    public function __construct()
    {
        $this->load(getenv('CONFIG_PATH') . '/report.yaml');
        $this->buildPath($this->config);

        $this->extension = 'json';
    }

    public function export(DataSet $dataSet) : void
    {
        $file = $this->getFullPath();

        $fp = fopen($file, 'wb');

        fwrite($fp, Helpers::prettyJson($dataSet->toArray()));

        fclose($fp);
    }
}