import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import logAction from "../auditlog.js";
import jwt from "jsonwebtoken";
const secretKey = "your_secret_key";

const playaudio = async (req, res) => {
  const idgrabacion = req.query.idgrabacion;
  const audiostring = idgrabacion.toString();
  console.log(idgrabacion);
  const rutafull =
    audiostring.slice(0, 6) +
    "/" +
    audiostring.slice(6, 9) +
    "/" +
    audiostring.slice(9, 11) +
    "/" +
    audiostring.slice(11, 13);
  const rutashort = audiostring.slice(11, 13);
  const rutacompartidaF = "C:/restore_storage/" + rutafull;
  const rutacompartidaS = "C:/restore_storage/" + rutashort;

  const pathtemp = `./server/tmp/new/${idgrabacion}.wav`;
  const audioFilePath = path.resolve(pathtemp);
  const rutatmp = "http://127.0.0.1:3000/audio/" + idgrabacion + ".wav";

  async function transferirArchivo() {
    // Rutas de los archivos de entrada y salida
    const carpetaOrigen = rutacompartidaF;
    const carpetaOrigen2 = rutacompartidaS;
    const carpetaDestino = "./server/tmp/old";

    const nombreArchivo = `${idgrabacion}.wav`;

    const rutaArchivoOrigen = path.join(carpetaOrigen, nombreArchivo);
    const rutaArchivoOrigen2 = path.join(carpetaOrigen2, nombreArchivo);
    const rutaArchivoDestino = path.join(carpetaDestino, nombreArchivo);
    //Verificar si el archivo existe en tmp
    try {
      await fs.access(pathtemp);
      console.log("existe el audio en tmp");
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.log(err);
        }
        const userId = decoded.userId;
        console.log("User ID:", userId);
        const action = `Reproduccion de audio ${idgrabacion}`;
        console.log(userId);
        console.log(action);
        logAction(userId, action);
      });
      res.json(rutatmp);
      return;
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    try {
      // Verificar si el archivo de origen existe
      await fs.access(rutaArchivoOrigen);

      const contenidoArchivo = await fs.readFile(rutaArchivoOrigen);

      await fs.writeFile(rutaArchivoDestino, contenidoArchivo);

      console.log(
        `Transferencia exitosa de ${nombreArchivo} de ${carpetaOrigen} a ${carpetaDestino}.`
      );
    } catch (error1) {
      try {
        // Verificar si el segundo archivo de origen existe
        await fs.access(rutaArchivoOrigen2);

        const contenidoArchivo2 = await fs.readFile(rutaArchivoOrigen2);

        await fs.writeFile(rutaArchivoDestino, contenidoArchivo2);

        console.log(
          `Transferencia exitosa de ${nombreArchivo} de ${carpetaOrigen} a ${carpetaDestino}.`
        );
      } catch (error2) {
        // Ambos archivos de origen no existen
        console.error(`Error en la transferencia: ${error2.message}`);
        res.status(404).json("Not Found");
        return;
      }
    }

    // Definir el primer comando (cd)
    const comandoCd = "cd \\Program Files (x86)\\Verint\\Playback";

    // Definir el segundo comando (CommandLineConvertor.exe)
    const comandoConvertor = `CommandLineConvertor.exe c:\\Users\\hmarquez\\Desktop\\node-proyect-full-Rimac\\server\\tmp\\old\\${idgrabacion}.wav c:\\Users\\hmarquez\\Desktop\\node-proyect-full-Rimac\\server\\tmp\\new\\${idgrabacion}.wav`;

    // Encadenar ambos comandos con && para ejecutar el segundo solo si el primero tiene éxito
    const comandoFinal = `${comandoCd} && ${comandoConvertor}`;

    exec(comandoFinal, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar los comandos: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`Error en la salida estándar: ${stderr}`);
        return;
      }

      console.log(`Salida comando:\n${stdout}`);
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.log(err);
        }
        const userId = decoded.userId;
        console.log("User ID:", userId);
        const action = `Reproduccion de audio ${idgrabacion}`;
        console.log(userId);
        console.log(action);
        logAction(userId, action);
      });

      console.log(rutatmp);
      res.json(rutatmp);
      return;
    });
  }

  // Llamar a la función asincrónica
  transferirArchivo();
};

export default { playaudio };
