const express = require('express');
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary.js');

router.get('/profile/edit', (req, res, next) => {
  User.findById(req.user._id)
  .then(user=> {
    res.render("user/edit", {user:user})
   
  })
  .catch((error) => {
    console.log(error)
  })
});



router.get('/profile/:id', (req, res, next) => {
  User.findById(req.params.id)
    .populate('_events')
    .then(user => {
      res.render("user/profile", {
        user: user,
        isUser: req.user._id == req.params.id
      })
    });
})

router.get('/profile', (req, res, next) => {
  User.findById(req.user._id)
    .populate('_events')
    .then(user => {
      res.render("user/profile", {
        user: user,
        isUser: req.user._id == req.params.id
      })
    });
})

      
  




router.post('/profile/edit', uploadCloud.single('photo'),(req, res, next) => {
    const { username, info } = req.body;
    const imgPath = req.file.url;
    const imgName = req.file.originalname;
  User.findByIdAndUpdate(req.user._id, {
    username,info,imgPath ,imgName 
  } )
  .then((user) => {
    res.redirect('/profile' )
    // res.redirect('/profile/'+user._id )
  })
  .catch((error) => {
    console.log(error)
  })
});
module.exports = router;