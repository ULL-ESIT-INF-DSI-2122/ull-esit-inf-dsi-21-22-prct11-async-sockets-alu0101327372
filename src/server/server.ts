import * as net from 'net';
import chalk from 'chalk';
import {ResponseType} from '../types';
import {AppNotas} from '../app/AppNotas';
import {MessageEventEmitterServer} from './messageEventEmitterServer';

/**
 * A server is created with the net module of Node.js.
 */
const server = net.createServer((connection) => {
  /**
   * An object of class MessageEventEmitterServer is created.
   */
  const socket = new MessageEventEmitterServer(connection);

  console.log(chalk.bold.green('A client has connected.'));

  /**
   * When the request event is received,
   * the message sent by the client is processed.
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
        const listNotes: string = database.listNotas(note.usuario);
        response.notes = listNotes;
        break;
      case 'read':
        response.type = 'read';
        const noteContent = database.readNota(note.usuario, note.titulo);
        response.notes = noteContent;
        break;
      default:
        console.log(chalk.bold.red('The type of message is wrong'));
        break;
    }

    /**
     * The response is sent to the client.
     */
    connection.write(JSON.stringify(response), (error) => {
      if (error) {
        console.log(chalk.bold.
            red('The response has not been sent to the client.'));
      } else {
        console.log(chalk.bold.
            green('The response has been sent to the client.'));
        connection.end();
      }
    });
  });

  /**
   * If there is an error in the connection it is handled properly.
   */
  connection.on('error', (err) => {
    if (err) {
      console.log(`Connection could not be established: ${err.message}`);
    }
  });

  /**
   * When a client disconnects a message informing about this is displayed
   * on the server.
   */
  connection.on('close', () => {
    console.log(chalk.bold.green('A client has disconnected.\n'));
  });
});

/**
 * The server is listening on port 60300.
 */
server.listen(60300, () => {
  console.log(chalk.bold.green('Waiting for clients to connect...\n'));
});
