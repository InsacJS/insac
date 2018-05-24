![Kiku](assets/insac-logo-256.png)

Insac JS es un framework de creación de servicios web basado en lenguaje script que utiliza arquitectura REST.

## Filosofía

El framework está enfocado en la automatización de procesos, la reutilización de código e impulsa el trabajo colaborativo.

## Tecnologías utilizadas

El framework ha sido implementado utilizando el lenguaje JavaScript bajo el estándar de programación ECMAScript 2017, esto por el potencial que alcanzó el lenguaje gracias a NodeJS, un entorno de ejecución para JavaScript construido con el motor de JavaScript V8 de Chrome.

NodeJS permite crear aplicaciones del lado del servidor, además de que es una excelente herramienta para crear servicios web gracias a su modelo de operaciones E/S sin bloqueo orientado a eventos, que lo hace liviano y eficiente.

A continuación de describen las diferentes tecnologías y herramientas con las que trabaja el framework:

| Nombre      | Versión | Descripción                                                    |
|-------------|---------|----------------------------------------------------------------|
| `NodeJS`    | 9.5     | Entorno de programación de JavaScript.                         |
| `Express`   | 4.16    | Framework de NodeJS.                                           |
| `Sequelize` | 4.37    | Framework ORM de NodeJS.                                       |
| `Yarn`      | 1.7     | Manejador de dependencias.                                     |
| `PM2`       | 2.7     | Gestor avanzado de procesos de producción para NodeJS.         |
| `Git`       | 2.7     | Sistema de control de versiones distribuido de código abierto. |
| `Eslint`    | 4.19    | Herramienta de linting para JavaScript.                        |

## Caracteristicas

- **Estructura de proyecto:** Se organiza el proyecto utilizando un sistema que permite identificar a los componentes de la aplicación y sus respectivas funciones a través del nombre y la extensión de los ficheros.

- **Documentación automática** Se encarga de crear el apidoc de manera automática cada vez que se ejecuta la aplicación, logrando de esta forma que siempre se encuentre actualizada.

- **Validador automático** Se encarga de validar los datos de entrada de forma automática, cuando los datos llegan al middleware o al controlador, éstos ya se encuentran validados y convertidos al tipo de dato esperado.

- **Sistema de filtrado de datos** - Proporciona herramientas para facilitar la creación de filtros. Por defecto todas las peticiones incluyen el filtro `fields` el cual indica que campos se requiere en la respuesta.

- **Sistema de instalación por módulos** Sobre una base de datos, se crea un esquema para cada módulo, de esta forma es posible tener dos tablas con el mismo nombre, pero en diferentes módulos.

- **Sistema de logs y control de errores** El framework incluye un sistema para monitorear todas las peticiones y capturar cualquier tipo de error no controlado, asegurando de esta forma el correcto funcionamiento del sistema en caso de producirse algún tipo de error, registrándolo a su vez en un archivo de logs.

## Ejemplo

``` js
const { Insac } = require('insac')

const app = new Insac()

app.addModule('API')

app.init()
```
