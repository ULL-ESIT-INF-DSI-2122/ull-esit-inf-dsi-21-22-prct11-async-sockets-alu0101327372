import 'mocha';
import * as fs from 'fs';
import {expect} from 'chai';
import {AppNotas} from '../src/app/AppNotas';

describe('Test de la clase AppNotas', () => {
  const app = new AppNotas();
  it('Si el directorio no existe se crea', () => {
    app.addNota('DSI', 'Mi nota', 'Esta nota es una prueba', 'blue');
    expect(fs.existsSync('data/DSI')).true;
    app.removeNota('DSI', 'Mi nota');
  });

  it('No se puede crear una nota con un título que ya existe', () => {
    app.addNota('Marco', 'Mi nota', 'Esta nota es una prueba', 'blue');
    // eslint-disable-next-line max-len
    expect(app.addNota('Marco', 'Mi nota', 'Esta nota es una prueba 2', 'blue')).to.be.eql(false);
  });

  it('Se puede eliminar una nota', () => {
    // eslint-disable-next-line max-len
    expect(app.removeNota('Marco', 'Mi nota')).to.be.eql(true);
    expect(fs.existsSync('data/Marco/Mi nota.json')).false;
  });

  it('No se puede eliminar una nota que no puede eliminar una nota', () => {
    // eslint-disable-next-line max-len
    expect(app.removeNota('Marco', 'Mi nota')).to.be.eql(false);
    expect(fs.existsSync('data/Marco/Mi nota.json')).false;
  });

  it('Se puede modificar una nota', () => {
    // eslint-disable-next-line max-len
    app.addNota('Marco', 'Mi nota modificada', 'Esta nota es una prueba', 'blue');
    // eslint-disable-next-line max-len
    expect(app.modifyNota('Marco', 'Mi nota modificada', 'Esta nota es una prueba 2', 'green')).to.be.eql(true);
    app.removeNota('Marco', 'Mi nota modificada');
  });

  it('No se puede modificar una nota que no existe', () => {
    // eslint-disable-next-line max-len
    expect(app.modifyNota('Marco', 'Mi nota modificada', 'Esta nota es una prueba 2', 'green')).to.be.eql(false);
  });

  // eslint-disable-next-line max-len
  it('No se pueden listar las notas de un ususario que no ha añadido ninguna', () => {
    // eslint-disable-next-line max-len
    expect(app.listNotas('Marcos')).to.be.eql([]);
  });

  it('No se puede leer una nota que no concuerda con el titulo', () => {
    // eslint-disable-next-line max-len
    expect(app.readNota('Marco', 'Mi nota')).to.be.eql(false);
    app.removeNota('Marco', 'Mi nota 1');
    app.removeNota('Marco', 'Mi nota 2');
    app.removeNota('Marco', 'Mi nota 3');
    app.removeNota('Marco', 'Mi nota 4');
  });
});
