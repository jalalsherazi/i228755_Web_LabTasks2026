// Task 7: Email Generator System
function getInitials(department) {
  return department
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toLowerCase())
    .join("");
}

function generateEmail(fullName, department) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0].toLowerCase();
  const last = parts[parts.length - 1].toLowerCase();
  const initials = getInitials(department);
  return `${first}.${last}@${initials}.uni.edu`;
}

console.log(generateEmail("Muhammad Ali Khan", "Software Engineering"));
