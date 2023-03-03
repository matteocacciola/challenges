<?php

namespace App\Models;

class DataRow
{
    /**
     * @var int
     */
    private $timestamp;

    /**
     * @var int
     */
    private $bytes;

    /**
     * @var string
     */
    private $status;

    /**
     * @var string
     */
    private $remoteAddress;

    public function __construct(int $timestamp, int $bytes, string $status, string $remoteAddress)
    {
        $this->timestamp = $timestamp;
        $this->bytes = $bytes;
        $this->status = trim($status);
        $this->remoteAddress = trim($remoteAddress);
    }

    /**
     * @return int
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * @return int
     */
    public function getBytes()
    {
        return $this->bytes;
    }

    /**
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @return string
     */
    public function getRemoteAddress()
    {
        return $this->remoteAddress;
    }
}