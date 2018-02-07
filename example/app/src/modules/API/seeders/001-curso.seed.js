module.exports = (seed) => {
  const DATOS = [
    { nombre: 'Ingeniería de software', categoria: 'Programación' },
    { nombre: 'Algoritmos y Programación', categoria: 'Programación' },
    { nombre: 'Big Data', categoria: 'Ciencia y tecnología' },
    { nombre: 'Inteligencia Artificial', categoria: 'Ciencia y Tecnología' },
    { nombre: 'Desarrollo personal', categoria: 'Superación' }
  ]

  return seed.create('curso', DATOS)
}
