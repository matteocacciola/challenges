<?php


function prime(int $n) : bool
{
    if ($n === 1) {
        return true;
    }

    for ($i = 2; $i < sqrt($n); $i++) {
        if ($n % $i === 0) {
            return false;
        }
    }

    return true;
}

$n = 1989343486843;
if (prime($n)) {
    print_r("$n è primo");
} else {
    print_r("$n non è primo");
}