const express = require('express');
const { createPost, getPost, toggleLike, toggleFollow, getPostLikeCount, getPostFollowCount } = require('../controllers/postController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/createPost', createPost);
router.post('/getPost', getPost);
router.post('/togglePost', toggleLike);
router.post('/toggleFollow', toggleFollow);
router.post('/like-count', getPostLikeCount);
router.post('/follow-count', getPostFollowCount);

module.exports = router;
