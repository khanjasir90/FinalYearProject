const Web3 = require('web3')
class Provider {
  constructor() {
    //setup web3 provider
    this.web3 = new Web3(
      new Web3.providers.HttpProvider('http://localhost:7545'),
    )
  }
}
module.exports = Provider   