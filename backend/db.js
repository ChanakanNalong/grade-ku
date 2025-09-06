const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "@Kan11113205110405",
  database: process.env.DB_NAME || "ku_grade",
  port: 3306,
});

module.exports = pool;

