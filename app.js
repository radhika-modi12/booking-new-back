const express = require('express');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const postRoutes = require('./routes/postRoutes');
const dotenv = require('dotenv');
const db = require('./db');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const cors = require("cors");


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors())
// Use routes

app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - form-data/multipart
app.use(express.static('./public'));
app.use(fileUpload());
app.use('/auth', authRoutes);
// app.use('/file', uploadRoutes);
// app.use('/post', postRoutes);
app.use("/customer",customerRoutes)

// Serve static files (like images) from the uploads folder
// app.use('/uploads', express.static('uploads'));
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
