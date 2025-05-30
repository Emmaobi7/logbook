const express = require('express');
const router = express.Router();
const { createEntry, getMyEntries, exportLogbookPDF, updateLog } = require('../controllers/logbookController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const checkPayment = require('../middlewares/checkPayment');





/**
 * @swagger
 * /api/log:
 *   get:
 *     summary: Get user's logbook entries
 *     tags: [Logbook]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of logbook entries
 *       401:
 *         description: Unauthorized
 */
router.get('/log', auth, checkPayment, getMyEntries);


/**
 * @swagger
 * /api/log:
 *   post:
 *     summary: Create a new logbook entry
 *     tags: [Logbook]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               hours:
 *                 type: number
 *             required:
 *               - activity
 *               - date
 *               - hours
 *     responses:
 *       201:
 *         description: Log entry created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/log', auth, checkPayment, createEntry);


/**
 * @swagger
 * /api/export-pdf:
 *   get:
 *     summary: Export user's logbook as a PDF
 *     tags: [Logbook]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
router.get('/export-pdf', auth, checkPayment, exportLogbookPDF);




/**
 * @swagger
 * /api/log/{id}:
 *   patch:
 *     summary: Update a logbook entry
 *     tags: [Logbook]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Log entry ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               hours:
 *                 type: number
 *     responses:
 *       200:
 *         description: Log entry updated
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/log/:id', auth, checkPayment, updateLog);



module.exports = router;
