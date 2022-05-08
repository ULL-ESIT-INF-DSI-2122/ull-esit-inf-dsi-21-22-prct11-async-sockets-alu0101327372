# Informe: Práctica 11 - Cliente y servidor para una aplicación de procesamiento de notas de texto

Se ha implementado un servidor y un cliente a partir de una aplicación de procesamiento de notas de texto, haciendo uso de los sockets proporcionados por el módulo net de Node.js.

## Estructura del proyecto

```bash
.
├── README.md
├── _config.yml
├── coverage
├── data
├── dist
├── doc
├── index.md
├── node_modules
├── package-lock.json
├── package.json
├── sonar-project.properties
├── src
├── tests
├── tsconfig.json
└── typedoc.json
```

### La clase Nota

Esta clase es la encargada de representar una nota de la aplicación de procesamiento y estará formada, como mínimo, por un título, un cuerpo y un color.

El título es una especie de nombre que serviría para identificar y diferenciar una nota del resto, por ello se representa como un atributo privado string. El cuerpo de la nota desarrolla, a partir de lo anticipado en el título, el resto de datos informativos y, al igual que el título, es un atributo privado string. El color es la impresión producida por un tono de luz en los órganos visuales, en este caso, se ha optado por definir un tipo de dato Color, que contiene las cadenas (strings) con los colores permitidos:

```typescript
export type Color = 'red' | 'green' | 'blue' | 'yellow';
```

El constructor de la clase recibe los atributos de la clase se han declarado como readonly, es decir, su valor es solo de lectura, pues no cambiarán nunca durante la ejecución. A raíz de esto, solo se necesitan métodos getter en la clase nota para cada uno de los atributos:

```typescript
public getTitulo(): string {
  return this.titulo;
}

public getColor(): Color {
  return this.color;
}

public getCuerpo(): string {
  return this.cuerpo;
}
```

Además, se ha definido un método `write()` que convierte un objeto de la clase en formato JSON, ya que es un requisito guardar las notas en este formato. Este método invoca a la función `stringify()` que convierte un objeto en una cadena de texto JSON.

```typescript
public write(): string {
  return JSON.stringify(this, null, 2);
}
```

### La clase AppNotas

Esta clase se encarga de definir el comportamiento de la aplicación de las notas de texto. Para ello, define los métodos requeridos utilizando el API síncrona proporcionada por Node.js para trabajar con el sistema de ficheros.

### Añadir una nota al sistema

Para añadir una nota, se debe comprobar si ya existe el directorio donde se guardan las notas de cada usuario. Para ello, se utiliza la función `existsSync()` que se encarga de comprobar de forma síncrona si un archivo ya existe en la ruta dada o no.

- En caso de que no exista se crea la ruta. En esta práctica se ha definido una ruta que inicia en el directorio /data.
- En otro caso, se crea un objeto Nota con los parámetros recibidos. Luego, se debe comprobar si ya existe una nota con el mismo título.
  - En caso de que así fuera, deberá mostrarse un mensaje de error por la consola.
  - En caso contrario, se añadirá la nueva nota a la lista, utilizando la función `writeFileSync()` y se muestra un mensaje informativo por la consola.

```typescript
public addNota(usuario: string, titulo: string,
    cuerpo: string, color: Color): boolean {
  if (!fs.existsSync(`data/${usuario}`)) {
    fs.mkdirSync(`data/${usuario}`, {recursive: true});
  }
  const nota = new Nota(titulo, cuerpo, color);
  if (!fs.existsSync(`data/${usuario}/${titulo}.json`)) {
    fs.writeFileSync(`data/${usuario}/${titulo}.json`, nota.write());
    console.log(chalk.green('Nueva nota añadida'));
    return true;
  } else {
    console.log(chalk.red('Ya existe una nota con ese título'));
    return false;
  }
}
```

### Modificar una nota del sistema

Para modificar una nota se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Para ello, al igual que en la función `addNota()` se utiliza la función `existsSync()` con la ruta de la nota a buscar.

- Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. Para lograr esto, se debe crear un objeto nota, y escribirla en el fichero con la función `writeFileSync()`.
- En caso contrario, debe mostrarse un mensaje de error por la consola.

