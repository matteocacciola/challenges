<?php

namespace App;

class Helpers
{
    public static function printPrettyArray(array $array)
    {
        self::printPretty(print_r($array, true));
    }

    public static function printPrettyJson(array $array)
    {
        self::printPretty(self::prettyJson($array));
    }

    public static function prettyJson(array $array): string
    {
        return json_encode($array, JSON_PRETTY_PRINT);
    }

    public static function printPretty(string $string)
    {
        echo '<pre>' . $string . '<pre/>';
    }
}