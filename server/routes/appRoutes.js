// Importa los módulos necesarios y los controladores
import express from "express";
import searchController from "../controllers/searchController.js";
import exportdataController from "../controllers/exportdataController.js";
import downloadaudioController from "../controllers/downloadaudioController.js";
import playaudioController from "../controllers/playaudioController.js";
import searchauditController from "../controllers/searchauditController.js";
import conectionsshController from "../controllers/conectionsshController.js";
import jwt from "jsonwebtoken";

const secretKey = "your_secret_key";
const router = express.Router();

// Middleware para verificar el perfil del usuario
const verificarPerfil = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
console.log(token)
  // Aquí deberías verificar el token y obtener la información del usuario, incluido su perfil
  try {
    const decoded = jwt.verify(token, secretKey);
    const perfilUsuario = decoded.profile; // Suponiendo que el perfil está incluido en el token

    if (perfilUsuario === 'Supervisor') {
      return res.status(403).json({ error: 'Acceso denegado para Supervisores' });
    }

    // Si el perfil no es Supervisor, permitir el acceso a la función
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o no proporcionado' });
  }
};

// Rutas con el middleware de verificación de perfil
router.get("/busqueda", searchController.search);
router.post("/export-data", exportdataController.exportdata);
router.get("/playaudio", playaudioController.playaudio);
router.get("/downloadaudio", downloadaudioController.downloadaudio);
router.get("/audit", verificarPerfil, searchauditController.searchaudit);
router.get("/conectionssh", verificarPerfil, conectionsshController.conectionssh);

export default router;