```typescript
public modifyNota(usuario: string, titulo: string,
    cuerpo: string, color: Color): boolean {
  if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
    const nota = new Nota(titulo, cuerpo, color);
    fs.writeFileSync(`data/${usuario}/${titulo}.json`, nota.write());
    console.log(chalk.green('Nota modificada correctamente'));
    return true;
  } else {
    console.log(NOEXISTNOTA);
    return false;
  }
}
```

### Borrar una nota del sistema

Para borrar una nota del sistema se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Esto se hace de la misma manera que en los apartados anteriores, es decir, se comprueba con la función `existsSync()` la ruta.

- Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. Para ello, se llama a la función `rmSync()` que se utiliza para eliminar de forma síncrona un archivo en la ruta dada.
- En caso contrario, debe mostrarse un mensaje de error por la consola.

```typescript
public removeNota(usuario: string, titulo: string): boolean {
  if (fs.existsSync(`data/${usuario}/${titulo}.json`)) {
    fs.rmSync(`data/${usuario}/${titulo}.json`);
    console.log(chalk.green('Nota eliminada correctamente'));
    return true;
  } else {
    console.log(NOEXISTNOTA);
    return false;
  }
}
```

### Listar los títulos de las notas del sistema

Para listar se debe comprobar que exista el usuario. Para ello, se utiliza la función `existsSync()` donde se comprueba que exista el directorio donde se guardan las notas de ese usuario, que por requisito, viene definido por su nombre.

A continuación, se debe leer el contenido del directorio, pero primero se comprueba que no este vacío, lo que indicaría que el usuario no ha añadido ninguna nota. Para hacerlo, se utiliza la función `readdirSync()` que le el contenido del directorio pasado por parámetro.

Una vez hecho esto, se guarda en el array de string **filesInDirectory** todos los nombres de los fichero del directorio, es decir, de todos los títulos. Esta variable, se recorre cada uno de los elementos. La constante **contentFile** guarda el contenido de ese fichero, utiliza la función `readFileSync()` que le el contenido del fichero y convierte el contenido a un objeto y se guarda en la variable **jsonContent**, con la función parse() y crea una nueva a partir de este objeto.

Ahora que ya se tiene un objeto Nota se puede acceder a los atributos para añadirlos al array.

```typescript
public listNotas(usuario: string): Nota[] {
  if (!fs.existsSync(`data/${usuario}`)) {
    return [];
  }
  const arrayNote: Nota[] = [];
  const filesInDirectory: string[] = fs.readdirSync(`data/${usuario}`);
  filesInDirectory.forEach((titulo) => {
    // eslint-disable-next-line max-len
    const contentFile: string = fs.readFileSync(`data/${usuario}/${titulo}`, {encoding: 'utf-8'});
    const jsonContent = JSON.parse(contentFile);
    // eslint-disable-next-line max-len
    arrayNote.push(new Nota(jsonContent.titulo, jsonContent.cuerpo, jsonContent.color));
  });
  return arrayNote;
}
```

### Leer una nota concreta del sistema

Para leer una nota se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Como se ha ido haciendo esto con la función `existsSync()`y al igual que en el apartado anterior se crea:

- Una variable **data** que contiene el contenido del fichero.
- Una variable **notaObject** que contiene el objeto con los datos del fichero JSON.
- Una variable **nota** que inicializa un objeto Nota a partir del objeto con los datos del fichero JSON.

Ahora solo se debe sacar por pantalla el título y el cuerpo de la nota según el color de esta o un mensaje de error si no existe la nota.

```typescript
public readNota(usuario: string, titulo: string): Nota | boolean {
  if (!fs.existsSync(`data/${usuario}/${titulo}.json`)) {
    return false;
  }
  // eslint-disable-next-line max-len
  const contentFile: string = fs.readFileSync(`data/${usuario}/${titulo}.json`, {encoding: 'utf-8'});
  const jsonContent = JSON.parse(contentFile);
  // eslint-disable-next-line max-len
  return (new Nota(jsonContent.titulo, jsonContent.cuerpo, jsonContent.color));
}
```

