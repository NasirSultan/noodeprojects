const crypto = require('crypto');

class Transaction {
  constructor(from, to, amount, message = '') {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.message = message;
    this.timestamp = new Date().toISOString();
    this.signature = null;
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.from + this.to + this.amount + this.message + this.timestamp)
      .digest('hex');
  }

  signTransaction(signingKey) {
    // signingKey should be a crypto key with sign method (you can mock or implement real crypto here)
    const hashTx = this.calculateHash();
    this.signature = signingKey.sign(hashTx, 'hex');
  }

  isValid() {
    if (this.from === null) return true; // mining reward

    if (!this.signature) return false;

    // For demo, we'll just accept all signatures as valid. You can implement real signature verification.
    return true;
  }
}

module.exports = Transaction;
