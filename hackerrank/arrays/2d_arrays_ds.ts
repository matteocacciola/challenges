function hourglassSum(arr: number[][]): number {
  // Write your code here
  let maxSum = -64;
  const dim = arr.length - 2;
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      const first = arr[i][j] + arr[i+2][j];
      const second = arr[i][j+1] + arr[i+1][j+1] + arr[i+2][j+1];
      const third = arr[i][j+2] + arr[i+2][j+2];
      maxSum = Math.max(maxSum, first + second + third);
    }
  }
  return maxSum;
}