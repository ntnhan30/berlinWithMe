const express = require('express');
const router = express.Router();
const Event = require("../models/Event")
const User = require("../models/Event")


/* GET home page */
router.get('/', (req, res, next) => {
  Event.find()
    .populate('_owner')
    .then(events => {
      res.render('index', {
        events
      });
    })
});

router.get('/:owner/events/:id', (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      res.render('event/event-details', {
        event
      });
    })
});


module.exports = router;