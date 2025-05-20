const Match = require('../models/Match');
exports.createMatch = async (req, res) => {
  const match = new Match(req.body);
  await match.save();
  res.send(match);
};
exports.getMatches = async (req, res) => {
  const matches = await Match.find();
  res.send(matches);
};