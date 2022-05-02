import * as fs from 'fs';
import chalk from 'chalk';
import {Nota} from './Nota';
import {Color} from './Color';

const NOEXISTNOTA: string = chalk.red('No existe una nota con ese título');

/**
 * @class Aplicación de procesamiento de notas de texto.
 */
export class AppNotas {
  /**
   * Inicializa la app.
   */
  constructor() {
    // El constructor esta vacío porque no necesita parámetros.
  }

  /**
   * Añade una nota a la lista.
   * @param usuario Usuario que añade la nota
   * @param titulo Titulo de la nota
   * @param cuerpo Cuerpo de la nota
   * @param color Color del texto de la nota
   */
  public addNota(usuario: string, titulo: string,
      cuerpo: string, color: Color): string {
    if (!fs.existsSync(`data/${usuario}`)) {
      fs.mkdirSync(`data/${usuario}`, {recursive: true});
    }
    const nota = new Nota(titulo, cuerpo, color);
    if (!fs.existsSync(`data/${usuario}/${titulo}.json`)) {
      fs.writeFileSync(`data/${usuario}/${titulo}.json`, nota.write());
      console.log(chalk.green('Nueva nota añadida'));
      return chalk.green('Nueva nota añadida');
    } else {
      console.log(chalk.red('Ya existe una nota con ese título'));
      return chalk.red('Ya existe una nota con ese título');
    }
  }

  /**
   * Modifica una nota a la lista.
   * @param usuario Usuario que modifica la nota
   * @param titulo Titulo de la nota
   * @param cuerpo Cuerpo de la nota
   * @param color Color del texto de la nota
   */
  public modifyNota(usuario: string, titulo: string,
      cuerpo: string, color: Color): string {
    if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
      const nota = new Nota(titulo, cuerpo, color);
      fs.writeFileSync(`data/${usuario}/${titulo}.json`, nota.write());
      console.log(chalk.green('Nota modificada correctamente'));
      return chalk.green('Nota modificada correctamente');
    } else {
      console.log(NOEXISTNOTA);
      return NOEXISTNOTA;
    }
  }

  /**
   * Elimina una nota de la lista.
   * @param usuario Usuario que elimina la nota
   * @param titulo Titulo de la nota
   */
  public removeNota(usuario: string, titulo: string): string {
    if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
      fs.rmSync(`data/${usuario}/${titulo}.json`);
      console.log(chalk.green('Nota eliminada correctamente'));
      return chalk.green('Nota eliminada correctamente');
    } else {
      console.log(NOEXISTNOTA);
      return NOEXISTNOTA;
    }
  }

  /**
   * Lista los títulos de las notas de la lista.
   * @param usuario Usuario del que se listan los titulos de las notas
   */
  public listNotas(usuario: string): string {
    if (!fs.existsSync(`data/${usuario}`)) {
      console.log(chalk.red('No existe ese usuario'));
      return chalk.red('No existe ese usuario');
    } else if (fs.readdirSync(`data/${usuario}`).length === 0) {
      console.log(chalk.red('No tienes ninguna nota en tu lista'));
      return chalk.red('No tienes ninguna nota en tu lista');
    } else {
      const allTitulo: string[] = fs.readdirSync(`data/${usuario}`);
      const result: string[] = [];
      allTitulo.forEach((titulo) => {
        const data = fs.readFileSync(`data/${usuario}/${titulo}`);
        const notaObject = JSON.parse(data.toString());
        const nota: Nota = new Nota(notaObject.titulo,
            notaObject.cuerpo, notaObject.color);
        switch (nota.getColor()) {
          case 'azul':
            result.push(chalk.blue(nota.getTitulo()));
            break;
          case 'rojo':
            result.push(chalk.red(nota.getTitulo()));
            break;
          case 'verde':
            result.push(chalk.green(nota.getTitulo()));
            break;
          case 'amarillo':
            result.push(chalk.yellow(nota.getTitulo()));
            break;
        }
      });
      console.log(result.join('\n'));
      return result.join('\n');
    }
  }

  /**
   * Leer una nota concreta de la lista.
   * @param usuario Usuario que elimina la nota
   * @param titulo Titulo de la nota
   */
  public readNota(usuario: string, titulo: string): string {
    if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
      const data = fs.readFileSync(`data/${usuario}/${titulo}.json`);
      const notaObject = JSON.parse(data.toString());
      const nota: Nota = new Nota(notaObject.titulo,
          notaObject.cuerpo, notaObject.color);
      switch (nota.getColor()) {
        case 'azul':
          console.log(chalk.blue(nota.getTitulo(), '\n', nota.getCuerpo()));
          return chalk.blue(nota.getTitulo(), '\n', nota.getCuerpo());
        case 'rojo':
          console.log(chalk.red(nota.getTitulo(), '\n', nota.getCuerpo()));
          return chalk.red(nota.getTitulo(), '\n', nota.getCuerpo());
        case 'verde':
          console.log(chalk.green(nota.getTitulo(), '\n', nota.getCuerpo()));
          return chalk.green(nota.getTitulo(), '\n', nota.getCuerpo());
        case 'amarillo':
          console.log(chalk.yellow(nota.getTitulo(), '\n', nota.getCuerpo()));
          return chalk.yellow(nota.getTitulo(), '\n', nota.getCuerpo());
      }
    } else {
      console.log(NOEXISTNOTA);
      return NOEXISTNOTA;
    }
  }
}
