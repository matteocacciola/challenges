function minimumBribes(q: number[]): void {
  let bribes = 0;
  const l = q.length;
  for (let i = l - 1; i >= 0; i--) {
    if (q[i] - i - 1 > 2) {
      console.log("Too chaotic");
      return;
    }
    for (let j = Math.max(0, q[i] - 2); j < i; j++)
      if (q[j] > q[i]) bribes++;
  }
  console.log(bribes);
}