import bcrypt from "bcrypt"
import pool from "./database.js";

async function crearUsuario(username, password) {
        try {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (user_id, password,profile) VALUES (?, ?, ?)';
        const values = [username, hashedPassword,"Supervisor"];
        await pool.query(insertQuery, values);
        console.log(`Usuario ${username} creado con contraseña hasheada: ${hashedPassword}`);
        return { success: true, message: 'Usuario creado correctamente' };
        } catch (error) {
        return { success: false, message: 'Error al crear el usuario' };
        }
    }

    const usuario = 'hmarquez';
    const contraseña = 'Hugo.2024';

    crearUsuario(usuario, contraseña).then(result => {
        console.log(result);
      }).catch(error => {
        console.error(error);
      });
