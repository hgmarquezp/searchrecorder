import jwt from "jsonwebtoken";
import pool from "../database.js";
import bcrypt from "bcrypt"
import logAction from "../auditlog.js";
const secretKey = "your_secret_key";

const login = async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  try {

    const query = "SELECT * FROM users WHERE user_id = ?";
    const [results] = await pool.query(query, [username]);

    const passwordMatch = await bcrypt.compare(password, results[0].password);
    if (!passwordMatch) {
      res.status(401).json({ success: false, message: "Authentication failed" });
      return;
    }

    if (results.length > 0) {
      const user = results[0].user_id;
      const profile = results[0].profile;
      const action = "El usuario se logeo"
      logAction(user,action)
      const token = jwt.sign({ userId: user, profile: profile }, secretKey, {
        expiresIn: "1h",
      });
      
      res.json({ token });
      return;
    } else {
      res.status(401).json({ success: false, message: "Authentication failed" });
      return;
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

export default { login };

