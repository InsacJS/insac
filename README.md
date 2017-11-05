# INSAC
INSAC, es un framework diseñado para crear de servicios web desarrollado en Javascript utilizando arquitectura REST.

Esta diseñado para facilitar el trabajo al desarrollador backend, ofreciéndole una serie de herramientas que permiten desarrollar aplicaciones mas o menos complejas.

# Caracteristicas (Alcances)
- **Estructura sólida:** Ofrece una estructura de proyecto sólida, escalable y mantenible a largo plazo.

- **Validador automático** Por defecto se validan los datos de entrada (que los tipos de datos sean los correctos) antes de realizar cualquier otra acción propia de la ruta.

- **Generador de funciones básicas** Dispone de herramientas que permiten generar las funciones básicas de un servicio web (obtener, listar, crear, actualizar y eliminar registros) a partir de los modelos, en el caso de las peticiones GET, devuelve la información no solo del recurso especificado también de todos aquellos recursos con los que este relacionado.

- **Sistema de autenticación** Incorpora un sistema de autenticación mediante tokens.

- **Herramienta para crear datos** Incluye una herramienta para generar datos por defecto de forma sencilla, en base a los modelos.

- **Documentación automática** Genera la documentación de la API de forma automática, para que el cliente pueda consumir el servicio sin problemas, teniendo la certeza de que ésta se encuentra completamente actualizada.

- **Filtrado de datos** La forma en la que se definen las rutas, permite generar consultas con múltiples opciones de filtrado, para que el cliente consuma solamente los datos que necesita.

# Límites
- **Bases de datos relacionales** Soporta bases de datos relacionales postgres y mysql.

- **Sistemas centralizados** Se limita al desarrollo de la parte del backend en sistemas centralizados basados en la arquitectura cliente servidor.

- **Formato JSON** El formato de transferencia de datos por defecto es JSON.

- **Relaciones 1:1 y 1:N** Las relaciones entre tablas soportadas son 1:1 y 1:N.

- **Tipos de datos básicos** Los tipos de datos soportados son: INTEGER, STRING, BOOLEAN, FLOAT, DATE, TIME, DATETIME, ENUM.

# Aportes
- Este framework permite construir aplicaciones de forma sencilla y organizada, acompañado de funciones y herramientas que simplifican enormemente el trabajo del desarrollador backend, logrando convertirse en una alternativa real a los actuales frameworks de desarrollo de APIs.

# Tecnologías utilizadas
- NodeJS v8.4.0: Entorno de programación de javascript

- Express v4.15.4: Framework de NodeJS

- Sequelize v4.7.5: Framework ORM de NodeJS

# Ejemplo
``` javascript
const { Insac } = require('insac')

let app = new Insac()

app.load()

app.listen()
```
