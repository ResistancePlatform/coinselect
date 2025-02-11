var utils = require('./utils')

// only add inputs if they don't bust the target value (aka, exact match)
// worst-case: O(n)
module.exports = function blackjack (utxos, outputs, fee) {
  //if (!isFinite(utils.uintOrNaN(fee))) return {}

  var bytesAccum = utils.transactionBytes([], outputs)

  var inAccum = 0
  var inputs = []
  var outAccum = utils.sumForgiving(outputs)
  //var threshold = utils.dustThreshold({}, feeRate)

  for (var i = 0; i < utxos.length; ++i) {
    var input = utxos[i]
    //var inputBytes = utils.inputBytes(input)
    //var fee = feeRate * (bytesAccum + inputBytes)
    var inputValue = input.value //utils.uintOrNaN(input.value)

    // would it waste value?
    if ((inAccum + inputValue) > (outAccum + fee)) continue // + threshold)) continue

    //bytesAccum += inputBytes
    inAccum += inputValue
    inputs.push(input)

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, fee)
  }

  return { fee: fee } //Rate * bytesAccum }
}
