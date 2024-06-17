const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Mysql@99",
  database: process.env.DB_NAME || "EmployeeDB",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("MySQL connected...");
});

// API endpoint
app.post("/addEmployee", (req, res) => {
  // console.log("Add");
  const { name, email, mobile } = req.body;

  const sql = "INSERT INTO Employees (name, email, mobile) VALUES (?, ?, ?)";
  db.query(sql, [name, email, mobile], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send("Employee added successfully");
  });
});

//get all employees (Read)
app.get("/getEmployees", (req, res) => {
  const sql = "SELECT * FROM Employees";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

//update an employee
app.put("/updateEmployee/:id", (req, res) => {
  // console.log("update");
  const { id } = req.params;
  const { name, email, mobile } = req.body;
  const sql =
    "UPDATE Employees SET name = ?, email = ?, mobile = ? WHERE id = ?";
  db.query(sql, [name, email, mobile, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send("Employee updated successfully");
  });
});
//get an employee by ID
app.get("/getEmployee/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = "SELECT * FROM Employees WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send("Employee not found");
    }
    res.json(result); // Assuming only one employee should be found for a given ID
  });
});

// delete an employee
app.delete("/deleteEmployee/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Employees WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send("Employee deleted successfully");
  });
});

app.post("/checkEmail", (req, res) => {
  console.log("Check email endpoint");
  const { email } = req.body;
  const sql = "SELECT COUNT(*) AS count FROM Employees WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).send(err);
    }

    const emailExists = result[0].count > 0;

    res.json({ emailExists });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
