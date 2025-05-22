// controllers/logbookController.js
const LogbookEntry = require('../models/LogbookEntry');

exports.createEntry = async (req, res) => {
  const { description, title } = req.body;
  const userId = req.user.userId;

  if (!userId){
    return res.status(404).json({ message: 'user not found' })
  }

  if (!description || description.trim() === '') {
    return res.status(400).json({ message: 'description is required' });
  }

    // Get start and end of today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Check if an entry already exists for today
    const existing = await LogbookEntry.findOne({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existing) {
      return res.status(409).json({ message: 'You have already submitted a log for today.' });
    }

  try {
    const entry = await LogbookEntry.create({
      user: userId,
      content: description.trim(),
      title: title,
      // date auto-set by schema
      status: 'pending'
    });

    res.status(201).json({
      message: 'Logbook entry created successfully',
      entry
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create logbook entry' });
  }
};



exports.getMyEntries = async (req, res) => {
  const userId = req.user.userId;

  if (!userId){
    return res.status(404).json({ message: 'user not found' })
  }

  try {
    const entries = await LogbookEntry.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve logbook entries' });
  }
};



