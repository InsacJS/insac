/**
* Devuelve un número aleatorio entre A y B.
* @param {Number} [a=1]       - Número A
* @param {Number} [b=1000000] - Número B
* @return {Number}
*/
exports.randomInt = (a = 1, b = 1000000) => {
  return Math.floor((Math.random() * (b + 1)) + a)
}
