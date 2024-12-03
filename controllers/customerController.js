const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const path = require('path');



// Register Controller
exports.createCustomer = async (req, res) => {
  const { customer_name ,customer_email,booking_date,booking_type,booking_slot,booking_time} = req.body;
  try {
    // Check if a Full Day or Half Day booking exists for the same date
    const typeCheckQuery = `
      SELECT * FROM customers 
      WHERE booking_date = ? 
      AND (booking_type = 'full_day' OR booking_type = 'half_day' OR booking_type = 'custom')
    `;
  
    db.query(typeCheckQuery, [booking_date], async (err, results) => {
      if (err) {
        return res.status(500).send('Database query error.');
      }
  
      if (results.length > 0) {
        return res
          .status(400)
          .send('Full Day or Half Day booking already exists; Full Day is not allowed.');
      }
      if (booking_type === 'custom') {
        const customQuery = `
        SELECT * FROM customers 
        WHERE booking_date = ? 
        AND (booking_type = 'full_day' 
         OR (booking_type = 'half_day' AND booking_slot = 'first_half') 
           OR (booking_type = 'custom' AND booking_time BETWEEN '06:00:00' AND '12:00:00'));
      `;
      db.query(customQuery, [booking_date], async (err, results) => {
        if (err) {
          return res.status(500).send('Database query error.');
        }
    
        if (results.length > 0) {
          return res
            .status(400)
            .send('conflict detected.');
        }
        const insertCustomeQuery = `
        INSERT INTO customers 
        (customer_name, customer_email, booking_date, booking_type, booking_slot, booking_time) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertCustomeQuery,
        [customer_name, customer_email, booking_date, booking_type, booking_slot, booking_time],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.status(201).json({ message: 'Customer created successfully.' });
        }
      );
      })
      }
  
      // If booking type is Half Day, check for conflicts in specific slots
    else if (booking_type === 'half_day') {
        const halfDayQuery = `
          SELECT * FROM customers 
          WHERE booking_date = ? 
          AND (booking_type = 'full_day' OR 
              (booking_type = 'half_day' AND booking_slot = ?)
              OR (booking_type = 'custom' AND booking_time BETWEEN '06:00:00' AND '12:00:00'));
        `;
  
        db.query(halfDayQuery, [booking_date, booking_slot], async (err, halfDayResults) => {
          if (err) {
            return res.status(500).send('Database query error.');
          }
  
          if (halfDayResults.length > 0) {
            return res
              .status(400)
              .send(`Half Day booking conflict detected for ${booking_slot} slot.`);
          }
  
          // If no conflicts, insert the Half Day booking
          const insertHalfDayQuery = `
            INSERT INTO customers 
            (customer_name, customer_email, booking_date, booking_type, booking_slot, booking_time) 
            VALUES (?, ?, ?, ?, ?, ?)
          `;
  
          db.query(
            insertHalfDayQuery,
            [customer_name, customer_email, booking_date, booking_type, booking_slot, booking_time],
            (err, results) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              return res.status(201).json({ message: 'Customer created successfully (Half Day).' });
            }
          );
        });
      } else {
        // Insert a Full Day booking if no conflicts exist
        const insertQuery = `
          INSERT INTO customers 
          (customer_name, customer_email, booking_date, booking_type, booking_slot, booking_time) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
  
        db.query(
          insertQuery,
          [customer_name, customer_email, booking_date, booking_type, booking_slot, booking_time],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ message: 'Customer created successfully (Full Day).' });
          }
        );
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
};