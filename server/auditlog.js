import pool from "./database.js"

async function logAction(userId, action) {
  try {
    const [result] = await pool.query(
      "INSERT INTO audit_log (user_id, action) VALUES (?, ?)",
      [userId, action]
    );
    console.log("Acción registrada en el registro de auditoría");
    return; // Devolver el ID del registro de auditoría creado, si es necesario
  } catch (error) {
    console.error(
      "Error al registrar la acción en el registro de auditoría:",
      error
    );
    return null;
  }
}

export default logAction;
