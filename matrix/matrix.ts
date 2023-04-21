export class Matrix {
  constructor(protected rows: number[][]) {
    this.validate(rows);
  }

  public static fromIdentity(numRows: number, numCols: number): Matrix
  {
    return new Matrix(Array.apply(null, Array(numRows)).map(_ => Array.apply(null, Array(numCols)).map(_ => 0)));
  }

  public static fromZeros(numRows: number, numCols: number): Matrix
  {
    return new Matrix(Array.apply(null, Array(numRows)).map(_ => Array.apply(null, Array(numCols)).map(_ => 1)));
  }

  protected validate(rows: number[][]) {
    const nCols = rows[0].length;
    for (const row of rows) {
      if (row.length !== nCols) {
        throw new Error('The number of elements in each column should be equal.');
      }
    }
  }

  public getRows(): number[][]
  {
    return this.rows;
  }

  get numRows(): number {
    return this.rows.length;
  }

  get numCols(): number {
    return this.rows[0].length
  }

  protected canOperate(matrix: Matrix): boolean
  {
    const rows = matrix.getRows();
    this.validate(rows);
    return matrix.numRows === this.numRows && matrix.numCols === this.numCols;
  }

  protected operation(callback: Function, matrix: Matrix): Matrix {
    if (!this.canOperate(matrix)) {
      throw new Error('Operation is not permitted since the matrices have not the same dimensions');
    }

    const result = matrix.getRows().map((row, i) => {
      return row.map((item, j) => {
        return callback(this.rows[i][j], item);
      })
    });

    return new Matrix(result);
  }

  public add(matrix: Matrix): Matrix {
    return this.operation((a, b) => a + b, matrix);
  }

  public subtract(matrix: Matrix): Matrix {
    return this.operation((a, b) => a - b, matrix);
  }

  public scaleBy(num: number): Matrix {
    const result = this.rows.map((row, i) => {
      return row.map((item, j) => {
        return item * num;
      })
    });

    return new Matrix(result);
  }

  public multiply(matrix: Matrix): Matrix {
    if (this.numCols !== matrix.numRows) {
      throw new Error('The number of columns of this matrix is not equal to the number of rows of the given matrix.');
    }

    const matrixRows = matrix.getRows();
    const result = Matrix.fromZeros(this.numRows, matrix.numCols).getRows();

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < matrix.numCols; j++) {
        for (let k = 0; k < this.numCols; k++) {
          result[i][j] += this.rows[i][k] * matrixRows[k][j];
        }
      }
    }

    return new Matrix(result);
  }

  public transpose(): Matrix {
    const result = Matrix.fromZeros(this.numCols, this.numRows).getRows();
    this.rows.forEach((row, i) => {
      row.forEach((item, j) => {
        result[j][i] = item;
      })
    })

    return new Matrix(result);
  }
}

export class SquaredMatrix extends Matrix {
  protected validate(rows: number[][]) {
    super.validate(rows);

    if (rows.length !== rows[0].length) {
      throw new Error('The matrix is not squared.');
    }
  }

  public determinant(): number {
    return this.calculateDeterminant(this.rows);
  }

  private calculateDeterminant(m: number[][]): number {
    if (m.length === 1) {
      return m[0][0];
    }
    if (m.length === 2) {
      return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    }

    const parts: number[] = m[0].map((c, index) => {
      const matrixRows = m.slice(1).map(row => [ ...row.slice(0, index), ...row.slice(index + 1)]);
      return c * this.calculateDeterminant(matrixRows) * (-1)**index;
    });

    return parts.reduce((acc, p) => acc + p, 0);
  }
}

const matrix2 = new SquaredMatrix([
  [ 0, 3],
  [-2, 1]
]);
console.log(matrix2.determinant()); // 6

const matrix3 = new SquaredMatrix([
  [2, -3,  1],
  [2,  0, -1],
  [1,  4,  5]
]);
console.log(matrix3.determinant()); // 49

const matrix4 = new SquaredMatrix([
  [3, 0, 2, -1],
  [1, 2, 0, -2],
  [4, 0, 6, -3],
  [5, 0, 2,  0]
]);
console.log(matrix4.determinant()); // 20