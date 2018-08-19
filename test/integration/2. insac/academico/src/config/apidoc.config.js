const APIDOC = {
  title    : 'Apidoc',
  name     : 'Documentación Personalizada',
  version  : '1.0.0',
  template : {
    withGenerator : false,
    withCompare   : true,
    forceLanguage : 'es'
  },
  header : { title: 'INTRODUCCIÓN',  filename: 'HEADER.md' },
  footer : { title: 'INSTRUCCIONES', filename: 'FOOTER.md' }
}

module.exports = APIDOC
