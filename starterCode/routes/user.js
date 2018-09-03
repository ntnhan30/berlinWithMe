const express = require('express');
const router = express.Router();
const User = require("../models/Event");

router.get('/profile', (req, res, next) => {
    User.find()
    .then(user => {
        res.render("user/profile", {user:user})
        });
      })
  
  



module.exports = router;