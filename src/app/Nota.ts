import {Color} from './Color';

/**
 * @class Representa una nota.
 */
export class Nota {
  /**
   * Inicializa una nota.
   * @param {string} titulo Titulo de la nota
   * @param {string} cuerpo Cuerpo de la nota
   * @param {Color} color Color del texto
   */
  constructor(
    private readonly titulo: string,
    private readonly cuerpo: string,
    private readonly color: Color,
  ) {
    this.titulo = titulo;
    this.cuerpo = cuerpo;
    this.color = color;
  }

  /**
   * Devuelve el título de la nota.
   * @returns {string}
   */
  public getTitulo(): string {
    return this.titulo;
  }

  /**
   * Devuelve el color del texto.
   * @returns {string}
   */
  public getColor(): Color {
    return this.color;
  }

  /**
   * Devuelve el cuerpo de la nota.
   * @returns {string}
   */
  public getCuerpo(): string {
    return this.cuerpo;
  }

  /**
   * Escribe una nota en formato JSON.
   * @returns {string}
   */
  public write(): string {
    return JSON.stringify(this, null, 2);
  }
}
