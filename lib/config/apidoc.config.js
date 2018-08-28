/** @ignore */ const PROTOCOL = process.env.PROTOCOL
/** @ignore */ const HOSTNAME = process.env.HOSTNAME
/** @ignore */ const PORT     = process.env.PORT

/**
* Configuración por defecto del APIDOC.
* @type {Object}
* @property {Boolean} enabled=true         - Habilita la creación del apidoc.
* @property {String}  title='Apidoc'       - Título de la página del apidoc.
* @property {String}  name='Documentación' - Título principal del apidoc.
* @property {String}  version='1.0.0'      - Versión principal del apidoc.
* @property {String}  url                  - Dirección URL utilizada para completar las rutas del apidoc.
* @property {String}  sampleUrl            - Dirección URL de las peticiones de ejemplo.
* @property {Object}  template             - Configuración del template.
* @property {Object}  header               - Configuración del contenido del encabezado del apidoc.
* @property {String}  header.title         - Título.
* @property {String}  header.filename      - Nombre del archivo.
* @property {Object}  footer               - Configuración del contenido del pié de página del apidoc.
* @property {String}  footer.title         - Título.
* @property {String}  footer.filename      - Nombre del archivo.
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
