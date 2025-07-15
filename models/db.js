import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_NAME is:", process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Mysql connection failed:", err.stack);
  } else {
    console.log("Connected to database");
  }
});

export default db;
