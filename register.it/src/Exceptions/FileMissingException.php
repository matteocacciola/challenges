<?php

namespace App\Exceptions;

class FileMissingException extends \Exception
{
    protected $message = 'File does not exist';
}