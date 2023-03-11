<?php

namespace tests;

use DataMat\ShoppersCoverages;
use PHPUnit\Framework\TestCase;

final class ShoppersCoveragesTest extends TestCase
{
    private $shoppersCoverages;

    protected function setUp() : void
    {
        parent::setUp();
        $shoppers = [
            ['id' => 'S1', 'lat' => 45.46, 'lng' => 11.03, 'enabled' => true],
            ['id' => 'S2', 'lat' => 45.46, 'lng' => 10.12, 'enabled' => true],
            ['id' => 'S3', 'lat' => 45.34, 'lng' => 10.81, 'enabled' => true],
            ['id' => 'S4', 'lat' => 45.76, 'lng' => 10.57, 'enabled' => true],
            ['id' => 'S5', 'lat' => 45.34, 'lng' => 10.63, 'enabled' => true],
            ['id' => 'S6', 'lat' => 45.42, 'lng' => 10.81, 'enabled' => true],
            ['id' => 'S7', 'lat' => 45.34, 'lng' => 10.94, 'enabled' => true],
        ];
        $this->shoppersCoverages = new ShoppersCoverages($shoppers);
    }

    public function testDistanceTenKilometersByLocations() : void
    {
        $locations = [
            ['id' => 1000, 'zip_code' => '37069', 'lat' => 45.35, 'lng' => 10.84],
            ['id' => 1001, 'zip_code' => '37121', 'lat' => 45.44, 'lng' => 10.99],
            ['id' => 1001, 'zip_code' => '37129', 'lat' => 45.44, 'lng' => 11.00],
            ['id' => 1001, 'zip_code' => '37133', 'lat' => 45.43, 'lng' => 11.02],
    	];

        $expected = [
            ['shopper_id' => 'S1', 'coverage' => 50],
            ['shopper_id' => 'S3', 'coverage' => 50],
            ['shopper_id' => 'S6', 'coverage' => 50],
            ['shopper_id' => 'S7', 'coverage' => 50],
            ['shopper_id' => 'S2', 'coverage' => 0],
            ['shopper_id' => 'S4', 'coverage' => 0],
            ['shopper_id' => 'S5', 'coverage' => 0],
        ];

        $this->assertSame($expected, $this->shoppersCoverages->calculateLocations($locations, 10));
    }

    public function testDistanceTenKilometersByZoness() : void
    {
        $zones = [
            ['id' => 1000, 'zip_code' => '37069', 'lat' => 45.35, 'lng' => 10.84],
            ['id' => 1001, 'zip_code' => '37121', 'lat' => 45.44, 'lng' => 10.99],
            ['id' => 1001, 'zip_code' => '37129', 'lat' => 45.44, 'lng' => 11.00],
            ['id' => 1001, 'zip_code' => '37133', 'lat' => 45.43, 'lng' => 11.02],
        ];

        $expected = [
            ['shopper_id' => 'S1', 'coverage' => 75],
            ['shopper_id' => 'S3', 'coverage' => 25],
            ['shopper_id' => 'S6', 'coverage' => 25],
            ['shopper_id' => 'S7', 'coverage' => 25],
            ['shopper_id' => 'S2', 'coverage' => 0],
            ['shopper_id' => 'S4', 'coverage' => 0],
            ['shopper_id' => 'S5', 'coverage' => 0],
        ];

        $this->assertSame($expected, $this->shoppersCoverages->calculateZones($zones, 10));
    }
}