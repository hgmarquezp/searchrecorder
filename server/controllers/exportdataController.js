import logAction from "../auditlog.js";
import jwt from "jsonwebtoken";
const secretKey = "your_secret_key";
const exportdata = async (req, res) => {
  const message = req.body.message;
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log(err);
    }
    const userId = decoded.userId;
    console.log("User ID:", userId);
    const action = `${message}`;
    console.log(userId);
    console.log(action);
    logAction(userId, action);
  });
};
export default { exportdata };
