import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
// eslint-disable-next-line max-len
import {MessageEventEmitterServer} from '../src/server/messageEventEmitterServer';

describe('MessageEventEmitterServer class tests', () => {
  // eslint-disable-next-line max-len
  it('A request event is emitted when the entire message is received', (done) => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitterServer(socket);

    server.on('request', (message) => {
      // eslint-disable-next-line max-len
      expect(message).to.be.eql({'titulo': 'Test note', 'cuerpo': 'This is a test note', 'color': 'verde'});
      done();
    });

    socket.emit('data', '{"titulo": "Test note",');
    socket.emit('data', '"cuerpo": "This is a test note",');
    socket.emit('data', '"color": "verde"}');
    socket.emit('data', '\n');
  });
});
