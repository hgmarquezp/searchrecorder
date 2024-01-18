import { createPool } from "mysql2/promise";
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  port: 3306,
  database: "recorder",
});

export default pool;
