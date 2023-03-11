export const describeFunction = (a: number, b: number, c: number): string => {
  const ops = '+-*/'.split('').map(x => [x, new Function('a', 'b', 'c', `return (a ${x} b) === c`)]);
  return ops.find(([x, f]) => (f as Function)(a,b,c))?.[0] as string;
};
