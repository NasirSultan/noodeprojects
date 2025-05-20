const crypto = require('crypto');

class Transaction {
  constructor(from, to, amount, message, timestamp, signature) {
    this.from = from; // sender public key (string)
    this.to = to;     // receiver public key (string)
    this.amount = amount;
    this.message = message || '';
    this.timestamp = timestamp || new Date().toISOString();
    this.signature = signature || null;
  }
}

class Block {
  constructor(index, timestamp, transactions, previousHash = '', nonce = 0) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions; // array of Transaction objects
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const data = this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  mineBlock(difficulty) {
    const target = '0'.repeat(difficulty);
    while (!this.hash.startsWith(target)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor(chainData) {
    if (chainData && chainData.length > 0) {
      // Rehydrate blocks & transactions from plain objects
      this.chain = chainData.map(b => {
        const block = new Block(b.index, b.timestamp, [], b.previousHash, b.nonce);
        block.hash = b.hash;
        block.transactions = b.transactions.map(tx => Object.assign(new Transaction(), tx));
        return block;
      });
    } else {
      this.chain = [this.createGenesisBlock()];
    }
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    if (!transaction.from || !transaction.to) {
      throw new Error('Transaction must include from and to addresses');
    }
    // You can add signature verification here if needed
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(minerAddress) {
    const rewardTx = new Transaction(null, minerAddress, this.miningReward, "Mining Reward");
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      this.chain.length,
      new Date().toISOString(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);

    this.chain.push(block);

    this.pendingTransactions = [];
    return block;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];
      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== prev.hash) return false;
    }
    return true;
  }
}

module.exports = { Blockchain, Block, Transaction };
