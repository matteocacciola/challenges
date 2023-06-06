<?php
function sort_csv_columns(string $csv_data): string
{
    $lines = array_map(static fn ($line) => explode(',', $line), explode("\n", $csv_data));
    $headers = $sorted_headers = $lines[0];
    $n_cols = count($headers);

    sort($sorted_headers, SORT_STRING | SORT_FLAG_CASE);
    $column_order = array_map(static fn ($col) => array_search($col, $sorted_headers, true), $headers);

    $result = [];
    foreach ($lines as $line) {
        $new_line = array_fill(0, $n_cols, NULL);
        foreach ($line as $i => $cell) {
            $new_line[$column_order[$i]] = $cell;
        }
        $result[] = $new_line;
    }
    return implode("\n", array_map(static fn ($el) => implode(',', $el), $result));
}