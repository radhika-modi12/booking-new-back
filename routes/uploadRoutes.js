const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const authenticateToken = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');


const router = express.Router();

// Use multer to store the file temporarily in a /tmp folder before moving
// const upload = multer({ dest: 'tmp/' });

// router.post('/upload', authenticateToken, upload.single('image'), uploadImage);

// const uploadDir = path.join(__dirname, 'uploads');

// // Check if the directory exists, create if not
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

module.exports = router;
