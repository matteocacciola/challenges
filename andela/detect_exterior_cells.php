<?php
function is_valid_cell($x, $y, $rows, $cols) : bool
{
    return ($x >= 0 && $x < $rows && $y >= 0 && $y < $cols);
}

function dfs(&$grid, &$visited, $x, $y, $dx, $dy, $rows, $cols)
{
    $visited[$x][$y] = true;
    $grid[$x][$y] = '.';

    for ($i = 0; $i < 4; $i++) {
        $newX = $x + $dx[$i];
        $newY = $y + $dy[$i];

        if (is_valid_cell($newX, $newY, $rows, $cols) && !$visited[$newX][$newY] && $grid[$newX][$newY] === ' ') {
            dfs($grid, $visited, $newX, $newY, $dx, $dy, $rows, $cols);
        }
    }
}

function detect_exterior_cells($grid) {
    $rows = count($grid);
    $cols = strlen($grid[0]);
    $visited = array_fill(0, $rows, array_fill(0, $cols, false));

    $dx = [-1, 1, 0, 0];
    $dy = [0, 0, -1, 1];

    $startX = -1;
    $startY = -1;

    foreach ($grid as $i => $iValue) {
        for ($j = 0; $j < $cols; $j++) {
            if ($iValue[$j] === ' ') {
                $startX = $i;
                $startY = $j;
                break 2;
            }
        }
    }

    dfs($grid, $visited, $startX, $startY, $dx, $dy, $rows, $cols);

    return $grid;
}
