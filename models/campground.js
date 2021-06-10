const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    
})

const CampgroundSchema = new Schema({
    title: String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    images:[
        {
            url:String,
            filename:String
        }
    ],
    description:String,
    location:String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.review
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);