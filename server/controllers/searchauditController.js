import jwt from "jsonwebtoken";
import logAction from "../auditlog.js";
import pool from "../database.js";
const secretKey = "your_secret_key";

const searchaudit = async (req, res) => {
  var DateIni = req.query.DateIni;
  var DateEnd = req.query.DateEnd;
  console.log(DateIni);
  console.log(DateEnd);

  //cambio formato fecha
  const fechaIni = new Date(DateIni);
  const Yini = fechaIni.getFullYear();
  const Mini = (fechaIni.getMonth() + 1).toString().padStart(2, "0");
  const Dini = fechaIni.getDate().toString().padStart(2, "0");
  const FechaIniFormato_b = `${Yini}-${Mini}-${Dini} 00:00:00.000-05`;
  const FechaIniFormato_u = `%${Yini}-${Mini}-${Dini}%`;

  // console.log(FechaIniFormato)
  const fechaEnd = new Date(DateEnd);
  const Yend = fechaEnd.getFullYear();
  const Mend = (fechaEnd.getMonth() + 1).toString().padStart(2, "0");
  const Dend = fechaEnd.getDate().toString().padStart(2, "0");
  const FechaEndFormato_b = `${Yend}-${Mend}-${Dend} 23:59:59.999-05`;
  // console.log(FechaEndFormato)
  //

  let sqlQuery = "SELECT * FROM audit_log WHERE";
  const sqlValues = [];

  if (DateIni == "null" && DateEnd == "null") {
    const [datanull] = [{}];
    console.log(datanull);
    res.json(datanull);
    return;
  }

  if (DateIni !== "null") {
    if (sqlValues.length > 0) {
      sqlQuery += " AND";
    }
    if (DateEnd === "null") {
      sqlQuery += " timestamp LIKE ?";
      sqlValues.push(FechaIniFormato_u);
    } else {
      sqlQuery += " timestamp BETWEEN ? AND ?";
      sqlValues.push(FechaIniFormato_b, FechaEndFormato_b);
    }
  }

  if (DateEnd !== "null" && DateIni === "null") {
    const [datanull] = [{}];
    console.log(datanull);
    res.json(datanull);
    return;
  }

  const [rows] = await pool.query(sqlQuery, sqlValues);
  console.log(rows)
  try {
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token de la solicitud

    const decoded = jwt.verify(token, secretKey); // Decodificar el token

    const userId = decoded.userId;
    console.log(userId);

    // Registrar la acción en el registro de auditoría
    const action = `Busqueda de auditoria con los campos fecha inicio:${DateIni},fecha fin:${DateEnd}`;

    logAction(userId, action);

    console.log(rows);
    res.json(rows);
  } catch (error) {
    res.status(403).json("Forbidden"); // Envío de respuesta en caso de error de token o cualquier excepción
  }
};
export default { searchaudit };