## Cliente

El cliente se define usando la clase `MessageEventEmitterClient` y la propia definición de los comandos y el socket.

### MessageEventEmitterClient

Esta clase heredada de `EventEmitter` será utilizada por los clientes para comunicarse correctamente con el servidor, ya que es capaz de emitir un evento de tipo mensaje cada vez que se recibe un mensaje completo enviado por el servidor sobre el socket correspondiente.

El constructor toma un objeto `EventEmitter` al que apunta **connection**. Se registra un controlador en este objeto que se ejecutará cada vez que se emita un evento de datos para que el mensaje completo recibido del servidor se almacene en **wholeResponse**.

Cuando se recibe un evento de `end`, significa que el servidor ha terminado de enviar la respuesta, por lo que se emite un evento de tipo `message` con el mensaje completo para notificar al cliente que toda la respuesta está disponible. Tenga en cuenta que el método JSON.parse se usa para serializar el contenido de wholeResponse y convertirlo en una representación de un objeto JSON válido.

```typescript
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
```

### Client

La función `connect` del módulo de `net` de **Node.js**, recibe un objeto que contiene información sobre el conjunto deseado de conexiones y devuelve un objeto `Socket` al que apunta **client**. Después de eso, se crea un objeto de **socket** de clase `MessageEventEmitterClient`, que permitirá que la respuesta del servidor se maneje correctamente cuando se reciba por completo.

Una vez hecho esto, se define una solicitud de tipo `RequestType`, que incluye los elementos que debe tener la solicitud, dependiendo del comando ejecutado por el cliente. Por lo tanto, se utiloiza **yargs** para administrar los diferentes comandos que se pueden usar y establecer correctamente el valor del atributo de solicitud en función del comando que se ha ejecutado.

Después de que `yargs.parse()` haya procesado los argumentos pasados ​​en la línea de comandos, la solicitud se envía al servidor utilizando el método de escritura del socket **client**. `JSON.stringify()` ahora se usa para deserializar objetos de JSON **request**.

Debido a que un objeto `MessageEventEmitterClient` puede emitir eventos de tipo `message`, contiene un controlador que se ejecuta cuando se emite cada evento de ese tipo, es decir, cada vez que se recibe un mensaje completo del servidor. Además de este evento, también contiene el parámetro jsonRequest, que es un objeto JSON con la respuesta del servidor. Así, accedemos a la propiedad de tipo de este objeto, y dependiendo del tipo de respuesta, si la propiedad de **success** es verdadera o falsa, se mostrará en pantalla un mensaje informativo y su contenido correspondiente o mensaje de error.

Finalmente, use un controlador que se ejecute con el evento de error para que pueda manejarse correctamente cuando haya un error con la conexión.

