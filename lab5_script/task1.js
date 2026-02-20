// Task 1: Weekly Fitness Tracker
const weeklySteps = [4500, 6200, 5800, 7100, 4900, 8300, 6700];

function addSteps(dayIndex, steps) {
  if (dayIndex >= 0 && dayIndex < weeklySteps.length) {
    weeklySteps[dayIndex] = steps;
  }
}

function getHighestSteps() {
  return Math.max(...weeklySteps);
}

function getLowestSteps() {
  return Math.min(...weeklySteps);
}

function getAverageSteps() {
  const sum = weeklySteps.reduce((acc, s) => acc + s, 0);
  return sum / weeklySteps.length;
}

function getAboveAverageDays() {
  const avg = getAverageSteps();
  return weeklySteps.filter((s) => s > avg);
}

console.log("Initial steps:", weeklySteps);
addSteps(0, 5000);
console.log("After update:", weeklySteps);
console.log("Highest:", getHighestSteps());
console.log("Lowest:", getLowestSteps());
console.log("Average:", getAverageSteps());
console.log("Above average:", getAboveAverageDays());
