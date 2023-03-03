<?php

namespace App\Models;

class DataSet
{
    protected $items;

    public function __construct()
    {
        $this->items = [];
    }

    /**
     * @param DataRow $dataSet
     *
     * @return $this
     */
    public function add(DataRow $dataSet): DataSet
    {
        $ipAddress = $dataSet->getRemoteAddress();

        $numRequests = $totalBytesSent = 0;

        if (isset($this->items[$ipAddress])) {
            $numRequests = $this->items[$ipAddress]['num_requests'];
            $totalBytesSent = $this->items[$ipAddress]['bytes_sent'];
        }

        $this->items[$ipAddress] = [
            'num_requests' => $numRequests + 1,
            'bytes_sent' => $totalBytesSent + $dataSet->getBytes()
        ];

        return $this;
    }

    /**
     * @param DataRow $dataSet
     *
     * @return $this
     */
    public function remove(DataRow $dataSet): DataSet
    {
        $ipAddress = $dataSet->getRemoteAddress();

        if (isset($this->items[$ipAddress])) {
            $this->items[$ipAddress]['num_requests'] = max(0, $this->items[$ipAddress]['num_requests'] - 1);
            $this->items[$ipAddress]['bytes_sent'] = max(0, $this->items[$ipAddress]['bytes_sent'] - $dataSet->getBytes());
        }

        return $this;
    }

    /**
     * @return $this
     */
    protected function build(): DataSet
    {
        $totalAmountOfRequests = array_sum(array_column($this->items, 'num_requests'));
        $totalAmountOfBytes = array_sum(array_column($this->items, 'bytes_sent'));

        foreach ($this->items as &$item) {
            $item['percentage_requests'] = $item['num_requests'] / $totalAmountOfRequests;
            $item['bytes_percentage'] = $item['bytes_sent'] / $totalAmountOfBytes;
        }
        unset($item);

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        $this->build();

        $results = [];
        foreach ($this->items as $ipAddress => $item) {
            $results[] = $item + ['ip_address' => $ipAddress];
        }

        return $results;
    }
}