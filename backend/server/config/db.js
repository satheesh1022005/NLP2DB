import mysql from "mysql2";

// MySQL connection details
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "nlp2db", // Add your database name here
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig).promise();

// Export pool as a named export
export { pool };
