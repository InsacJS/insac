'use strict'

function getOptionsQUERY(opt, req) {
  return {}
}

function getOptionsID(opt, req) {
  return {where:{id:opt.input.params.id}}
}

function getMetadata(result, options) {
  return {count: 100}
}

function getData(opt, result) {
  return result
}

function createData(opt, result) {
  return result
}

let utils = {
  getOptionsQUERY,
  getOptionsID,
  getMetadata,
  getData,
  createData
}

module.exports = utils
