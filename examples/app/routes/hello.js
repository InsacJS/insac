

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/hello', {
    controller: (req, res, next) => {
      let data = {
        msg: 'Bienvenido al mundo real'
      }
      res.success200(data)
    }
  })

}
