import * as net from 'net';
import {CommandEmitter} from './CommandEmitter';

if (process.argv.length !== 3) {
  console.log('Please, provide a filename.');
} else {
  const command = process.argv[2];
  const socket = net.connect({port: 60300});
  const client = new CommandEmitter(socket);
  socket.write(command);
  socket.end();
  client.on('command', (message) => {
    if (message.type === 'connected') {
      console.log(`Connection established: executing command ${command}`);
    } else if (message.type === 'success') {
      console.log(`Result: ${message.msg}`);
    } else if (message.type === 'error') {
      console.log(`Command error: ${message.msg}`);
    } else if (message.type === 'stderr') {
      console.log(`Error executing the command: ${message.msg}`);
    } else {
      console.log(`Message type ${message.type} is not valid`);
    }
  });
}
