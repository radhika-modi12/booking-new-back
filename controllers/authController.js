const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
console.log("jwse",process.env)
// Register Controller
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for port 587
  auth: {
      user:"radhikamodi057@gmail.com",
      pass: "tfuk rurb wpnp zhqm",
  },
  
});
exports.register = async (req, res) => {
  const { first_name, last_name,email,password } = req.body;  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkEmail = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmail, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log(err)
      if (results.length > 0) return res.status(401).json({ message: 'Email Already Register' });
    const query = 'INSERT INTO users (first_name, last_name,email,password) VALUES (?, ?,?,?)';
    db.query(query, [first_name, last_name,email, hashedPassword], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
    });
    const verificationToken = uuidv4();
    const verificationLink = `${process.env.BASE_URL}/verify?token=${verificationToken}`;
   await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
    res.status(200).send('Verification email sent!');
  })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.verifyEmail = (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (results.length === 0) {
      return res.status(400).send('Invalid User Record');
  }
  const updateQuery = `UPDATE users SET is_verify = 1 WHERE email = ?`;
  db.query(updateQuery, [email], async (err, results1) => {
    console.log(err,results1)
  res.status(200).send('Email verified successfully!');
  })
})
}

// Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token,id: user.id});
  });
};
