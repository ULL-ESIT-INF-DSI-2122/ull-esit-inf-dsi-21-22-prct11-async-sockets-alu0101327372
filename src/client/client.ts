import * as yargs from 'yargs';
import chalk from 'chalk';
import * as net from 'net';
import {MessageEventEmitterClient} from './messageEventEmitterClient';
import {RequestType} from '../types';

/**
 * A client connected to port 60300 of the server is created.
 */
const client = net.connect({port: 60300});

/**
 * An object of class MessageEventEmitterClient is created.
 */
const socket = new MessageEventEmitterClient(client);

/**
 * The request message is by default of type add.
 */
let request: RequestType = {
  type: 'add',
  usuario: '',
};

/**
 * Command to add a note to the list.
 */
yargs.command( {
  command: 'add',
  describe: 'Add a new note',
  builder: {
    usuario: {
      describe: 'Usuario who is going to add the note',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'The titulo of the note',
      demandOption: true,
      type: 'string',
    },
    cuerpo: {
      describe: 'The text of the note',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'The color of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.cuerpo === 'string' && typeof argv.titulo === 'string' &&
        typeof argv.usuario === 'string' && typeof argv.color === 'string') {
      if (argv.color == 'rojo' || argv.color == 'verde' ||
          argv.color == 'azul' || argv.color == 'amarillo') {
        request ={
          type: 'add',
          usuario: argv.usuario,
          titulo: argv.titulo,
          cuerpo: argv.cuerpo,
          color: argv.color,
        };
      } else {
        console.log(chalk.
            bold.red('Note color must be red, green, yellow, or blue'));
      }
    }
  },
});

/**
 * Command to modify a note in the list.
 */
yargs.command({
  command: 'modify',
  describe: 'Modify a note',

  builder: {
    usuario: {
      describe: 'Usuario who is going to modify a note',
      demandOption: true,
      type: 'string',
    },

    titulo: {
      describe: 'The titulo of the note',
      demandOption: true,
      type: 'string',
    },

    cuerpo: {
      describe: 'The text of the note',
      demandOption: true,
      type: 'string',
    },

    color: {
      describe: 'The color of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.cuerpo === 'string' && typeof argv.color === 'string' &&
          typeof argv.usuario === 'string' && typeof argv.titulo === 'string') {
      if (argv.color != 'azul' &&
            argv.color != 'rojo' && argv.color != 'amarillo' &&
            argv.color != 'verde') {
        console.log(chalk.
            bold.red('Note color must be red, green, blue, or yellow.'));
      } else {
        request = {
          type: 'modify',
          usuario: argv.usuario,
          titulo: argv.titulo,
          cuerpo: argv.cuerpo,
          color: argv.color,
        };
      }
    }
  },
});

/**
 * Command to remove a note from the list.
 */
yargs.command({
  command: 'remove',
  describe: 'Delete a note',
  builder: {
    usuario: {
      describe: 'usuario who is going to delete the note',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'The titulo of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.titulo === 'string' && typeof argv.usuario === 'string') {
      request = {
        type: 'remove',
        usuario: argv.usuario,
        titulo: argv.titulo,
      };
    }
  },
});

/**
 * Command to list the titulos of a usuario's notes.
 */
yargs.command({
  command: 'list',
  describe: 'List the titulos of the notes',
  builder: {
    usuario: {
      describe: 'usuario who will show his notes',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string') {
      request = {
        type: 'list',
        usuario: argv.usuario,
      };
    }
  },
});

/**
 * Command to read a specific note from the list.
 */
yargs.command({
  command: 'read',
  describe: 'Read a specific note from the list',
  builder: {
    usuario: {
      describe: 'usuario who will read a note',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'The titulo of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string') {
      request = {
        type: 'read',
        usuario: argv.usuario,
        titulo: argv.titulo,
      };
    }
  },
});

/**
 * Process the arguments passed from the command line to the application.
 */
yargs.parse();

/**
 * The message is sent to the server.
 */
client.write(JSON.stringify(request) + `\n`, (err) => {
  if (err) {
    console.log(chalk.bold.red('The note could not be sent to the server.'));
  }
});

/**
 * When the message event is received,
 * the response sent by the server is processed.
 */
socket.on('message', (jsonRequest) => {
  switch (jsonRequest.type) {
    case 'add':
      if (jsonRequest.success) {
        console.log( chalk.bold.green('New note added!'));
      } else {
        console.log(chalk.bold.red('Note titulo taken! '));
      }
      break;
    case 'modify':
      if (jsonRequest.success) {
        console.log(chalk.bold.green('Note modified!'));
      } else {
        console.log(chalk.
            bold.red('The note you want to modify does not exist!'));
      }
      break;
    case 'remove':
      if (jsonRequest.success ) {
        console.log(chalk.bold.green('Note removed!') );
      } else {
        console.log( chalk.bold.red('Note not found'));
      }
      break;
    case 'list':
      if (jsonRequest.success) {
        console.log('Your notes' );
        jsonRequest.notes.forEach((note: any) => {
          console.log( chalk.bold.keyword(note.color)(note.titulo));
        });
      } else {
        console.log(chalk.bold.red('You have never saved a note') );
      }
      break;
    case 'read':
      if (jsonRequest.success) {
        console.log(chalk.bold.
            keyword(jsonRequest.notes[0].color)(jsonRequest.notes[0].titulo +
              '\n' + jsonRequest.notes[0].cuerpo));
      } else {
        console.log(chalk.bold.red('Note not found') );
      }
      break;
    default:
      console.log(chalk.bold.red('The type of message is wrong'));
      break;
  }
});

/**
 * If there is an error in the connection it is handled properly.
 */
client.on( 'error', (err) => {
  console.log(`Connection could not be established: ${err.message}` );
});
