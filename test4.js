
const async = require('async')

let p1 = (callback => {
  setTimeout(() => {
    console.log("P1")
    callback(null)
  }, 100)
})

let p2 = (callback => {
  setTimeout(() => {
    console.log("P2")
    callback(null)
  }, 300)
})

let p3 = (callback => {
  setTimeout(() => {
    console.log("P3")
    callback(null)
  }, 200)
})

async.waterfall([p1, p2, p3], (err, result) => {
  console.log("FINISH")
})
