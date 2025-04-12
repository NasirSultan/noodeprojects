
# Understanding Middleware in Express.js

### By Nasir Sultan

Middleware is the heart of Express.js — the flexible layer that processes HTTP requests before they reach your route handlers. In this guide, we’ll break down middleware in simple terms and walk through how to implement **authorization**, **validation**, and **error handling**, all with a clean folder structure and working code examples.

---

## What is Middleware?

**Middleware** is a function in Express that has access to the `request`, `response`, and `next` middleware in the cycle. It runs before your final route handler and can:

- Modify the request or response
- Stop the request
- Pass control to the next middleware or route handler

```js
function middleware(req, res, next) {
  // logic here
  next(); // pass to next middleware or route
}
```

---

## Authorization Middleware

**Authorization** means checking if a user has permission to perform a specific action (e.g., only admins can create roles).

---

## Validation Middleware

**Validation** ensures the input data from a client is complete and correctly formatted, helping to prevent errors and security issues.

---

## Error Handling Middleware

This special middleware handles errors and includes **four** parameters: `(err, req, res, next)`. It catches and responds to runtime issues in your app.

---

## Project Structure

```
/middleware
  isAdmin.js
/models
  Item.js
server.js
.env
package.json
```

---

## Setup Code Example

### 1. `.env` (your MongoDB connection string)

```
MONGO_URI=mongodb://localhost:27017/roleDB
PORT=5000
```

---

### 2. `models/Item.js`

```js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
});

module.exports = mongoose.model("Role", itemSchema);
```

---

### 3. `middleware/isAdmin.js`

```js
const isAdmin = (req, res, next) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: "Name and role are required" });
    }

    if (role === "admin") {
      next(); // pass to next route
    } else {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = isAdmin;
```

---

### 4. `server.js` (POST API using middleware and Promise)

```js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Item = require("./models/Item");
const isAdmin = require("./middleware/isAdmin");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("DB Connection Failed", err));

// POST route using middleware and Promises
app.post("/role", isAdmin, (req, res) => {
  const { name, role } = req.body;

  const newItem = new Item({ name, role });

  newItem
    .save()
    .then(savedItem => res.status(201).json(savedItem))
    .catch(err => res.status(500).json({ error: "Server error" }));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## Example POST (via Postman)

**POST** `http://localhost:5000/role`

```json
{
  "name": "Nasir Sultan",
  "role": "admin"
}
```

- If role is `"admin"` → Request is allowed  
- If role is `"user"` → Response: 403 Forbidden

---

## Required Commands

Initialize your project and install dependencies:

```bash
npm init -y
npm install express mongoose dotenv cors
```

Start the server:

```bash
node server.js
```

---

## Summary

| Concept        | Purpose                                      |
|----------------|----------------------------------------------|
| Middleware     | Intercepts and processes HTTP requests       |
| Authorization  | Allows access based on user roles            |
| Validation     | Ensures data completeness and correctness    |
| Error Handling | Catches and responds to errors in the app    |

---

Feel free to extend this example with authentication (JWT), advanced validation using libraries like Joi or Zod, and centralized error logging.

Let me know if you want a version that uses TypeScript or adds tests!