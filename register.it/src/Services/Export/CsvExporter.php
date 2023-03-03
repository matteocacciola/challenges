<?php

namespace App\Services\Export;

use App\Models\DataSet;
use App\Traits\HasConfig;
use App\Traits\IsExporter;

class CsvExporter implements ExporterInterface
{
    use IsExporter;
    use HasConfig;

    public function __construct()
    {
        $this->load(getenv('CONFIG_PATH') . '/report.yaml');
        $this->buildPath($this->config);

        $this->extension = 'csv';
    }

    /**
     * @param DataSet $dataSet
     *
     * @return void
     */
    public function export(DataSet $dataSet) : void
    {
        $file = $this->getFullPath();

        $fp = fopen($file, 'wb');

        foreach ($dataSet->toArray() as $item) {
            fputcsv($fp, $item);
        }

        fclose($fp);
    }
}