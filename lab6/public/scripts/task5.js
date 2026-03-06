const studentData = [
  {
    id: 1,
    name: "Ali",
    semester: 5,
    courses: [
      { courseName: "Web Engineering", score: 78 },
      { courseName: "Database Systems", score: 62 },
      { courseName: "Operating Systems", score: 48 }
    ]
  },
  {
    id: 2,
    name: "Ayesha",
    semester: 4,
    courses: [
      { courseName: "Data Structures", score: 84 },
      { courseName: "Discrete Math", score: 73 }
    ]
  },
  {
    id: 3,
    name: "Bilal",
    semester: 6,
    courses: [
      { courseName: "Artificial Intelligence", score: 67 },
      { courseName: "Compiler Construction", score: 44 }
    ]
  },
  {
    id: 4,
    name: "Hina",
    semester: 3,
    courses: [
      { courseName: "Programming Fundamentals", score: 91 },
      { courseName: "Object-Oriented Programming", score: 88 },
      { courseName: "Calculus", score: 76 }
    ]
  }
];

const searchInput = document.querySelector("#searchInput");
const nestedTableBody = document.querySelector("#nestedTableBody");
const sortStateText = document.querySelector("#sortStateText");
const sortButtons = document.querySelectorAll("button[data-sort-key]");

let sortKey = "name";
let sortDirection = "asc";
let searchQuery = "";
const expandedStudents = {};

function calculateAverageScore(student) {
  const total = student.courses.reduce((sum, course) => sum + course.score, 0);
  return total / student.courses.length;
}

function getSortValue(student, key) {
  if (key === "avgScore") {
    return calculateAverageScore(student);
  }
  return student[key];
}

function sortStudents(list) {
  return [...list].sort((a, b) => {
    const valueA = getSortValue(a, sortKey);
    const valueB = getSortValue(b, sortKey);

    let compareResult = 0;
    if (typeof valueA === "string") {
      compareResult = valueA.localeCompare(valueB);
    } else {
      compareResult = valueA - valueB;
    }

    return sortDirection === "asc" ? compareResult : -compareResult;
  });
}

function filterStudents(list) {
  if (!searchQuery) {
    return list;
  }

  const queryLower = searchQuery.toLowerCase();
  return list.filter((student) => {
    const nameMatch = student.name.toLowerCase().includes(queryLower);
    const courseMatch = student.courses.some((course) =>
      course.courseName.toLowerCase().includes(queryLower)
    );
    return nameMatch || courseMatch;
  });
}

function createStudentRow(student, averageScore) {
  const row = document.createElement("tr");
  row.className = "student-row";
  if (averageScore < 50) {
    row.classList.add("low-score");
  }

  const isExpanded = Boolean(expandedStudents[student.id]);
  row.innerHTML = `
    <td>
      <button class="pill" data-toggle-id="${student.id}">${
    isExpanded ? "-" : "+"
  }</button>
    </td>
    <td>${student.name}</td>
    <td>${student.semester}</td>
    <td>Student</td>
    <td>-</td>
    <td>${averageScore.toFixed(1)}</td>
  `;

  return row;
}

function createCourseRow(course) {
  const row = document.createElement("tr");
  row.className = "course-row";
  if (course.score < 50) {
    row.classList.add("low-score");
  }

  row.innerHTML = `
    <td></td>
    <td></td>
    <td></td>
    <td>Course</td>
    <td>${course.courseName}</td>
    <td>${course.score}</td>
  `;

  return row;
}

function renderTable() {
  nestedTableBody.innerHTML = "";

  const filtered = filterStudents(studentData);
  const sorted = sortStudents(filtered);

  sorted.forEach((student) => {
    const averageScore = calculateAverageScore(student);
    nestedTableBody.appendChild(createStudentRow(student, averageScore));

    if (expandedStudents[student.id]) {
      student.courses.forEach((course) => {
        nestedTableBody.appendChild(createCourseRow(course));
      });
    }
  });

  sortStateText.textContent = `Sort: ${sortKey} (${sortDirection})`;
}

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const requestedKey = button.dataset.sortKey;
    if (requestedKey === sortKey) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortKey = requestedKey;
      sortDirection = "asc";
    }

    renderTable();
  });
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  renderTable();
});

nestedTableBody.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("button[data-toggle-id]");
  if (!toggleButton) {
    return;
  }

  const studentId = Number.parseInt(toggleButton.dataset.toggleId, 10);
  expandedStudents[studentId] = !expandedStudents[studentId];
  renderTable();
});

renderTable();
