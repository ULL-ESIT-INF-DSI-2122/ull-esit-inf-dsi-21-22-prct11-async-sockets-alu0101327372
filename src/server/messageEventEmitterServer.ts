import {EventEmitter} from 'events';

/**
 * @class Clase que emite un evento de solicitud
 * cuando recibe un mensaje completo.
 */
export class MessageEventEmitterServer extends EventEmitter {
  /**
   * Constructor de la clase que
   * recibe partes de un mensaje con el evento de datos,
   * y cuando el mensaje incluye \n
   * significa que el mensaje completo ha sido
   * recibido por lo que se emite un evento de solicitud.
   * @param connection Un objeto de la clase EventEmitter para usar como socket.
   */
  constructor(connection: EventEmitter) {
    super();

    let wholeMessage = '';
    connection.on('data', (messageChunk) => {
      wholeMessage += messageChunk;

      let messageLimit = wholeMessage.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeMessage.substring(0, messageLimit);
        wholeMessage = wholeMessage.substring(messageLimit + 1);
        this.emit('request', JSON.parse(message));
        messageLimit = wholeMessage.indexOf('\n');
      }
    });
  }
}
