<?php

namespace DataMat;

class ShoppersCoverages
{
    private array $shoppers;

    public function __construct(array $shoppers)
    {
        $this->shoppers = $shoppers;
    }

    private function isLocationReachable(array $shopper, array $location, float $radius) : bool
    {
        $haversine = new Haversine();

        return $shopper['enabled'] && $haversine($shopper['lat'], $shopper['lng'], $location['lat'], $location['lng']) < $radius;
    }

    private function sort(array &$coverages) : void
    {
        usort($coverages, static function($a, $b) {
            return $b['coverage'] - $a['coverage'];
        });
    }

    /**
     * This is the implementation of the method where items in $locations with the same id are considered as the same zone
     * and the different coordinates in the same zone are considered as points in the same zone. Therefore, a $shopper
     * covers a zone only if the shopper itself can reach all the listed points in the same zone, i.e. all the listed points
     * in $locations with the same id
     *
     * @param array $locations
     * @param float $radius
     *
     * @return array
     */
    public function calculateLocations(array $locations, float $radius) : array
    {
        $shopperCoverages = [];
        $numZones = count(
            array_unique(array_column($locations, 'id'))
        );

        foreach ($this->shoppers as $shopper) {
            $zonesCovered = [];
            foreach ($locations as $location) {
                $zonesCovered[$location['id']] = (int) $this->isLocationReachable($shopper, $location, $radius);
            }

            $shopperCoverages[] = ['shopper_id' => $shopper['id'], 'coverage' => array_sum($zonesCovered) * 100 / $numZones];
        }

        $this->sort($shopperCoverages);

        return $shopperCoverages;
    }

    /**
     * This is an implementation simpler than the previous one, where items in $locations are considered as different zones,
     * regardless if the id is repeated.
     *
     * @param array $zones
     * @param int $radius
     *
     * @return array
     */
    public function calculateZones(array $zones, int $radius) : array
    {
        $shopperCoverages = [];
        $numZones = count($zones);

        foreach ($this->shoppers as $shopper) {
            $numZonesCovered = 0;
            foreach ($zones as $zone) {
                $numZonesCovered += (int) $this->isLocationReachable($shopper, $zone, $radius);
            }

            $shopperCoverages[] = ['shopper_id' => $shopper['id'], 'coverage' => $numZonesCovered * 100 / $numZones];
        }

        $this->sort($shopperCoverages);

        return $shopperCoverages;
    }
}