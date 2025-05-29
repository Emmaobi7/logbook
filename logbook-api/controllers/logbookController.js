// controllers/logbookController.js
const LogbookEntry = require('../models/LogbookEntry');
const PDFDocument = require('pdfkit-table');
const User = require("../models/User");



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

    // if (existing) {
    //   return res.status(409).json({ message: 'You have already submitted a log for today.' });
    // }

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





// exports.exportLogbookPDF = async (req, res) => {
//   const userId = req.user.userId;

//   if (!userId) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   try {
//     const entries = await LogbookEntry.find({ user: userId }).sort({ date: -1 });

//     if (!entries.length) {
//       return res.status(404).json({ message: 'No logbook entries found to export' });
//     }

//     // Set response headers for PDF
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=logbook-report.pdf');

//     const doc = new PDFDocument({ margin: 40, size: 'A4' });

//     doc.pipe(res);

//     // Title
//     doc.fontSize(18).text('Logbook Report', { align: 'center' });
//     doc.moveDown();

//     // Add some meta info
//     doc.fontSize(12).text(`User ID: ${userId}`, { align: 'right' });
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
//     doc.moveDown();

//     // Table headers
//     doc.fontSize(12).fillColor('black');
//     doc.text('Date', 50, doc.y, { continued: true, width: 90 });
//     doc.text('Activity', 140, doc.y, { continued: true, width: 150 });
//     doc.text('Competencies', 290, doc.y, { continued: true, width: 150 });
//     doc.text('Status', 440, doc.y, { continued: true, width: 80 });
//     doc.text('Comments', 520, doc.y, { width: 70 });
//     doc.moveDown(0.5);
//     doc.strokeColor('#aaa').moveTo(50, doc.y).lineTo(560, doc.y).stroke();
//     doc.moveDown(0.5);

//     // Entries rows
//     entries.forEach(entry => {
//       doc.fontSize(10);
//       doc.text(new Date(entry.date).toLocaleDateString(), 50, doc.y, { continued: true, width: 90 });
//       doc.text(entry.title || '-', 140, doc.y, { continued: true, width: 150 });
//       doc.text(entry.content || '-', 290, doc.y, { continued: true, width: 150 });
//       doc.text(entry.status || 'Pending', 440, doc.y, { continued: true, width: 80 });
//       doc.text(entry.comments || '-', 520, doc.y, { width: 70 });
//       doc.moveDown();
//     });

//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to export logbook entries as PDF' });
//   }
// };



exports.updateLog = async (req, res) => {
  const { id } = req.params;
  const { description, title } = req.body;
  const userId = req.user.userId;

  // Validations
  if (!userId) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    // Find the existing log
    const existingLog = await LogbookEntry.findOne({
      _id: id,
      user: userId // Ensure user owns this log
    });

    if (!existingLog) {
      return res.status(404).json({ message: 'Log not found or unauthorized' });
    }

    // Prevent updates if log is already approved/rejected
    if (existingLog.status !== 'rejected') {
      return res.status(403).json({ 
        message: 'Cannot modify logs that are approved/pending' 
      });
    }

    // Update only allowed fields
    const updatedLog = await LogbookEntry.findByIdAndUpdate(
      id,
      {
        ...(description && { content: description.trim() }),
        ...(title && { title }), // Only update title if provided
        status: 'pending'
        // ...(status && { status }), // Only update status if provided
      },
      { new: true, runValidators: true } // Return updated doc and validate
    );

    res.status(200).json({
      message: 'Log updated successfully',
      entry: updatedLog
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update log' });
  }
};



require('pdfkit-table'); // Patches PDFDocument

exports.exportLogbookPDF = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = await User.findById(userId).select('-password');

  try {
    const entries = await LogbookEntry.find({ user: userId }).sort({ date: -1 });

    if (!entries.length) {
      return res.status(404).json({ message: 'No logbook entries found to export' });
    }


    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=logbook-report.pdf');
 


    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    // Title
    doc.fontSize(15).text('West African Postgraduate College of Pharmacists', {align: 'center'});
    doc.fontSize(10).text('Collège de Troisième Cycle des Pharmaciens de l\'Afrique de l\'Ouest', {align: 'center'}).moveDown(1);
    doc.fontSize(18).text(`${user.fullName}'s Logbook Report`, { align: 'center' }).moveDown();

    doc.fontSize(12).text(`User: ${user.email}`, { align: 'right' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();


    const table = {
      headers: [
        { label: 'Date', property: 'date', width: 90 },
        { label: 'Activity', property: 'activity', width: 150 },
        { label: 'Competencies', property: 'competencies', width: 150 },
        { label: 'Status', property: 'status', width: 80 },
        { label: 'Comments', property: 'comments', width: 100 }
      ],
      datas: entries.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        activity: entry.title || '-',
        competencies: entry.content || '-',
        status: entry.status || 'Pending',
        comments: entry.comments || '-'
      }))
    };


    await doc.table(table, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
      prepareRow: (row, i) => doc.font('Helvetica').fontSize(10),
    });
    

    doc.end(); // Only after await doc.table()
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export logbook entries as PDF' });
  }
};


