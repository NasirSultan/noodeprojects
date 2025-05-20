const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { Blockchain, Transaction } = require('./blockchain');

const app = express();
const PORT = 3000;
const DATA_FILE = './chain.json';
const cors = require('cors');

// Allow only http://localhost:3001 to access your backend
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware
app.use(bodyParser.json());

// In-memory user registry: { publicKey: userName }
const userRegistry = {};

// Load blockchain from file or initialize new one
let blockchain = null;

function loadBlockchain() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      if (data) {
        const parsed = JSON.parse(data);
        blockchain = new Blockchain(parsed);
        console.log('Blockchain loaded from file.');
      } else {
        blockchain = new Blockchain();
        console.log('Blockchain file empty, new blockchain created.');
      }
    } else {
      blockchain = new Blockchain();
      console.log('Blockchain file not found, new blockchain created.');
    }
  } catch (err) {
    console.error('Failed to load blockchain:', err);
    blockchain = new Blockchain();
  }
}

function saveBlockchain() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(blockchain.chain, null, 2));
    console.log('Blockchain saved.');
  } catch (err) {
    console.error('Failed to save blockchain:', err);
  }
}

loadBlockchain();

// Helper: attach usernames to transactions if user exists
function attachUsernamesToTx(tx) {
  return {
    ...tx,
    fromUser: tx.from ? userRegistry[tx.from] || null : null,
    toUser: tx.to ? userRegistry[tx.to] || null : null,
  };
}

// Helper: return chain with usernames in transactions
function getChainWithUsernames() {
  return blockchain.chain.map(block => ({
    ...block,
    transactions: block.transactions.map(tx => attachUsernamesToTx(tx)),
  }));
}

// Routes

// Register user
// POST /user with { publicKey, userName }
app.post('/user', (req, res) => {
  const { publicKey, userName } = req.body;
  if (!publicKey || !userName) {
    return res.status(400).json({ error: 'publicKey and userName are required' });
  }
  userRegistry[publicKey] = userName;
  res.json({ message: `User registered: ${userName}`, publicKey, userName });
});

// Get all registered users
app.get('/users', (req, res) => {
  res.json(userRegistry);
});

// Get full blockchain with usernames
app.get('/chain', (req, res) => {
  res.json(getChainWithUsernames());
});

// Get pending transactions with usernames
app.get('/pending', (req, res) => {
  const pendingWithUsers = blockchain.pendingTransactions.map(tx => attachUsernamesToTx(tx));
  res.json(pendingWithUsers);
});

// Add transaction
app.post('/transaction', (req, res) => {
  const { from, to, amount, message, signature } = req.body;
  try {
    const tx = new Transaction(from, to, amount, message, new Date().toISOString(), signature);
    blockchain.addTransaction(tx);
    saveBlockchain();
    res.json({ message: 'Transaction added and pending mining.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mine pending transactions
app.post('/mine', (req, res) => {
  const { minerAddress } = req.body;
  if (!minerAddress) {
    return res.status(400).json({ error: 'minerAddress is required to receive mining reward.' });
  }

  const newBlock = blockchain.minePendingTransactions(minerAddress);
  saveBlockchain();

  res.json({
    message: 'New block mined successfully',
    block: {
      ...newBlock,
      transactions: newBlock.transactions.map(tx => attachUsernamesToTx(tx))
    },
  });
});

// Check chain validity
app.get('/validate', (req, res) => {
  const valid = blockchain.isChainValid();
  res.json({ valid });
});

app.listen(PORT, () => {
  console.log(`🚀 Blockchain API with users running at: http://localhost:${PORT}`);
});
