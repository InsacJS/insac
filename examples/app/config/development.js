module.exports = (config) => {

  config.set('development', {
    database: {
      name: 'insac_app_01',
      username: 'postgres',
      password: '12345678'
    },
    server: {
      all200:true
    }
  })

}
