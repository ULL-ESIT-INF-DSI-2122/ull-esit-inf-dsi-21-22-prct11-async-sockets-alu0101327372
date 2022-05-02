import {EventEmitter} from 'events';

/**
 * Class that extends from EventEmitter
 */
export class CommandEmitter extends EventEmitter {
  /**
   * Constructor
   * @param connection Socket
   */
  constructor(connection: EventEmitter) {
    super();
    connection.on('data', (data) => {
      const message = JSON.parse(data);
      this.emit('command', message);
    });
  }
}
