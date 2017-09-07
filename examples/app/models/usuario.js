

module.exports = (insac, models) => {

  insac.addModel('usuario', {
    fields: {
      username: {allowNull:false},
      password: {}
    }
  })

}
