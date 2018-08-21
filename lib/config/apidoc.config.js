/** @ignore */ const PROTOCOL = process.env.PROTOCOL
/** @ignore */ const HOSTNAME = process.env.HOSTNAME
/** @ignore */ const PORT     = process.env.PORT

/**
* Configuración del APIDOC.
* @type {Object}
* @param {Boolean} [enabled]   - Habilita la creación del apidoc.
* @param {String}  [title]     - Título de la página del apidoc.
* @param {String}  [name]      - Título principal del apidoc.
* @param {String}  [version]   - Versión principal del apidoc.
* @param {String}  [url]       - Dirección URL utilizada para completar las rutas del apidoc.
* @param {String}  [sampleUrl] - Dirección URL de las peticiones de ejemplo.
* @param {Object}  [template]  - Configuración del template.
* @param {Object}  [header]    - Configuración del contenido del encabezado del apidoc.
* @param {Object}  [footer]    - Configuración del contenido del pié de página del apidoc.
*/
const APIDOC = {
  enabled: true,

  title     : 'Apidoc',
  name      : 'Documentación',
  version   : '1.0.0',
  url       : `${PROTOCOL}://${HOSTNAME}:${PORT}`,
  sampleUrl : `${PROTOCOL}://${HOSTNAME}:${PORT}`,

  template: {
    withGenerator : false,
    withCompare   : true,
    forceLanguage : 'es'
  },

  header: null,

  footer: {
    title    : 'INSTRUCCIONES',
    filename : 'FOOTER.md'
  }
}

module.exports = APIDOC