```typescript
/**
 * Se crea un cliente conectado al puerto 60300 del servidor.
 */
const client = net.connect({port: 60300});

/**
 * Se crea un objeto de clase MessageEventEmitterClient.
 */
const socket = new MessageEventEmitterClient(client);

/**
 * El mensaje de solicitud es por defecto del tipo add.
 */
let request: RequestType = {
  type: 'add',
  usuario: '',
};

/**
 * Comando para agregar una nota a la lista.
 */
yargs.command( {
  command: 'add',
  describe: 'Agregar una nueva nota',
  builder: {
    usuario: {
      describe: 'Usuario que va a añadir la nota',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'El titulo de la nota.',
      demandOption: true,
      type: 'string',
    },
    cuerpo: {
      describe: 'El cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'El color de la nota.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.cuerpo === 'string' && typeof argv.titulo === 'string' &&
        typeof argv.usuario === 'string' && typeof argv.color === 'string') {
      if (argv.color == 'red' || argv.color == 'green' ||
          argv.color == 'blue' || argv.color == 'yellow') {
        request = {
          type: 'add',
          usuario: argv.usuario,
          titulo: argv.titulo,
          cuerpo: argv.cuerpo,
          color: argv.color,
        };
      } else {
        // eslint-disable-next-line max-len
        console.log(chalk.red('El color de la nota debe ser red, green, yellow o blue.'));
      }
    }
  },
});

/**
 * Comando para modificar una nota en la lista.
 */
yargs.command({
  command: 'modify',
  describe: 'Modificar una nota',

  builder: {
    usuario: {
      describe: 'Usuario que va a modificar una nota',
      demandOption: true,
      type: 'string',
    },

    titulo: {
      describe: 'El titulo de la nota.',
      demandOption: true,
      type: 'string',
    },

    cuerpo: {
      describe: 'El cuerpo de la nota.',
      demandOption: true,
      type: 'string',
    },

    color: {
      describe: 'The color of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.cuerpo === 'string' && typeof argv.color === 'string' &&
          typeof argv.usuario === 'string' && typeof argv.titulo === 'string') {
      if (argv.color != 'blue' && argv.color != 'red' &&
          argv.color != 'yellow' && argv.color != 'green') {
        // eslint-disable-next-line max-len
        console.log(chalk.red('El color de la nota debe ser red, green, blue o yellow.'));
      } else {
        request = {
          type: 'modify',
          usuario: argv.usuario,
          titulo: argv.titulo,
          cuerpo: argv.cuerpo,
          color: argv.color,
        };
      }
    }
  },
});

/**
 * Comando para eliminar una nota de la lista.
 */
yargs.command({
  command: 'remove',
  describe: 'Eliminar una nota',
  builder: {
    usuario: {
      describe: 'Usuario que va a borrar la nota',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'El titulo de la nota.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.titulo === 'string' && typeof argv.usuario === 'string') {
      request = {
        type: 'remove',
        usuario: argv.usuario,
        titulo: argv.titulo,
      };
    }
  },
});

/**
 * Comando para listar los títulos de las notas de un usuario.
 */
yargs.command({
  command: 'list',
  describe: 'Listar los títulos de las notas',
  builder: {
    usuario: {
      describe: 'Usuario que mostrará sus notas',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string') {
      request = {
        type: 'list',
        usuario: argv.usuario,
      };
    }
  },
});

/**
 * Comando para leer una nota específica de la lista.
 */
yargs.command({
  command: 'read',
  describe: 'Leer una nota específica de la lista',
  builder: {
    usuario: {
      describe: 'Usuario que leerá una nota',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'El titulo de la nota.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string') {
      request = {
        type: 'read',
        usuario: argv.usuario,
        titulo: argv.titulo,
      };
    }
  },
});

/**
 * Procesa los argumentos pasados desde la línea de comandos a la aplicación.
 */
yargs.parse();

/**
 * El mensaje se envía al servidor.
 */
client.write(JSON.stringify(request) + `\n`, (err) => {
  if (err) {
    console.log(chalk.red('La nota no se puede enviar al servidor'));
  }
});

/**
 * Cuando se recibe el evento de mensaje,
 * se procesa la respuesta enviada por el servidor.
 */
socket.on('message', (jsonRequest) => {
  switch (jsonRequest.type) {
    case 'add':
      if (jsonRequest.success) {
        console.log( chalk.green('¡Nueva nota añadida!'));
      } else {
        console.log(chalk.red('Nota titulo tomado!'));
      }
      break;
    case 'modify':
      if (jsonRequest.success) {
        console.log(chalk.green('¡Nota modificada!'));
      } else {
        console.log(chalk.red('¡La nota que quieres modificar no existe!'));
      }
      break;
    case 'remove':
      if (jsonRequest.success) {
        console.log(chalk.green('¡Nota eliminada!') );
      } else {
        console.log(chalk.red('Nota no encontrada'));
      }
      break;
    case 'list':
      if (jsonRequest.success) {
        console.log('Tus notas');
        jsonRequest.notes.forEach((note: any) => {
          console.log(chalk.keyword(note.color)(note.titulo));
        });
      } else {
        console.log(chalk.red('Nunca has guardado una nota.'));
      }
      break;
    case 'read':
      if (jsonRequest.success) {
        // eslint-disable-next-line max-len
        console.log(chalk.keyword(jsonRequest.notes[0].color)(jsonRequest.notes[0].titulo + '\n' + jsonRequest.notes[0].cuerpo));
      } else {
        console.log(chalk.red('Nota no encontrada'));
      }
      break;
    default:
      console.log(chalk.red('El tipo de mensaje es incorrecto.'));
      break;
  }
});

/**
 * Si hay un error en la conexión se maneja correctamente.
 */
client.on( 'error', (err) => {
  console.log(`No se pudo establecer la conexión: ${err.message}` );
});
```

