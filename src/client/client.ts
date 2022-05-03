import * as yargs from 'yargs';
import chalk from 'chalk';
import * as net from 'net';
import {MessageEventEmitterClient} from './messageEventEmitterClient';
import {RequestType} from '../types';

/**
 * Se crea un cliente conectado al puerto 60300 del servidor.
 */
const client = net.connect({port: 60300});

/**
 * Se crea un objeto de clase MessageEventEmitterClient.
 */
const socket = new MessageEventEmitterClient(client);

/**
 * El mensaje de solicitud es por defecto del tipo add.
 */
let request: RequestType = {
  type: 'add',
  usuario: '',
};

/**
 * Comando para agregar una nota a la lista.
 */
yargs.command( {
  command: 'add',
  describe: 'Agregar una nueva nota',
  builder: {
    usuario: {
      describe: 'Usuario que va a añadir la nota',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'El titulo de la nota.',
      demandOption: true,
      type: 'string',
    },
    cuerpo: {
      describe: 'El cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'El color de la nota.',
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
        console.log(chalk.bold.
            red('El color de la nota debe ser rojo, verde, amarillo o azul.'));
      }
    }
  },
});

/**
 * Comando para modificar una nota en la lista.
 */
yargs.command({
  command: 'modify',
  describe: 'Modificar una nota',

  builder: {
    usuario: {
      describe: 'Usuario que va a modificar una nota',
      demandOption: true,
      type: 'string',
    },

    titulo: {
      describe: 'El titulo de la nota.',
      demandOption: true,
      type: 'string',
    },

    cuerpo: {
      describe: 'El cuerpo de la nota.',
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
        console.log(chalk.bold.
            red('El color de la nota debe ser rojo, verde, azul o amarillo.'));
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
 * Comando para eliminar una nota de la lista.
 */
yargs.command({
  command: 'remove',
  describe: 'Eliminar una nota',
  builder: {
    usuario: {
      describe: 'Usuario que va a borrar la nota',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'El titulo de la nota.',
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
 * Comando para listar los títulos de las notas de un usuario.
 */
yargs.command({
  command: 'list',
  describe: 'Listar los títulos de las notas',
  builder: {
    usuario: {
      describe: 'Usuario que mostrará sus notas',
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
 * Comando para leer una nota específica de la lista.
 */
yargs.command({
  command: 'read',
  describe: 'Leer una nota específica de la lista',
  builder: {
    usuario: {
      describe: 'Usuario que leerá una nota',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'El titulo de la nota.',
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
 * Procesa los argumentos pasados desde la línea de comandos a la aplicación.
 */
yargs.parse();

/**
 * El mensaje se envía al servidor.
 */
client.write(JSON.stringify(request) + `\n`, (err) => {
  if (err) {
    console.log(chalk.bold.red('The note could not be sent to the server.'));
  }
});

/**
 * Cuando se recibe el evento de mensaje,
 * se procesa la respuesta enviada por el servidor.
 */
socket.on('message', (jsonRequest) => {
  switch (jsonRequest.type) {
    case 'add':
      if (jsonRequest.success) {
        console.log( chalk.bold.green('¡Nueva nota añadida!'));
      } else {
        console.log(chalk.bold.red('Nota titulo tomado!'));
      }
      break;
    case 'modify':
      if (jsonRequest.success) {
        console.log(chalk.bold.green('¡Nota modificada!'));
      } else {
        console.log(chalk.
            bold.red('¡La nota que quieres modificar no existe!'));
      }
      break;
    case 'remove':
      if (jsonRequest.success) {
        console.log(chalk.bold.green('¡Nota eliminada!') );
      } else {
        console.log(chalk.bold.red('Nota no encontrada'));
      }
      break;
    case 'list':
      if (jsonRequest.success) {
        console.log('Your notes' );
        jsonRequest.notes.forEach((note: any) => {
          console.log(chalk.bold.keyword(note.color)(note.titulo));
        });
      } else {
        console.log(chalk.bold.red('Nunca has guardado una nota.') );
      }
      break;
    case 'read':
      if (jsonRequest.success) {
        // eslint-disable-next-line max-len
        console.log(chalk.bold.keyword(jsonRequest.notes[0].color)(jsonRequest.notes[0].titulo + '\n' + jsonRequest.notes[0].cuerpo));
      } else {
        console.log(chalk.bold.red('Nota no encontrada') );
      }
      break;
    default:
      console.log(chalk.bold.red('El tipo de mensaje es incorrecto.'));
      break;
  }
});

/**
 * Si hay un error en la conexión se maneja correctamente.
 */
client.on( 'error', (err) => {
  console.log(`No se pudo establecer la conexión: ${err.message}` );
});
