const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapboxToken });
const {cloudinary} = require('../cloudinary')
module.exports.index =async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}


module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res) =>{
    const geoData = await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f=>({url:f.path,filename:f.filename}));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success','Campground Created Successfully');
    res.redirect(`/campgrounds/${camp._id}`);
}


module.exports.showCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path:'review',populate:{path:'author'}}).populate('author');
    if(!campground){
        req.flash('error','Fuck Man! No Campground Found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You are not authorized to do this');
        return res.redirect(`/campgrounds/${id}`);
    }
    res.render('campgrounds/edit',{campground});
}


module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true, new:true});
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
        console.log(campground);
    }
    req.flash('success','Campground Updated Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    const deleteCampground = await Campground.findByIdAndDelete(id);
    req.flash('success','Campground Deleted Successfully');
    res.redirect('/campgrounds');
}