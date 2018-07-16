module.exports = (app) => {
  const DATA = [
    {
      id          : 1,
      titulo      : 'El código Da Vinci',
      nro_paginas : 450,
      precio      : 149.99,
      resumen     : 'Obra literaria que trata sobre una historia ...',
      fid_autor   : 1
    },
    {
      id          : 2,
      titulo      : 'El gato negro',
      nro_paginas : 100,
      precio      : 124.99,
      resumen     : 'Obra literaria que trata sobre una historia ...',
      fid_autor   : 2
    },
    {
      id          : 3,
      titulo      : 'El cuervo',
      nro_paginas : 35,
      precio      : 14.99,
      resumen     : 'Obra literaria que trata sobre una historia ...',
      fid_autor   : 2
    }
  ]

  return DATA
}
