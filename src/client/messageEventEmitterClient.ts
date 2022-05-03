import {EventEmitter} from 'events';

/**
 * Class that emits a message event when it receives a complete message.
 */
export class MessageEventEmitterClient extends EventEmitter {
  /**
   * Constructor of the class that receives
   * portions of a message with the data event,
   * and when it receives an end event,
   * it emits a message event to indicate that it has
   * received a complete message.
   * @param connection An object of the EventEmitter class
   * to be used as a socket.
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
