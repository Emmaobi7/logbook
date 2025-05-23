// controllers/logbookController.js
const LogbookEntry = require('../models/LogbookEntry');
const PDFDocument = require('pdfkit');

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





exports.exportLogbookPDF = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const entries = await LogbookEntry.find({ user: userId }).sort({ date: -1 });

    if (!entries.length) {
      return res.status(404).json({ message: 'No logbook entries found to export' });
    }

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=logbook-report.pdf');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Logbook Report', { align: 'center' });
    doc.moveDown();

    // Add some meta info
    doc.fontSize(12).text(`User ID: ${userId}`, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Table headers
    doc.fontSize(12).fillColor('black');
    doc.text('Date', 50, doc.y, { continued: true, width: 90 });
    doc.text('Activity', 140, doc.y, { continued: true, width: 150 });
    doc.text('Competencies', 290, doc.y, { continued: true, width: 150 });
    doc.text('Status', 440, doc.y, { continued: true, width: 80 });
    doc.text('Comments', 520, doc.y, { width: 70 });
    doc.moveDown(0.5);
    doc.strokeColor('#aaa').moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown(0.5);

    // Entries rows
    entries.forEach(entry => {
      doc.fontSize(10);
      doc.text(new Date(entry.date).toLocaleDateString(), 50, doc.y, { continued: true, width: 90 });
      doc.text(entry.title || '-', 140, doc.y, { continued: true, width: 150 });
      doc.text(entry.content || '-', 290, doc.y, { continued: true, width: 150 });
      doc.text(entry.status || 'Pending', 440, doc.y, { continued: true, width: 80 });
      doc.text(entry.comments || '-', 520, doc.y, { width: 70 });
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export logbook entries as PDF' });
  }
};



