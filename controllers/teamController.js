const Team = require('../models/Team');
exports.addTeam = async (req, res) => {
  const { name } = req.body;
  const team = new Team({ name, players: [] });
  await team.save();
  res.send(team);
};
exports.getTeams = async (req, res) => {
  const teams = await Team.find();
  res.send(teams);
};