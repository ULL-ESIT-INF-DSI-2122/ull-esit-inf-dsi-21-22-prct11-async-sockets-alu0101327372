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
      cuerpo: string, color: Color): boolean {
    if (!fs.existsSync(`data/${usuario}`)) {
      fs.mkdirSync(`data/${usuario}`, {recursive: true});
    }
    const nota = new Nota(titulo, cuerpo, color);
    if (!fs.existsSync(`data/${usuario}/${titulo}.json`)) {
      fs.writeFileSync(`data/${usuario}/${titulo}.json`, nota.write());
      console.log(chalk.green('Nueva nota añadida'));
      return true;
    } else {
      console.log(chalk.red('Ya existe una nota con ese título'));
      return false;
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
      cuerpo: string, color: Color): boolean {
    if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
      const nota = new Nota(titulo, cuerpo, color);
      fs.writeFileSync(`data/${usuario}/${titulo}.json`, nota.write());
      console.log(chalk.green('Nota modificada correctamente'));
      return true;
    } else {
      console.log(NOEXISTNOTA);
      return false;
    }
  }

  /**
   * Elimina una nota de la lista.
   * @param usuario Usuario que elimina la nota
   * @param titulo Titulo de la nota
   */
  public removeNota(usuario: string, titulo: string): boolean {
    if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
      fs.rmSync(`data/${usuario}/${titulo}.json`);
      console.log(chalk.green('Nota eliminada correctamente'));
      return true;
    } else {
      console.log(NOEXISTNOTA);
      return false;
    }
  }

  /**
   * Lista los títulos de las notas de la lista.
   * @param usuario Usuario del que se listan los titulos de las notas
   */
  public listNotas(usuario: string): Nota[] {
    if (!fs.existsSync(`data/${usuario}`)) {
      return [];
    }
    const arrayNote: Nota[] = [];
    const filesInDirectory: string[] = fs.readdirSync(`data/${usuario}`);
    filesInDirectory.forEach((titulo) => {
      // eslint-disable-next-line max-len
      const contentFile: string = fs.readFileSync(`data/${usuario}/${titulo}`, {encoding: 'utf-8'});
      const jsonContent = JSON.parse(contentFile);
      // eslint-disable-next-line max-len
      arrayNote.push(new Nota(jsonContent.titulo, jsonContent.cuerpo, jsonContent.color));
    });
    return arrayNote;
  }

  /**
   * Leer una nota concreta de la lista.
   * @param usuario Usuario que elimina la nota
   * @param titulo Titulo de la nota
   */
  public readNota(usuario: string, titulo: string): Nota | boolean {
    if (!fs.existsSync(`data/${usuario}/${titulo}.json`)) {
      return false;
    }
    // eslint-disable-next-line max-len
    const contentFile: string = fs.readFileSync(`data/${usuario}/${titulo}.json`, {encoding: 'utf-8'});
    const jsonContent = JSON.parse(contentFile);
    // eslint-disable-next-line max-len
    return (new Nota(jsonContent.titulo, jsonContent.cuerpo, jsonContent.color));
  }
}
