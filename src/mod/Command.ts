import {spawn} from 'child_process';

/**
 * @class Executes a command
 */
export abstract class Command {
  /**
  * Executes a command.
  * @param {string} cmd Command to execute
  * @param {Function} callback Function to callback
  */
  // eslint-disable-next-line max-len
  public static execCommand = (cmd: string, callback: (err: string | undefined, res: string | undefined) => void) => {
    console.log(`Command to execute: ${cmd}`);
    const command = spawn(cmd, {shell: true});
    let succes: string = '';
    let error: string = '';
    command.stdout.on('data', (dataChunk) => {
      succes += dataChunk.toString();
    });

    command.stderr.on('data', (err) => {
      error += err;
    });

    command.on('error', (err) => {
      error += err;
    });

    command.on('close', () => {
      if (succes !== '') {
        callback(undefined, succes);
      } else {
        callback(error, undefined);
      }
    });
  };
}
