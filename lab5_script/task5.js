// Task 5: Username Formatter & Validator
function cleanUsername(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "_");
}

function validateUsername(name) {
  if (name.length < 5 || name.length > 20) return false;
  const first = name.charAt(0);
  const startsWithLetter = /[a-zA-Z]/.test(first);
  const validChars = /^[a-zA-Z0-9_]+$/.test(name);
  return startsWithLetter && validChars;
}

const rawUser = " AHMAD_kHan123 ";
const cleaned = cleanUsername(rawUser);
console.log(cleaned);
console.log(validateUsername(cleaned));
