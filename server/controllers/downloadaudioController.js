import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import logAction from "../auditlog.js";
import jwt from "jsonwebtoken";
const secretKey = "your_secret_key";

const downloadaudio = async (req, res) => {
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

  const pathtemp = `./server/tmp/${idgrabacion}.wav`;
  const audioFilePath = path.resolve(pathtemp);
  const rutatmp = "http://127.0.0.1:3000/audio/" + idgrabacion + ".wav";

  async function transferirArchivo() {
    // Rutas de los archivos de entrada y salida
    const carpetaOrigen = rutacompartidaF;
    const carpetaOrigen2 = rutacompartidaS;
    const carpetaDestino = "./server/tmp";

    const nombreArchivo = `${idgrabacion}.wav`;

    const rutaArchivoOrigen = path.join(carpetaOrigen, nombreArchivo);
    const rutaArchivoOrigen2 = path.join(carpetaOrigen2, nombreArchivo);
    const rutaArchivoDestino = path.join(carpetaDestino, nombreArchivo);
    //Verificar si el archivo existe en tmp

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
    
      res.set("Content-Type", "audio/wav");
      res.sendFile(audioFilePath);
      return;
   
  }

  // Llamar a la función asincrónica
  transferirArchivo();
};

export default { downloadaudio };
