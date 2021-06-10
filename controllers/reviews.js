const Review = require ('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review =  new Review(req.body.review);
    review.author = req.user._id;
    campground.review.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Review Added Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    const campground = await Campground.findOneAndUpdate(id,{$pull:{review:reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review removed Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}