## Servidor

El servidor se define usando la clase `MessageEventEmitterServer` y el socket.

### MessageEventEmitterServer

Esta clase que hereda de `EventEmitter` es utilizada por el servidor para comunicarse correctamente con el cliente, ya que es capaz de emitir un evento de tipo `request` cada vez que recibe una solicitud completa enviada por el cliente a través del socket correspondiente.

El constructor tiene un parámetro **connection**, que es un objeto `EventEmitter`. En este constructor, se utiliza un controlador que se ejecuta cada vez que se envía un evento **data** para que el mensaje completo recibido del servidor se almacene en la variable `wholeMessage`.

Dado que cada mensaje que envía el cliente termina con el carácter `\n`, se intenta encontrar ese carácter en **wholeMessage**. Cuando se recibe un mensaje completo, es decir, hay un carácter `\n` a lo largo del mensaje, el objeto `MessageEventEmitterServer` emitirá un evento del tipo request junto con un objeto JSON que contiene el mensaje completo recibido.

```typescript
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
```

### Server

Primero use el método **createServer** del módulo `net`, reciba un controlador como parámetro y devuelva un objeto **Server**. El parámetro **connection** del controlador es un objeto `Socket` que permite que el servidor se comunique con el cliente.

Dentro del controlador, se define la constante de **socket**, que es un objeto de la clase `MessageEventEmitterServer`. Esta constante se usa para definir un controlador para ejecutar cada vez que se recibe un evento de **request**, es decir, cuando se recibe una solicitud completa del cliente. Cuando esto sucede, se crea database, que es un objeto de la clase `AppNotas` que se utilizará para trabajar con el sistema de archivos. Tras ello, se crea la constante **response** que se trata de la respuesta que se va a enviar al cliente, por defecto está establecida que es de tipo **add** y se ha realizado con éxito. Una vez hecho esto, se analiza la propiedad type de note para saber el tipo de petición que ha realizado el cliente, en función de su valor y lo que devuelvan los métodos de la clase AppNotas se establecen correctamente las propiedades de **response**.

Cuando ya se ha realizado la operación solicitada por el cliente, hay que enviarle una respuesta. Para ello, se utiliza el método **write**, si la respuesta se envía correctamente el servidor cierra mediante `connection.end()` el lado del cliente del socket.

También se incluye un manejador para el evento **error** para que en caso de que se produzca algún error en la conexión, se pueda controlar adecuadamente. Además, se dispone de un manejador para el evento close que muestra en pantalla el mensaje `A client has disconnected`. cada vez que un cliente se desconecta del servidor.

Por último, el método **listen** de `Server` especifica que el servidor va a estar escuchando en el puerto **TCP 60300**, que se trata del puerto al que tendrán que conectarse los clientes.

