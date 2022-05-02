import 'mocha';
import * as fs from 'fs';
import chalk from 'chalk';
import {expect} from 'chai';
import {AppNotas} from '../src/app/AppNotas';

describe('Test de la clase AppNotas', () => {
  const app = new AppNotas();
  it('Si el directorio no existe se crea', () => {
    app.addNota('DSI', 'Mi nota', 'Esta nota es una prueba', 'azul');
    expect(fs.existsSync('data/DSI')).true;
    app.removeNota('DSI', 'Mi nota');
  });

  it('No se puede crear una nota con un título que ya existe', () => {
    app.addNota('Marco', 'Mi nota', 'Esta nota es una prueba', 'azul');
    // eslint-disable-next-line max-len
    expect(app.addNota('Marco', 'Mi nota', 'Esta nota es una prueba 2', 'azul')).to.be.eql(chalk.red('Ya existe una nota con ese título'));
  });

  it('Se puede eliminar una nota', () => {
    // eslint-disable-next-line max-len
    expect(app.removeNota('Marco', 'Mi nota')).to.be.eql(chalk.green('Nota eliminada correctamente'));
    expect(fs.existsSync('data/Marco/Mi nota.json')).false;
  });

  it('No se puede eliminar una nota que no puede eliminar una nota', () => {
    // eslint-disable-next-line max-len
    expect(app.removeNota('Marco', 'Mi nota')).to.be.eql(chalk.red('No existe una nota con ese título'));
    expect(fs.existsSync('data/Marco/Mi nota.json')).false;
  });

  it('Se puede modificar una nota', () => {
    // eslint-disable-next-line max-len
    app.addNota('Marco', 'Mi nota modificada', 'Esta nota es una prueba', 'azul');
    // eslint-disable-next-line max-len
    expect(app.modifyNota('Marco', 'Mi nota modificada', 'Esta nota es una prueba 2', 'verde')).to.be.eql(chalk.green('Nota modificada correctamente'));
    app.removeNota('Marco', 'Mi nota modificada');
  });

  it('No se puede modificar una nota que no existe', () => {
    // eslint-disable-next-line max-len
    expect(app.modifyNota('Marco', 'Mi nota modificada', 'Esta nota es una prueba 2', 'verde')).to.be.eql(chalk.red('No existe una nota con ese título'));
  });

  it('Se pueden listar todas las notas de un usuario', () => {
    app.addNota('Marco', 'Mi nota 1', 'Esta nota es una prueba 1', 'azul');
    app.addNota('Marco', 'Mi nota 2', 'Esta nota es una prueba 2', 'rojo');
    app.addNota('Marco', 'Mi nota 3', 'Esta nota es una prueba 3', 'verde');
    app.addNota('Marco', 'Mi nota 4', 'Esta nota es una prueba 4', 'amarillo');
    // eslint-disable-next-line max-len
    expect(app.listNotas('Marco')).to.be.eql(`${chalk.blue('Mi nota 1')}\n${chalk.red('Mi nota 2')}\n${chalk.green('Mi nota 3')}\n${chalk.yellow('Mi nota 4')}`);
    app.removeNota('Marco', 'Mi nota 1');
    app.removeNota('Marco', 'Mi nota 2');
    app.removeNota('Marco', 'Mi nota 3');
    app.removeNota('Marco', 'Mi nota 4');
  });

  it('No se pueden listar las notas de un ususario que no existe', () => {
    // eslint-disable-next-line max-len
    expect(app.listNotas('Marcos')).to.be.eql(chalk.red('No existe ese usuario'));
  });

  // eslint-disable-next-line max-len
  it('No se pueden listar las notas de un ususario que no ha añadido ninguna', () => {
    // eslint-disable-next-line max-len
    expect(app.listNotas('Marco')).to.be.eql(chalk.red('No tienes ninguna nota en tu lista'));
  });

  it('Se puede leer una nota', () => {
    app.addNota('Marco', 'Mi nota', 'Esta nota es una prueba', 'azul');
    app.addNota('Marco', 'Mi nota 2', 'Esta nota es una prueba 2', 'rojo');
    app.addNota('Marco', 'Mi nota 3', 'Esta nota es una prueba 3', 'verde');
    app.addNota('Marco', 'Mi nota 4', 'Esta nota es una prueba 4', 'amarillo');
    // eslint-disable-next-line max-len
    expect(app.readNota('Marco', 'Mi nota')).to.be.eql(chalk.blue('Mi nota', '\n', 'Esta nota es una prueba'));
    // eslint-disable-next-line max-len
    expect(app.readNota('Marco', 'Mi nota 2')).to.be.eql(chalk.red('Mi nota 2', '\n', 'Esta nota es una prueba 2'));
    // eslint-disable-next-line max-len
    expect(app.readNota('Marco', 'Mi nota 3')).to.be.eql(chalk.green('Mi nota 3', '\n', 'Esta nota es una prueba 3'));
    // eslint-disable-next-line max-len
    expect(app.readNota('Marco', 'Mi nota 4')).to.be.eql(chalk.yellow('Mi nota 4', '\n', 'Esta nota es una prueba 4'));
    app.removeNota('Marco', 'Mi nota');
    app.removeNota('Marco', 'Mi nota 2');
    app.removeNota('Marco', 'Mi nota 3');
    app.removeNota('Marco', 'Mi nota 4');
  });

  it('No se puede leer una nota que no concuerda con el titulo', () => {
    // eslint-disable-next-line max-len
    expect(app.readNota('Marco', 'Mi nota')).to.be.eql(chalk.red('No existe una nota con ese título'));
  });
});
