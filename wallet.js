const EC = require('elliptic').ec;
const fs = require('fs');
const path = require('path');

const ec = new EC('secp256k1');

// Generate key pair
const key = ec.genKeyPair();

// Create wallet object
const wallet = {
  publicKey: key.getPublic('hex'),
  privateKey: key.getPrivate('hex'),
};

// Ensure the 'keys' directory exists
const keysDir = path.join(__dirname, 'keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

// Save wallet to file
const fileName = `${wallet.publicKey}.json`;
const filePath = path.join(keysDir, fileName);
fs.writeFileSync(filePath, JSON.stringify(wallet, null, 2));

console.log(`✅ Wallet created:`);
console.log(`📁 Saved to: keys/${fileName}`);
console.log(`🔑 Public Key: ${wallet.publicKey}`);
