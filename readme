Sure! Here's a full **README.md** file documenting all the APIs of your blockchain project with explanations.

---

# Blockchain API with Usernames

A simple blockchain REST API built with Node.js that supports:

* Managing blockchain and mining blocks
* Creating and verifying transactions with digital signatures
* Registering users with public keys and usernames
* Displaying usernames alongside wallet addresses in transactions

---

## Base URL

```
http://localhost:3000
```

---

## API Endpoints

### 1. Register User

Register a user by associating a **public key** with a **username**.

* **URL:** `/user`
* **Method:** `POST`
* **Request Body:**

```json
{
  "publicKey": "<string>",     // Wallet public key (hex string)
  "userName": "<string>"       // Username to associate with the public key
}
```

* **Response:**

```json
{
  "message": "User registered: <userName>",
  "publicKey": "<publicKey>",
  "userName": "<userName>"
}
```

* **Description:**
  Associates a username with a wallet public key in the user registry. Used later to display human-readable names in transactions.

---


* **Description:**
  Returns the in-memory registry of public keys mapped to usernames.

---

### 3. Get Full Blockchain

Fetch the full blockchain including all blocks and transactions.

* **URL:** `/chain`
* **Method:** `GET`
* **Response:**

```json
[
  {
    "index": 0,
    "timestamp": "...",
    "transactions": [
      {
        "from": "<publicKey>",
        "fromUser": "<userName or null>",
        "to": "<publicKey>",
        "toUser": "<userName or null>",
        "amount": 100,
        "message": "...",
        "timestamp": "...",
        "signature": "..."
      },
      ...
    ],
    "previousHash": "...",
    "nonce": 123,
    "hash": "..."
  },
  ...
]
```

* **Description:**
  Returns the entire chain. Each transaction includes optional `fromUser` and `toUser` fields if usernames are registered for those keys.

---


### 5. Add Transaction

Submit a new transaction to be added to the list of pending transactions.

* **URL:** `/transaction`
* **Method:** `POST`
* **Request Body:**

```json
{
  "from": "<publicKey>",          // Sender wallet public key
  "to": "<publicKey>",            // Recipient wallet public key
  "amount": <number>,             // Amount to transfer
  "message": "<string>",          // Optional message
  "signature": "<string or null>" // Digital signature for verification (optional for testing)
}
```

* **Response:**

```json
{
  "message": "Transaction added and pending mining."
}
```

* **Description:**
  Adds a new transaction to the pending pool. The blockchain will validate and include it during mining.

---

### 6. Mine Pending Transactions

Create a new block with all pending transactions and add it to the blockchain.

* **URL:** `/mine`
* **Method:** `POST`
* **Request Body:**

```json
{
  "minerAddress": "<publicKey>"  // Public key of miner who receives mining reward
}
```

* **Response:**

```json
{
  "message": "New block mined successfully",
  "block": {
    "index": 2,
    "timestamp": "...",
    "transactions": [
      {
        "from": "...",
        "fromUser": "...",
        "to": "...",
        "toUser": "...",
        "amount": 100,
        "message": "Mining Reward",
        "timestamp": "...",
        "signature": null
      },
      ...
    ],
    "previousHash": "...",
    "nonce": 187,
    "hash": "..."
  }
}
```

* **Description:**
  Mines a new block with all pending transactions, awards a mining reward to the specified miner address, and appends the block to the chain.

---

### 7. Validate Blockchain

Check if the blockchain is valid and all hashes and transactions are consistent.

* **URL:** `/validate`
* **Method:** `GET`
* **Response:**

```json
{
  "valid": true
}
```

* **Description:**
  Returns `true` if the chain is valid, otherwise `false`.

---

## Getting Started

1. Clone the repo or copy the files.
2. Run `npm install` to install dependencies.
3. Run `node index.js` to start the server.
4. Use Postman or any HTTP client to interact with the APIs.

---

## Notes

* The user registry is in-memory and will reset on server restart.
* You can extend the user registry to save/load users from a file or database.
* Signatures are assumed valid in this simple demo; in a real blockchain, signature verification should be strict.

