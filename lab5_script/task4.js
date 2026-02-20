// Task 4: Debug & Correct the Code

// A)
const getAverage = (arr) => {
  let sum = 0;
  arr.forEach((num) => {
    sum += num;
  });
  return sum / arr.length;
};
console.log(getAverage([10, 20, 30]));

// B)
function findLongestWord(str) {
  const words = str.split(" ");
  return words.reduce((a, b) => {
    if (a.length >= b.length) return a;
    return b;
  });
}
console.log(findLongestWord("JavaScript is very powerful language"));

// C)
const checkPass = (marks) => {
  if (marks.some((m) => m >= 50)) return "Pass";
  return "Fail";
};
console.log(checkPass([20, 30, 40]));
