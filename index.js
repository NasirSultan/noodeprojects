const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// ✅ Allow only your deployed frontend
app.use(cors({
  origin: 'https://youngdiv-frontend-git-main-nasirs-projects-b92d45eb.vercel.app',
  credentials: true
}));

app.use(express.json());

// 🛠️ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/log', require('./routes/log'));

// ✅ DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Server running on port', process.env.PORT);
    });
  })
  .catch(err => console.log(err));
