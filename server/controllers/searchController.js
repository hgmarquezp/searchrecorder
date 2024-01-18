import jwt from "jsonwebtoken";
import logAction from "../auditlog.js";
import pool from "../database.js";
const secretKey = "your_secret_key";

const search = async (req, res) => {
  var id = req.query.number;
  var DateIni = req.query.DateIni;
  var DateEnd = req.query.DateEnd;
  var anexo = req.query.anexo;
  var agente = req.query.agente;
  console.log(id);
  console.log(DateIni);
  console.log(DateEnd);
  console.log(anexo);
  const anexo_u = `%${anexo}%`;
  const agente_u = `%${agente}%`;
  const id_u = `%${id}%`;
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

  let sqlQuery = "SELECT * FROM data WHERE";
  const sqlValues = [];

  if (
    id == "" &&
    anexo == "" &&
    DateIni == "null" &&
    DateEnd == "null" &&
    agente == ""
  ) {
    const [datanull] = [{}];
    console.log(datanull);
    res.json(datanull);
    return;
  }

  if (id !== "") {
    sqlQuery += " telefono LIKE ?";
    sqlValues.push(id_u);
  }

  if (anexo !== "") {
    if (sqlValues.length > 0) {
      sqlQuery += " AND";
    }
    sqlQuery += " anexo LIKE ?";
    sqlValues.push(anexo_u);
  }

  if (agente !== "") {
    if (sqlValues.length > 0) {
      sqlQuery += " AND";
    }
    sqlQuery += " agente LIKE ?";
    sqlValues.push(agente_u);
  }

  if (DateIni !== "null") {
    if (sqlValues.length > 0) {
      sqlQuery += " AND";
    }
    if (DateEnd === "null") {
      sqlQuery += " fecha LIKE ?";
      sqlValues.push(FechaIniFormato_u);
    } else {
      sqlQuery += " fecha BETWEEN ? AND ?";
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

  if (id == "") {
    id = "null";
  }
  if (anexo == "") {
    anexo = "null";
  }
  if (agente == "") {
    agente = "null";
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token de la solicitud

    const decoded = jwt.verify(token, secretKey); // Decodificar el token

    const userId = decoded.userId;
    console.log(userId);

    // Registrar la acción en el registro de auditoría
    const action = `Busqueda con los campos fecha inicio:${DateIni},fecha fin:${DateEnd},telefono:${id},extension:${anexo},agente:${agente}`;

    logAction(userId, action);

    rows.forEach((row, index) => {
      row.id = index + 1;

      const rutastring = row.idgrabacion.toString();

      const ruta =
        rutastring.slice(0, 6) +
        "/" +
        rutastring.slice(6, 9) +
        "/" +
        rutastring.slice(9, 11) +
        "/" +
        rutastring.slice(11, 13);
      row.ruta = ruta + "/" + row.idgrabacion;

      row.tmp = "http://localhost:3000/audio/" + row.idgrabacion + ".wav";

      Object.keys(row).forEach((key) => {
        if (key !== "id") {
          const value = row[key];
          delete row[key];
          row[key] = value;
        }
      });
    });
    console.log(rows);
    res.json(rows);
  } catch (error) {
    res.status(403).json("Forbidden"); // Envío de respuesta en caso de error de token o cualquier excepción
  }
};
export default { search };
