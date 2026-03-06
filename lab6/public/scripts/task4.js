const tableGeneratorForm = document.querySelector("#tableGeneratorForm");
const rowsInput = document.querySelector("#rowsInput");
const colsInput = document.querySelector("#colsInput");
const validationMessage = document.querySelector("#validationMessage");
const tableContainer = document.querySelector("#tableContainer");

function isValidDimension(value) {
  return Number.isInteger(value) && value >= 1 && value <= 25;
}

function addCellHoverEffects(cell) {
  cell.addEventListener("mouseenter", () => {
    cell.dataset.prevColor = cell.style.backgroundColor || "";
    cell.style.backgroundColor = "#fde68a";
  });

  cell.addEventListener("mouseleave", () => {
    cell.style.backgroundColor = cell.dataset.prevColor || "";
  });
}

function buildTable(rows, cols) {
  const table = document.createElement("table");
  table.className = "dynamic-table";

  for (let row = 1; row <= rows; row += 1) {
    const tr = document.createElement("tr");
    tr.style.backgroundColor = row % 2 === 0 ? "#f8fafc" : "#ffffff";

    for (let col = 1; col <= cols; col += 1) {
      const td = document.createElement("td");
      td.textContent = `(${row}, ${col})`;
      addCellHoverEffects(td);
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  return table;
}

tableGeneratorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  validationMessage.textContent = "";

  const rows = Number.parseInt(rowsInput.value, 10);
  const cols = Number.parseInt(colsInput.value, 10);

  if (!isValidDimension(rows) || !isValidDimension(cols)) {
    validationMessage.textContent =
      "Please enter valid rows and columns (integer values from 1 to 25).";
    return;
  }

  tableContainer.innerHTML = "";
  tableContainer.appendChild(buildTable(rows, cols));
});
