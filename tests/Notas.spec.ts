import 'mocha';
import {expect} from 'chai';
import {Nota} from '../src/app/Nota';

describe('Test de la clase Nota', () => {
  const nota = new Nota('Mi nueva nota', 'Esta nota es una prueba', 'blue');

  it('Una nota es una intancia de la clase Nota', () => {
    expect(nota).to.be.instanceOf(Nota);
  });

  it('El titulo de la nota es Test Nota', () => {
    expect(nota.getTitulo()).to.be.eql('Mi nueva nota');
  });

  it('El contenido de la nota es Nota prueba', () => {
    expect(nota.getCuerpo()).to.be.eql('Esta nota es una prueba');
  });

  it('El color de la nota es Blue', () => {
    expect(nota.getColor()).to.be.eql('blue');
  });

  it('El color de la nota es Blue', () => {
    expect(nota.write()).to.be.eql(JSON.stringify(nota, null, 2));
  });
});
