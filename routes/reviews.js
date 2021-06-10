const express = require('express');
const router = express.Router({mergeParams :true});
const catchAsync = require('../utils/catchAsync');

const review = require('../controllers/reviews');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');




router.post('/reviews',isLoggedIn,validateReview,catchAsync(review.createReview));

router.delete('/review/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview));


module.exports = router;