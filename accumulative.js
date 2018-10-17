var utils = require('./utils')

// add inputs until we reach or surpass the target value (or deplete)
// worst-case: O(n)
module.exports = function accumulative (utxos, outputs, fee) {
  //if (!isFinite(utils.uintOrNaN(fee))) return {}
  //var bytesAccum = utils.transactionBytes([], outputs)

  var inAccum = 0
  var inputs = []
  var outAccum = utils.sumForgiving(outputs)

  for (var i = 0; i < utxos.length; ++i) {
    var utxo = utxos[i]
    //var utxoBytes = utils.inputBytes(utxo)
    var utxoFee = fee //feeRate * utxoBytes
    var utxoValue = utxo.value

    // skip detrimental input
    if (utxoFee > utxo.value) {
      if (i === utxos.length - 1) return { fee: fee }//* (bytesAccum + utxoBytes) }
      continue
    }

    //bytesAccum += utxoBytes
    inAccum += utxoValue
    inputs.push(utxo)

    var fee = fee //Rate * bytesAccum

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, fee)
  }

  return { fee: fee } //Rate * bytesAccum }
}
