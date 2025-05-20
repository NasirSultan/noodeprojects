const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  players: [
    {
      name: String,
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 }
    }
  ],
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 }
});
module.exports = mongoose.model('Team', teamSchema);