![Kiku](assets/insac-logo-512.png)

Insac JS es un framework de creación de servicios web basado en lenguaje script que utiliza la arquitectura REST.

## Filosofía

El framework está enfocado en la automatización de procesos, la reutilización de código e impulsa el trabajo colaborativo.

## Tecnologías utilizadas

El framework ha sido implementado utilizando el lenguaje JavaScript bajo el estándar de programación ECMAScript 2017, esto por el potencial que alcanzó el lenguaje gracias a NodeJS, un entorno de ejecución para JavaScript construido con el motor de JavaScript V8 de Chrome.

NodeJS permite crear aplicaciones del lado del servidor, además de que es una excelente herramienta para crear servicios web gracias a su modelo de operaciones E/S sin bloqueo orientado a eventos, que lo hace liviano y eficiente.

A continuación de describen las diferentes tecnologías y herramientas con las que trabaja el framework:

- **NodeJS v9.5:** Entorno de programación de JavaScript.
- **Express v4.16:** Framework de NodeJS.
- **Sequelize v4.32:** Framework ORM de NodeJS.
- **Yarn:** Manejador de dependencias.
- **PM2:** Gestor avanzado de procesos de producción para NodeJS.
- **Git:** Sistema de control de versiones distribuido de código abierto.
- **Eslint:** Herramienta de linting para JavaScript, un linter es un programa que se encarga de revisar el código escrito y es - capaz de señalar errores y posibles bugs.

## Caracteristicas

- **Estructura de proyecto:** El framework organiza el proyecto utilizando un sistema que permite identificar a los componentes de la aplicación y sus respectivas funciones a través del nombre y la extensión de los ficheros.

- **Documentación automática** El framework se encarga de crear el apidoc de manera automática cada vez que se ejecuta la aplicación, logrando de esta forma que siempre se encuentre actualizada.

- **Validador automático** El framework se encarga de validar los datos de entrada de forma automática, cuando los datos llegan al middleware o al controlador, éstos ya se encuentran validados y convertidos al tipo de dato esperado.

- **Filtrado de datos** - El framework proporciona herramientas para facilitar la creación de filtros. Por defecto todas las peticiones incluyen el filtro `fields` el cual indica que campos se requiere en la respuesta.

- **Herramienta para crear datos** Incluye un nuevo mecanismo para inssertar registros en la base de datos cuando ésta se instale.

- **Sistema de logs y control de errores** El framework incluye un sistema para monitorear todas las peticiones y capturar cualquier tipo de error no controlado, asegurando de esta forma el correcto funcionamiento del sistema en caso de producirse algún tipo de error, registrándolo a su vez en un archivo de logs.

## Ejemplo

``` js
const { Insac } = require('insac')

const app = new Insac()

app.addModule('API')

app.init()
```
