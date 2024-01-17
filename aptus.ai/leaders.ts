const extractLeaders = (arr: number[]): number[] => {
  const result = [arr[arr.length - 1]];

  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] > result[result.length - 1]) {
      result.push(arr[i]);
    }
  }

  return result.reverse();
};


let input = [1, 2, 7, 6, 4, 5, 2];
let output = [7, 6, 5, 2];
console.log(JSON.stringify(extractLeaders(input)) === JSON.stringify(output));

input = [4, 3, 2, 8];
output = [8];
console.log(JSON.stringify(extractLeaders(input)) === JSON.stringify(output));

input = [7, 6, 8, 2];
output = [8, 2];
console.log(JSON.stringify(extractLeaders(input)) === JSON.stringify(output));

input = [4, 3, 4];
output = [4];
console.log(JSON.stringify(extractLeaders(input)) === JSON.stringify(output));