import * as yargs from 'yargs';
import {AppNotas} from './AppNotas';

const app = new AppNotas();

yargs.command({
  command: 'add',
  describe: 'Añade una nueva nota',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'Titulo',
      demandOption: true,
      type: 'string',
    },
    cuerpo: {
      describe: 'Cuerpo',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string' &&
        typeof argv.cuerpo === 'string' && typeof argv.color === 'string' &&
        ((argv.color === 'azul') || (argv.color === 'rojo') || (
          argv.color === 'verde') || (argv.color === 'amarillo'))) {
      app.addNota(argv.usuario, argv.titulo, argv.cuerpo, argv.color);
    }
  },
});

yargs.command({
  command: 'modify',
  describe: 'Modifica una nota existente',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'Titulo',
      demandOption: true,
      type: 'string',
    },
    cuerpo: {
      describe: 'Cuerpo',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string' &&
        typeof argv.cuerpo === 'string' && typeof argv.color === 'string' &&
        ((argv.color === 'azul') || (argv.color === 'rojo') ||
        (argv.color === 'verde') || (argv.color === 'amarillo'))) {
      app.modifyNota(argv.usuario, argv.titulo, argv.cuerpo, argv.color);
    }
  },
});

yargs.command({
  command: 'remove',
  describe: 'Borra una nota existente',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'Titulo',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string') {
      app.removeNota(argv.usuario, argv.titulo);
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'Lista todos los titulos de las notas de un usuario',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string') {
      app.listNotas(argv.usuario);
    }
  },
});

yargs.command({
  command: 'read',
  describe: 'Lee la nota de un usuario',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'Titulo',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string') {
      app.readNota(argv.usuario, argv.titulo);
    }
  },
});

yargs.parse();
