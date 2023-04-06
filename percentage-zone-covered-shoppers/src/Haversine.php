<?php

namespace DataMat;

class Haversine
{
    private const EARTH_RADIUS = 6371;

    public function __invoke(float $fromLat, float $fromLon, float $toLat, float $toLon) : float
    {
        $distLat = deg2rad($toLat - $fromLat);
        $distLon = deg2rad($toLon - $fromLon);

        $sin2Lat = sin($distLat/2) * sin($distLat/2);
        $cos2Lat = cos(deg2rad($fromLat)) * cos(deg2rad($toLat));
        $sin2Lon = sin($distLon/2) * sin($distLon/2);

        return round(2 * self::EARTH_RADIUS * asin(sqrt($sin2Lat + $cos2Lat * $sin2Lon)));
    }
}