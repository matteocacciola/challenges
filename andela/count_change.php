<?php
function count_change(int $money, array $coins): int
{
    // Create a dynamic programming table to store the solutions
    $dynamic_table = array_fill(0, $money + 1, 0);
    $dynamic_table[0] = 1;

    // Iterate through all coin denominations
    foreach ($coins as $coin) {
        // Update the table for each coin denomination
        for ($i = $coin; $i <= $money; $i++) {
            $dynamic_table[$i] += $dynamic_table[$i - $coin];
        }
    }

    // Return the total number of ways to make change for the amount
    return $dynamic_table[$money];
}