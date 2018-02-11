# Insac

Framework de creación de servicios web basado en lenguaje script,
utilizando arquitectura REST.

# Caracteristicas (Alcances)

- **Estructura de proyecto:** Estructura de proyecto sólida, escalable y
mantenible a largo plazo.

- **Formato de respuesta:** Formato de respuesta único para todas las tareas
que hayan finalizado correctamente o con algún tipo de error.

- **Validador automático** Se validan todos los datos de entrada,
antes de realizar cualquier otra acción propia de la ruta.

- **Herramienta para crear datos** Incluye una herramienta para generar
datos por defecto de forma sencilla, en base a los modelos.

- **Documentación automática** La documentación se genera de tal forma que el
desarrollador frontend puede consumir el servicio teniendo la certeza
de que ésta se encuentra completamente actualizada.

- **Filtrado de datos** - En cada petición se puede indicar los campos
que se requiere en el resultado.

# Límites

- **Bases de datos relacionales** Optimizado para el gestor de Base de datos
PostgreSQL.

- **Sistemas centralizados** Soporta sistemas centralizados basados en la
arquitectura cliente servidor.

- **Formato JSON** El formato de transferencia de datos por defecto es JSON.

- **Relaciones 1:1 y 1:N** Las relaciones entre tablas soportadas son 1:1 y 1:N.

- **Tipos de datos** Soporta los tipos de datos básicos: STRING, INTEGER,
FLOAT, BOOLEAN, DATE, TIME, DATETIME. Adicionalmente se incluyen algunos
tipos de datos avanzados: ENUM, ARRAY, JSON y JSONB.

# Aportes

- El framework permite construir aplicaciones de forma sencilla y organizada,
acompañado de funciones y herramientas que simplifican enormemente el trabajo
del desarrollador backend, logrando convertirse en una alternativa real a los
actuales frameworks de desarrollo de APIs.

- Está diseñado de tal forma que es posible reutilizar sus módulos, en
proyectos que trabajan con express y Sequelize.

# Tecnologías utilizadas

- NodeJS v9.5: Entorno de programación de javascript

- Express v4.16: Framework de NodeJS

- Sequelize v4.32: Framework ORM de NodeJS

# Ejemplo

``` js
const { Insac } = require('insac')

const app = new Insac()

app.addModule('API')

app.init()
```
