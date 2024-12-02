const fs = require('fs');
const path = require('path');

// exports.uploadImage = (req, res) => {
//   const file = req.file;

//   if (!file) return res.status(400).json({ message: 'No file uploaded' });

//   // Define the target path
//   const targetPath = path.join(__dirname, '..', 'uploads', file.originalname);

//   // Move the file to the desired directory
//   fs.rename(file.path, targetPath, (err) => {
//     if (err) {
//       return res.status(500).json({ message: 'File upload failed', error: err });
//     }

//     res.json({
//       message: 'File uploaded and moved successfully',
//       file: {
//         originalName: file.originalname,
//         destination: targetPath,
//       },
//     });
//   });
// };
