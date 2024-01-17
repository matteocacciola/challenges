function rotLeft(a: number[], d: number): number[] {
  const arr1 = a.slice(0, d);
  const arr2 = a.slice(d);
  return [...arr2, ...arr1];
}