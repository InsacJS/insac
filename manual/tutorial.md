# Ejemplo práctico

Archivo `app.js`
```javascript
const { Insac } = require('insac')

let app = new Insac()

// Definición de modelos.
app.addModel('usuario')
app.addModel('persona')

// Mídleware Global (Para todas las rutas que comiencen con '/api').
app.addMiddleware('/api', (req, res, next) => {
  req.info = `Middleware global`
  next()
})

// Middleware Local (Para una ruta en específico).
app.addMiddleware('auth', (req, res, next) => {
  req.user = 'JHON SMITH'
  next()
})

// Adiciona un middleware a una ruta.
app.addMiddleware('/api/admin', 'auth')

// Rutas por defecto del modelo persona, incluye a los modelos con los que esté relacionado.
insac.addRoute('persona')

// Ruta personalizada.
insac.addRoute('GET', '/api/admin/custom', {
  controller: (req, res, next) => {
    let data = {
      msg: `Bienvenido ${req.user}`,
      info: req.info
    }
    res.success200(data)
  }
})

// Crea las tablas de los modelos
app.migrate().then(result => {
  // Inicia la aplicación
  app.listen()
})

module.exports = app
```
