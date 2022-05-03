import * as net from 'net';
import chalk from 'chalk';
import {ResponseType} from '../types';
import {Nota} from '../app/Nota';
import {AppNotas} from '../app/AppNotas';
import {MessageEventEmitterServer} from './messageEventEmitterServer';

/**
 * Se crea un servidor con el módulo net de Node.js.
 */
const server = net.createServer((connection) => {
  /**
   * Se crea un objeto de clase MessageEventEmitterServer.
   */
  const socket = new MessageEventEmitterServer(connection);

  console.log(chalk.bold.green('A client has connected.'));

  /**
   * Cuando se recibe el evento de solicitud,
   * se procesa el mensaje enviado por el cliente.
   */
  socket.on('request', (note) => {
    const database = new AppNotas();
    const response: ResponseType = {
      type: 'add',
      success: true,
    };
    switch (note.type) {
      case 'add':
        if (!database.addNota(note.usuario, note.titulo,
            note.cuerpo, note.color)) {
          response.success = false;
        }
        break;
      case 'modify':
        response.type = 'modify';
        if (!database.modifyNota(note.usuario, note.titulo,
            note.cuerpo, note.color)) {
          response.success = false;
        }
        break;
      case 'remove':
        response.type = 'remove';
        if (!database.removeNota(note.usuario, note.titulo)) {
          response.success = false;
        }
        break;
      case 'list':
        response.type = 'list';
        const listNotes: Nota[] = database.listNotas(note.usuario);
        if (listNotes.length == 0) {
          response.success = false;
        } else {
          response.notes = listNotes;
        }
        break;
      case 'read':
        response.type = 'read';
        const noteContent = database.readNota(note.usuario, note.titulo);
        if (noteContent == false) {
          response.success = false;
        } else if (typeof noteContent !== 'boolean') {
          response.notes = [noteContent];
        }
      default:
        console.log(chalk.bold.red('El tipo de mensaje es incorrecto.'));
        break;
    }

    /**
     * La respuesta se envía al cliente.
     */
    connection.write(JSON.stringify(response), (error) => {
      if (error) {
        console.log(chalk.bold.
            red('La respuesta no ha sido enviada al cliente.'));
      } else {
        console.log(chalk.bold.
            green('La respuesta ha sido enviada al cliente.'));
        connection.end();
      }
    });
  });

  /**
   * Si hay un error en la conexión se maneja correctamente.
   */
  connection.on('error', (err) => {
    if (err) {
      console.log(`No se pudo establecer la conexión: ${err.message}`);
    }
  });

  /**
   * Cuando un cliente se desconecta se muestra un mensaje informando de ello
   * en el servidor.
   */
  connection.on('close', () => {
    console.log(chalk.bold.green('Un cliente se ha desconectado.\n'));
  });
});

/**
 * El servidor está escuchando en el puerto 60300.
 */
server.listen(60300, () => {
  console.log(chalk.bold.
      green('Esperando a que los clientes se conecten ...\n'));
});
