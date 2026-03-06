const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const products = [
  { id: 1, name: "Laptop", price: 900 },
  { id: 2, name: "Mouse", price: 20 },
  { id: 3, name: "Keyboard", price: 50 }
];

const students = [
  { id: 1, name: "Ali", semester: 5 },
  { id: 2, name: "Ayesha", semester: 4 },
  { id: 3, name: "Bilal", semester: 6 },
  { id: 4, name: "Ali", semester: 7 }
];

app.use(express.static(path.join(__dirname, "public")));

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).send("Product not found");
  }

  res.json(product);
});

app.get("/students", (req, res) => {
  const queryName = req.query.name;

  if (!queryName) {
    return res.json(students);
  }

  const matched = students.filter(
    (student) => student.name.toLowerCase() === String(queryName).toLowerCase()
  );

  if (matched.length === 0) {
    return res.status(404).send("No student found");
  }

  res.json(matched);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
