import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRoutes from "./routes/authRoutes.js";
import appRoutes from "./routes/appRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// Opciones de configuración más detalladas:
app.use(
  cors({
    origin: "http://localhost:5173", // Origen permitido
    methods: "GET,POST", // Métodos permitidos
    allowedHeaders: "Content-Type,Authorization", // Cabeceras permitidas
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/auth", authRoutes);
app.use("/app", appRoutes);

//ruta estatica audios tmp/new
app.use("/audio", express.static(path.join(__dirname, "tmp")));

app.listen(3000);
console.log("Server running");
