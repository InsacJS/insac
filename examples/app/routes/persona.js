

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/personas', {
    controller: (req, res, next) => {
      let options = { include: [ { all:true } ] }
      db.persona.findAll(options).then(personaR => {
        res.success200(personaR)
      }).catch(err => {
        res.error(err)
      })
    }
  })

}
