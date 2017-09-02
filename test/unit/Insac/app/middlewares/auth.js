'use strict'

module.exports = (insac, models, db) => {

  insac.addMiddleware('auth', (req, res, next) => {
    req.user = 'JHON SMITH'
    next()
  })

}
