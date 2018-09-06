const express = require('express');
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary.js');

router.get('/user-profile', (req, res, next) => {
  // User.findById(req.params.id)
  // .populate('_events')
  // .then(user => {
  res.render("user/profile")
  });

router.get('/profile/:id', (req, res, next) => {
    User.findById(req.params.id)
    .populate('_events')
    .then(user => {
        res.render("user/profile", {
          user:user,
          isUser: req.user._id == req.params.id
        })
        });
      })
  

router.get('/profile/:id/edit', (req, res, next) => {
  User.findById(req.params.id)
  .then(user=> {
    res.render("user/edit", {user:user})
   
  })
  .catch((error) => {
    console.log(error)
  })
});

router.post("/profile/:id/delete", (req, res)=>{
  User.findByIdAndRemove(req.params.id)
   .then(user => {
     res.redirect("/");
  })
})


router.post('/profile/:id/edit', uploadCloud.single('photo'),(req, res, next) => {
    const { username, info } = req.body;
    const imgPath = req.file.url;
    const imgName = req.file.originalname;
  User.findByIdAndUpdate(req.params.id, {
    username,info,imgPath ,imgName 
  } )
  .then((user) => {
    res.redirect('/profile/' )
  })
  .catch((error) => {
    console.log(error)
  })
});
module.exports = router;