```typescript
/**
 * Se crea un servidor con el módulo net de Node.js.
 */
const server = net.createServer((connection) => {
  /**
   * Se crea un objeto de clase MessageEventEmitterServer.
   */
  const socket = new MessageEventEmitterServer(connection);

  console.log(chalk.bold.green('A client has connected.'));

  /**
   * Cuando se recibe el evento de solicitud,
   * se procesa el mensaje enviado por el cliente.
   */
  socket.on('request', (note) => {
    const database = new AppNotas();
    const response: ResponseType = {
      type: 'add',
      success: true,
    };
    switch (note.type) {
      case 'add':
        // eslint-disable-next-line max-len
        if (!database.addNota(note.usuario, note.titulo, note.cuerpo, note.color)) {
          response.success = false;
        }
        break;
      case 'modify':
        response.type = 'modify';
        // eslint-disable-next-line max-len
        if (!database.modifyNota(note.usuario, note.titulo, note.cuerpo, note.color)) {
          response.success = false;
        }
        break;
      case 'remove':
        response.type = 'remove';
        if (!database.removeNota(note.usuario, note.titulo)) {
          response.success = false;
        }
        break;
      case 'list':
        response.type = 'list';
        const listNotes: Nota[] = database.listNotas(note.usuario);
        if (listNotes.length == 0) {
          response.success = false;
        } else {
          response.notes = listNotes;
        }
        break;
      case 'read':
        response.type = 'read';
        const noteContent = database.readNota(note.usuario, note.titulo);
        if (noteContent == false) {
          response.success = false;
        } else if (typeof noteContent !== 'boolean') {
          response.notes = [noteContent];
        }
      default:
        console.log(chalk.bold.red('El tipo de mensaje es incorrecto.'));
        break;
    }

    /**
     * La respuesta se envía al cliente.
     */
    connection.write(JSON.stringify(response), (error) => {
      if (error) {
        console.log(chalk.bold.
            red('La respuesta no ha sido enviada al cliente.'));
      } else {
        console.log(chalk.bold.
            green('La respuesta ha sido enviada al cliente.'));
        connection.end();
      }
    });
  });

  /**
   * Si hay un error en la conexión se maneja correctamente.
   */
  connection.on('error', (err) => {
    if (err) {
      console.log(`No se pudo establecer la conexión: ${err.message}`);
    }
  });

  /**
   * Cuando un cliente se desconecta se muestra un mensaje informando de ello
   * en el servidor.
   */
  connection.on('close', () => {
    console.log(chalk.bold.green('Un cliente se ha desconectado.\n'));
  });
});

/**
 * El servidor está escuchando en el puerto 60300.
 */
server.listen(60300, () => {
  console.log(chalk.bold.
      green('Esperando a que los clientes se conecten ...\n'));
});
```

## Peticiones y respuestas

Se ha definido para las peticiones y respuestas en su aplicación.

```typescript
/**
 * Type that represents the elements that a request message must include.
 */
export type RequestType = {
  type: 'add' | 'modify' | 'remove' | 'list' | 'read';
  usuario: string;
  titulo?: string;
  cuerpo?: string;
  color?: Color;
}

/**
* Type that represents the elements that a response message should include.
*/
export type ResponseType = {
  type: 'add' | 'modify' | 'remove' | 'read' | 'list';
  success: boolean;
  notes?: Nota[];
}
```

## Documentación

Para generar la documentación se utilizará la API TypeDoc, este framework convierte los comentarios del código fuente de TypeScript en documentación HTML procesada o en un modelo JSON. Es extensible y admite una variedad de configuraciones. Disponible como módulo CLI o de Node.js. Para instalarlo, se ejecuta `npm install --save-dev typedoc`. Y añadir al fichero [package.json](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101327372/blob/main/package.json) la siguiente línea de código:

```json
"scripts": {
  "doc": "typedoc"
}
```

Ahora para generar la documentación sólo se tiene que ejecutar `npm run doc`. Y se guardará en el directorio [docs](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101327372/tree/master/docs).

## GitHub Actions

GitHub Actions es una plataforma de integración y despliegue continuos (IC/DC) que te permite automatizar tu mapa de compilación, pruebas y despliegue. En esta práctica se han definido 3 acciones, alojadas en el directorio [.github/workflows](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101327372/tree/main/.github/workflows):

- Actions de Coveralls, que es un servicio web que permite a los usuarios realizar un seguimiento de la cobertura de código de su aplicación a lo largo del tiempo para optimizar la eficacia de sus pruebas unitarias.
- Actions de Test: GitHub ejecuta las pruebas y proporciona los resultados de cada prueba en la solicitud de extracción, para que pueda ver si el cambio en su rama introduce un error.
- Actions de SonarCloud: que ayuda a evaluar el estado del código y crear aplicaciones con un código limpio y seguro. Además detecta errores y vulnerabilidades y obtiene comentarios instantáneos. Se integra con su plataforma DevOps.
