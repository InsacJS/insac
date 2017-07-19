function contains(list, str) {
  for (let i in list) {
    if (list[i] == str) {
      return true;
    }
  }
  return false;
}
module.exports.contains = contains;
