import db from "../models/db.js";

export const submitMarks = (req, res) => {
  const { name, rollno, english, nepali, math, physics, chemistry, biology } =
    req.body;

  const sql = `INSERT into marksheet (name, roll_no, english, nepali, math, physics, chemistry, biology)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    "SELECT * FROM marksheet WHERE roll_no = ?",
    [rollno],
    (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, error: "Database error" });
      }

      if (rows.length > 0) {
        return res
          .status(400)
          .json({ success: false, error: "Roll number already exists" });
      }
      const sql = `
      INSERT INTO marksheet (name, roll_no, english, nepali, math, physics, chemistry, biology)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

      db.query(
        sql,
        [
          name,
          rollno,
          english || 0,
          nepali || 0,
          math || 0,
          physics || 0,
          chemistry || 0,
          biology || 0,
        ],
        (err, result) => {
          if (err) {
            console.error("Insert Error:", err);
            return res.status(500).json({ success: false, error: err.message });
          }
          // res.json({ success: true, message: "Data inserted successfully" });
          res.redirect("/dashboard");``
        }
      );
    }
  );
};
