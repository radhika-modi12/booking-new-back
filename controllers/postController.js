const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const path = require('path');



// Register Controller
exports.createPost = async (req, res) => {
  const fileObj = req.files.image;
  let file_url
    if (fileObj) {
      const fullUrl =" http://localhost:3000"
      if (typeof fileObj.length === "undefined") {
        const fileNamePhoto = "image_" + fileObj.md5 + path.extname(fileObj.name);
        const newpath = `./public/uploads/` + fileNamePhoto;
        fileObj.mv(newpath, function (err) {
          if (err) {
            console.error(err);
          }
        });
      
        file_url= fullUrl + `/uploads/` + fileNamePhoto
      }
    } 
  const { name ,rating,description} = req.body;
  try {
    
    const query = 'INSERT INTO posts (name,image,description,rating) VALUES (?,?, ?,?)';
    db.query(query, [name, file_url,description,rating], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'post created successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const query = 'SELECT * FROM posts'; // Adjust the query to match your database schema
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPostLikeCount = async (req, res) => {
  try {
    const post_id = req.body.post_id;    
    const user_id = req.body.user_id;
    const query = `SELECT * FROM like_post where post_id=${post_id} AND user_id = ${user_id} `; // Adjust the query to match your database schema
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }      
      res.status(200).json(results.length);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostFollowCount = async (req, res) => {
  try {
    const post_id = req.body.post_id;
    const user_id = req.body.user_id;
    const query = `SELECT * FROM follow_post where post_id=${post_id} AND user_id = ${user_id}`; // Adjust the query to match your database schema
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }      
      res.status(200).json(results.length);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  const { post_id, user_id } = req.body; // postId and userId should be provided in the request

  try {
    // Check if the user already liked the post
    const checkQuery = 'SELECT * FROM like_post WHERE post_id = ? AND user_id = ?';
    db.query(checkQuery, [post_id, user_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        // User already liked, so unlike it
        const deleteQuery = 'DELETE FROM like_post WHERE post_id = ? AND user_id = ?';
        db.query(deleteQuery, [post_id, user_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Decrease like count in posts table
          const updatePostQuery = 'UPDATE posts SET likes = likes - 1 WHERE id = ?';
          db.query(updatePostQuery, [post_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Post unliked successfully' });
          });
        });
      } else {
        // User hasn't liked, so like it
        const insertQuery = 'INSERT INTO like_post (post_id, user_id) VALUES (?, ?)';
        db.query(insertQuery, [post_id, user_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Increase like count in posts table
          const updatePostQuery = 'UPDATE posts SET likes = likes + 1 WHERE id = ?';
          db.query(updatePostQuery, [post_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Post liked successfully' });
          });
        });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleFollow = async (req, res) => {
  const { postId, userId } = req.body; // postId and userId should be provided in the request

  try {
    // Check if the user already follows the post
    const checkQuery = 'SELECT * FROM follow_post WHERE post_id = ? AND user_id = ?';
    db.query(checkQuery, [postId, userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        // User already follows, so unfollow
        const deleteQuery = 'DELETE FROM follow_post WHERE post_id = ? AND user_id = ?';
        db.query(deleteQuery, [postId, userId], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Decrease follower count in posts table
          const updatePostQuery = 'UPDATE posts SET followers = followers - 1 WHERE id = ?';
          db.query(updatePostQuery, [postId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Post unfollowed successfully' });
          });
        });
      } else {
        // User hasn't followed, so follow
        const insertQuery = 'INSERT INTO follow_post (post_id, user_id) VALUES (?, ?)';
        db.query(insertQuery, [postId, userId], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Increase follower count in posts table
          const updatePostQuery = 'UPDATE posts SET followers = followers + 1 WHERE id = ?';
          db.query(updatePostQuery, [postId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Post followed successfully' });
          });
        });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}