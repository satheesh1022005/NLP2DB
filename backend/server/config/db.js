import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
// MySQL connection details

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig).promise();
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connection established successfully.");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });
// Export pool as a named export
export { pool };
