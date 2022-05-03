import {EventEmitter} from 'events';

/**
 * Class that emits a request event when it receives a complete message.
 */
export class MessageEventEmitterServer extends EventEmitter {
  /**
   * Constructor of the class that
   * receives portions of a message with the data event,
   * and when the message includes \n
   * it means that the complete message has been
   * received so a request event is emitted.
   * @param connection An object of the
   * EventEmitter class to be used as a socket.
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
