// Task 8: Password Strength Checker
function checkPassword(password) {
  const hasLength = password.length >= 8;
  const hasUpper = password.match(/[A-Z]/);
  const hasLower = password.match(/[a-z]/);
  const hasNumber = password.match(/[0-9]/);
  const specials = ["@", "#", "$", "%"];
  const hasSpecial = specials.some((ch) => password.includes(ch));

  const passed = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  if (passed <= 2) return "Weak";
  if (passed <= 4) return "Medium";
  return "Strong";
}

console.log(checkPassword("abc"));
console.log(checkPassword("Abcdef12"));
console.log(checkPassword("Abcdef12@"));
