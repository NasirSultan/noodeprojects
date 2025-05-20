const mongoose = require('mongoose');
const matchSchema = new mongoose.Schema({
  teamA: String,
  teamB: String,
  tossWinner: String,
  battingFirst: String,
  overs: [
    {
      overNumber: Number,
      balls: [
        {
          run: Number,
          isWicket: Boolean,
          extra: String
        }
      ]
    }
  ],
  result: String
});
module.exports = mongoose.model('Match', matchSchema);