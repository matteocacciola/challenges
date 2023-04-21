<?php

declare(strict_types = 1);

class Matrix
{
    protected array $rows;
    protected int $numRows;
    protected int $numCols;

    /**
     * @param float[][] $rows
     */
    public function __construct(array $rows)
    {
        $this->validate($rows);

        $this->rows = $rows;
        $this->numRows = count($rows);
        $this->numCols = count($rows[0]);
    }

    public static function fromIdentity(int $numRows, int $numCols): Matrix
    {
        return new Matrix(array_fill(0, $numRows, array_fill(0, $numCols, 1)));
    }

    public static function fromZeros(int $numRows, int $numCols): Matrix
    {
        return new Matrix(array_fill(0, $numRows, array_fill(0, $numCols, 0)));
    }

    /**
     * @return float[][]
     */
    public function getRows(): array
    {
        return $this->rows;
    }

    public function getNumRows(): int
    {
        return $this->numRows;
    }

    public function getNumCols(): int
    {
        return $this->numCols;
    }

    /**
     * @param float[][] $rows
     */
    protected function validate(array $rows): void
    {
        $nCols = count($rows[0]);
        foreach ($rows as $row) {
            if (count($row) !== $nCols) {
                throw new RuntimeException('The number of elements in each column should be equal.');
            }
        }
    }

    protected function canOperate(Matrix $matrix): bool
    {
        $rows = $matrix->getRows();
        $this->validate($rows);
        return $matrix->getNumRows() === $this->numRows && $matrix->getNumCols() === $this->numCols;
    }

    protected function operation(callable $callback, Matrix $matrix): Matrix
    {
        if (!$this->canOperate($matrix)) {
            throw new \RuntimeException('Operation is not permitted since the matrices have not the same dimensions');
        }

        $result = self::fromZeros($this->numRows, $this->numCols)->getRows();
        foreach ($matrix->getRows() as $i => $row) {
            foreach ($row as $j => $item) {
                $result[$i][$j] = $callback($this->rows[$i][$j], $item);
            }
        }

        return new Matrix($result);
    }

    public function add(Matrix $matrix): Matrix
    {
        return $this->operation(fn ($a, $b) => $a + $b, $matrix);
    }

    public function subtract(Matrix $matrix): Matrix
    {
        return $this->operation(fn ($a, $b) => $a - $b, $matrix);
    }

    public function scaleBy(float $number): Matrix
    {
        $result = self::fromZeros($this->numRows, $this->numCols)->getRows();

        foreach ($this->rows as $i => $row) {
            foreach ($row as $j => $item) {
                $result[$i][$j] = $item * $number;
            }
        }

        return new Matrix($result);
    }

    public function multiply(Matrix $matrix): Matrix
    {
        if ($this->numCols !== $matrix->getNumRows()) {
            throw new \RuntimeException('The number of columns of this matrix is not equal to the number of rows of the given matrix.');
        }

        $matrixRows = $matrix->getRows();
        $result = self::fromZeros($this->numRows, $matrix->getNumCols())->getRows();

        for ($i = 0; $i < $this->numRows; $i++) {
            for ($j = 0; $j < $matrix->getNumCols(); $j++) {
                for ($k = 0; $k < $this->numCols; $k++) {
                    $result[$i][$j] += $this->rows[$i][$k] * $matrixRows[$k][$j];
                }
            }
        }

        return new Matrix($result);
    }

    public function transpose(): Matrix
    {
        $result = self::fromZeros($this->numCols, $this->numRows)->getRows();
        foreach ($this->rows as $i => $row) {
            foreach ($row as $j => $item) {
                $result[$j][$i] = $item;
            }
        }

        return new Matrix($result);
    }
}

class SquaredMatrix extends Matrix
{
    /**
     * @inheritDoc
     */
    protected function validate(array $rows): void
    {
        parent::validate($rows);

        if (count($rows) !== count($rows[0])) {
            throw new \RuntimeException('The matrix is not squared.');
        }
    }

    public function determinant(): float
    {
        return $this->calculateDeterminant($this->rows);
    }

    /**
     * @param float[][] $rows
     *
     * @return float
     */
    private function calculateDeterminant(array $rows): float
    {
        if (count($rows) === 1) {
            return $rows[0][0];
        }

        if (count($rows[0]) === 2) {
            return $rows[0][0] * $rows[1][1] - $rows[0][1] * $rows[1][0];
        }

        $parts = array_fill(0, count($rows[0]), 0);
        foreach ($rows[0] as $i => $c) {
            $matrixRows = array_map(
                static fn (array $row) => [...array_slice($row, 0, $i), ...array_slice($row, $i + 1)],
                array_slice($rows, 1)
            );
            $parts[$i] = $c * $this->calculateDeterminant($matrixRows) * (-1)**$i;
        }

        return array_sum($parts);
    }
}

$matrix2 = new SquaredMatrix([
    [ 0, 3],
    [-2, 1]
]);
var_dump($matrix2->determinant()); // 6

$matrix3 = new SquaredMatrix([
    [2, -3,  1],
    [2,  0, -1],
    [1,  4,  5]
]);
var_dump($matrix3->determinant()); // 49

$matrix4 = new SquaredMatrix([
    [3, 0, 2, -1],
    [1, 2, 0, -2],
    [4, 0, 6, -3],
    [5, 0, 2,  0]
]);
var_dump($matrix4->determinant()); // 20