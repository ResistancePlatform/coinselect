var accumulative = require('./accumulative')
var blackjack = require('./blackjack')
var utils = require('./utils')

// order by descending value, minus the inputs approximate fee
function utxoScore (x, fee) {
  return x.value - fee //* utils.inputBytes(x))
}


module.exports = function coinSelect (utxos, outputs, fee) {
  utxos = utxos.concat().sort(function (a, b) {
    return utxoScore(b, fee) - utxoScore(a, fee)
  })

  // attempt to use the blackjack strategy first (no change output)
  var base = blackjack(utxos, outputs, fee)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, fee)
}
