// Task 6: Smart Message Analyzer
function countWords(message) {
  const trimmed = message.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function countCharacters(message) {
  return message.length;
}

function containsUrgent(message) {
  const msg = message.toLowerCase();
  const keywords = ["urgent", "asap", "immediately", "important"];
  return keywords.some((k) => msg.includes(k));
}

function isShouting(message) {
  const letters = message.match(/[a-zA-Z]/g) || [];
  if (letters.length === 0) return false;
  const upper = letters.filter((ch) => ch === ch.toUpperCase()).length;
  return upper / letters.length > 0.7;
}

const msg = "Sir I submitted the Assignment today!!!";
console.log("Words:", countWords(msg));
console.log("Characters:", countCharacters(msg));
console.log("Contains Urgent Word:", containsUrgent(msg) ? "Yes" : "No");
console.log("Shouting:", isShouting(msg) ? "Yes" : "No");
