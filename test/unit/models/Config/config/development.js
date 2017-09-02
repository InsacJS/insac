'use strict'

module.exports = (config) => {

  config.set('development', {
    server: {
      port: 7890
    },
    one: 'ONE',
    two: {
      prop: 'TWO'
    }
  })

}
