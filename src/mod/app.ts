import express from 'express';
import {Command} from './Command';

const app = express();

app.get('/execmd', (req, res) => {
  if (!req.query.cmd || !req.query.args) {
    res.send({
      error: 'A command and his arguments have to be provided',
    });
  } else {
    Command.execCommand(req.query.cmd + ' ' + req.query.args, (err, data) => {
      if (err) {
        res.send({'error': err});
      } else {
        res.send({'output': data});
      }
    });
  }
});

app.get('*', (_, res) => {
  res.send('<h1>404</h1>');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
