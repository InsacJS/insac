# blog

Aplicación back-end creado con el framework Insac JS.

## 1. Características

Expone servicios que pueden ser consumidos por una apliación front-end.

## 2. Requerimientos

| Herramienta  | Versión        | Descripción                            |
| ------------ | -------------- | -------------------------------------- |
| `NodeJS`     | 8.0 o superior | Entorno de programación de JavaScript. |
| `PostgreSQL` | 9.4            | Gestor de base de datos.               |

## 3. Instalación

El siguiente proceso de instalación es válido para distribuciones de linux basadas en Ubuntu o Debian.

### 3.1. Clonación del proyecto e instalación de dependencias

```bash
# Clonación del proyecto
git clone git@github.com:my-user/my-project.git
cd my-project

# Instalación de dependencias
yarn install
```

### 3.2. Archivos de configuración

Crear los archivos de configuración `*.config.js` en base a los archivos `*.config.js.example` y modificar los valores que sean necesarios.

```bash
# SERVER
$ cp ./src/config/server.config.js.example ./src/config/server.config.js

# DATABASE
$ cp ./src/config/database.config.js.example ./src/config/database.config.js
```

### 3.3 Creación de la Base de Datos

La base de datos se crea automáticamente si no existe.

```bash
# Entorno de desarrollo
yarn setup

# Entorno de producción
yarn setup-production
```

## 4. Despliegue de la aplicación

```bash
# Entorno de desarrollo
yarn start

# Entorno de producción
yarn start-production
```

## 5. Pruebas unitarias y de integración

```bash
# Todas las pruebas
yarn test

# Pruebas unitarias
yarn test-unit

# Pruebas de integración
yarn test-integration
```

## 6. Referencias

- [Insac JS](http://insacjs.com): Framework de creación de servicios web
- [Express JS](http://expressjs.com): Infraestructura de aplicaciones web Node.js
- [Sequelize](http://docs.sequelizejs.com): Framework ORM de NodeJS
