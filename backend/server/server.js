const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// Initialize Express app
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// MySQL connection details
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Route to create a database and tables
// Route to create a database and tables
app.post("/create-database-tables", (req, res) => {
  const { dbName, queries } = req.body; // Expecting database name and SQL queries
  console.log(queries[0]);
  const array = queries[0];

  if (!dbName || !Array.isArray(queries) || queries.length === 0) {
    return res
      .status(400)
      .send("Invalid input: dbName and queries array are required");
  }

  // First, create the database (if it doesn't exist)
  const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${dbName};`;

  pool.query(createDbQuery, (err, result) => {
    if (err) {
      console.error("Error creating database:", err.message);
      return res.status(500).send("Error creating database");
    }

    console.log(`Database ${dbName} created (or already exists).`);

    // Switch to the new database
    const useDbQuery = `USE ${dbName};`;

    pool.query(useDbQuery, (err, result) => {
      if (err) {
        console.error("Error switching to database:", err.message);
        return res.status(500).send("Error switching to database");
      }

      console.log(`Switched to database: ${dbName}`);

      // Now execute each table creation query one by one
      let queryIndex = 0;

      function executeNextQuery() {
        if (queryIndex < array.length) {
          // Make sure to switch to the database for every query
          pool.query(`USE ${dbName};`, (err, result) => {
            if (err) {
              console.error(
                `Error selecting database before query for table ${
                  queryIndex + 1
                }:`,
                err.message
              );
              return;
            }

            pool.query(array[queryIndex], (err, result) => {
              if (err) {
                console.error(
                  `Error executing query for table ${queryIndex + 1}:`,
                  err.message
                );
              } else {
                console.log(`Table ${queryIndex + 1} created successfully.`);
              }
              queryIndex++;
              executeNextQuery(); // Recursively execute the next query
            });
          });
        } else {
          // All queries executed
          res.json({
            message: "Database and tables creation initiated successfully",
            dbName,
            host: "localhost",
            user: "root",
            password: "root",
          });
        }
      }

      // Start executing queries
      executeNextQuery();
    });
  });
});

// Add this to your existing Express app
app.post("/execute-sql", (req, res) => {
  const { dbName, sqlQuery } = req.body;

  if (!dbName || !sqlQuery) {
    return res.status(400).send("Database name and SQL query are required.");
  }

  // Switch to the specific database
  const useDbQuery = `USE ${dbName};`;

  pool.query(useDbQuery, (err, result) => {
    if (err) {
      console.error("Error switching to database:", err.message);
      return res.status(500).send("Error switching to database");
    }

    // Execute the SQL query
    pool.query(sqlQuery, (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err.message);
        return res.status(500).send("Error executing SQL query");
      }

      console.log("SQL query executed successfully.");
      res.json({
        message: "SQL query executed successfully",
        result,
      });
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
