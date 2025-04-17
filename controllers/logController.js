const Log = require('../models/Log');

exports.getProductLog = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user._id })
      .select('-__v')
      .populate('user', 'username')
      .sort({ timestamp: -1 });

    // Calculate the expiration date based on the action and the timestamp
    const logsWithExpiration = logs.map(log => {
      let expirationDate;
      
      // Action-based expiration calculation
      if (log.action === 'add') {
        expirationDate = new Date(log.timestamp.getTime() + 60 * 60 * 24 * 7 * 1000); // 7 days for 'add'
      } else if (log.action === 'delete') {
        expirationDate = new Date(log.timestamp.getTime() + 60 * 60 * 24 * 1 * 1000); // 3 days for 'delete'
      }

      // Include expiration date in the log object
      return {
        ...log.toObject(),
        expirationDate
      };
    });

    res.json(logsWithExpiration);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching product logs' });
  }
};


exports.getAddDeleteLog = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user._id })
      .select('-__v')
      .populate('user', 'username')
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching add/delete logs' });
  }
};



exports.deleteAllLogs = async (req, res) => {
  try {
    // Delete all logs associated with the authenticated user
    const result = await Log.deleteMany({ user: req.user._id });

    if (result.deletedCount > 0) {
      res.json({ message: 'All logs have been successfully deleted.' });
    } else {
      res.status(404).json({ message: 'No logs found for the user.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting logs' });
  }
};
