import {spawn} from 'child_process';
import * as net from 'net';

net.createServer((connection) => {
  console.log('A client has connected.');
  connection.write(JSON.stringify({'type': 'connected'}));
  connection.on('data', (data) => {
    console.log('Command to execute: ' + data.toString());
    const command = spawn(data.toString(), {shell: true});
    command.stdout.on('data', (dataChunk) => {
      // eslint-disable-next-line max-len
      connection.write(JSON.stringify({'type': 'success', 'msg': dataChunk.toString()}) + '\n');
      connection.end();
    });

    command.stderr.on('data', (error) => {
      // eslint-disable-next-line max-len
      connection.write(JSON.stringify({'type': 'stderr', 'msg': error.toString()}));
      connection.end();
    });

    command.on('error', (err) => {
      connection.write(JSON.stringify({'type': 'error', 'msg': err.message}));
      connection.end();
    });
  });

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
