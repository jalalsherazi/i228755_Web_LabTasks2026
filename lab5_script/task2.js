// Task 2: Conference Attendee Management
const attendees = [];
const MAX_CAPACITY = 100;

function addAttendee(name, email, ticketType) {
  if (!isFull()) {
    attendees.push({ name, email, ticketType });
    return true;
  }
  return false;
}

function isFull() {
  return attendees.length >= MAX_CAPACITY;
}

function listAttendees() {
  attendees.forEach((a, i) => {
    console.log(`${i + 1}. ${a.name} | ${a.email} | ${a.ticketType}`);
  });
}

function countByTicketType(type) {
  return attendees.filter((a) => a.ticketType === type).length;
}

addAttendee("Ali", "ali@mail.com", "General");
addAttendee("Sara", "sara@mail.com", "VIP");
addAttendee("Bilal", "bilal@mail.com", "General");
listAttendees();
console.log("Is full?", isFull());
console.log("General count:", countByTicketType("General"));
