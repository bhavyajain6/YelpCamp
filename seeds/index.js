const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology:true
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20);
        const camp = new Campground({
            author: '60b897659be6a734e4bf1e6e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos itaque assumenda saepe veritatis, quos minus commodi rerum, facere non perferendis neque, laborum qui hic nostrum nulla at exercitationem fugiat impedit.',
            price,
            geometry:{ 
              type : "Point",
               coordinates : [ cities[random1000].longitude,cities[random1000].latitude ] 
              },
            images:[
                {
                  url: 'https://res.cloudinary.com/djgavd7yq/image/upload/v1622786936/YelpCamp/hrrey7ywhvwgumo2p4oz.jpg',
                  filename: 'YelpCamp/hrrey7ywhvwgumo2p4oz'
                },
                {
                  url: 'https://res.cloudinary.com/djgavd7yq/image/upload/v1622786936/YelpCamp/kmpvf9x0qxdu8w1onx9j.jpg',
                  filename: 'YelpCamp/kmpvf9x0qxdu8w1onx9j'
                }
              ],
        })
        await camp.save(); 
    }
}

seedDB();