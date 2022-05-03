import {EventEmitter} from 'events';

/**
 * @class Clase que emite un evento de mensaje
 * cuando recibe un mensaje completo.
 */
export class MessageEventEmitterClient extends EventEmitter {
  /**
   * Constructor de la clase que recibe
   * porciones de un mensaje con el evento de datos,
   * y cuando recibe un evento final,
   * emite un evento de mensaje para indicar que tiene
   * recibido un mensaje completo.
   * @param connection Un objeto de la clase EventEmitter
   * para ser utilizado como socket.
   */
  constructor(connection: EventEmitter) {
    super();

    let wholeResponse = '';
    connection.on('data', (responseChunk) => {
      wholeResponse += responseChunk;
    });

    connection.on('end', () => {
      this.emit('message', JSON.parse(wholeResponse));
    });
  }
}
