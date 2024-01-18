import { Client } from 'ssh2';

const conectionssh = async (req, res) => {
    const idgrabacion = req.query.idgrabacion;
    let clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Convertir la dirección IPv6 a IPv4 si es necesario
  if (clientIP.substr(0, 7) === '::ffff:') {
    clientIP = clientIP.substr(7);
  }

  console.log(clientIP)

  const connectionOptions = {
    host: clientIP,
    port: 22,
    username: 'soporte',
    password: 'soporte' // Puedes cambiar a keyFile para autenticación con clave privada
  };

  

  const comandoCd = "cd \\Program Files (x86)\\Verint\\Playback'";
  const comandoConvertor = `CommandLineConvertor.exe c:\\Users\\soporte\\Downloads\\verint\\tmp\\old\\${idgrabacion}.wav c:\\Users\\soporte\\Downloads\\verint\\tmp\\new\\${idgrabacion}.wav`;

  const conn = new Client();

  try {
    await new Promise((resolve, reject) => {
      conn.on('ready', () => {
        console.log('Conexión SSH establecida');
        resolve();
      }).connect(connectionOptions);

      conn.on('error', (err) => {
        reject(`Error de conexión SSH: ${err.message}`);
      });
    });

    await execCommand(conn, comandoCd, 'Comando cd');
    await execCommand(conn, comandoConvertor, 'Comando CommandLineConvertor.exe');

  } catch (error) {
    console.error(error);
  } finally {
    conn.end(); // Cerrar la conexión SSH después de ejecutar los comandos
  }
};

const execCommand = (conn, command, commandName) => {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) {
        reject(`Error al ejecutar ${commandName}: ${err.message}`);
      }

      stream.on('close', (code, signal) => {
        console.log(`${commandName} terminado con código ${code}`);
        resolve();
      }).on('data', (data) => {
        console.log(`STDOUT (${commandName}): ${data}`);
        res.status(200)
        return
      }).stderr.on('data', (data) => {
        console.log(`STDERR (${commandName}): ${data}`);
      });
    });
  });
};

export default { conectionssh };
