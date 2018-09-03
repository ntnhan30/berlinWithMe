const express = require('express');
<<<<<<< HEAD
const router  = express.Router();
const Event = require("../models/Event")
=======
const router = express.Router();
const Event = require("../models/Event")
const User = require("../models/Event")


>>>>>>> 5d5648965db9d304594c377e5477200bcff38f3f
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

/* GET event details */
router.get('/:owner/events/:id', (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      res.render('event/event-details', {
        event
      });
    })
});

<<<<<<< HEAD
/*Add router */
router.get("/event/add", (req,res,next)=>{
  res.render("event-add")
})

/*Ana -created the adding rout */
router.post("/event/add", (req,res,next)=>{
let newEvent={
  name:req.body.name,
  _owner:req.user._id,
  address:{
    street:req.body.street,
    city:req.body.city,
    postCode: req.body.postCode,
  },
  date: req.body.date,
  time:req.body.time,
  description: req.body.description,
  phoneNumber: req.body.phoneNumber,
  nbPeopple: req.body.nbPeopple,
  status:req.body.status
}
Event.create(newEvent)
.then(event=>{
  res.redirect("/")
})
});

/* Ana- created the edit route */
router.get('/event/edit', (req, res, next) => {
  Event.findById(req.params.id)
  .then(event=> {
    res.render("event-edit", {event:event})
   
  })
  .catch((error) => {
    console.log(error)
  })
});

router.post('/event/:id/edit', (req, res, next) => {
  Event.findByIdAndUpdate(req.params.id, {
      name:req.body.name,
      address:{
        street:req.body.street,
        city:req.body.city,
        postCode: req.body.postCode,
      },
      date: req.body.date,
      time:req.body.time,
      description: req.body.description,
      phoneNumber: req.body.phoneNumber,
      nbPeopple: req.body.nbPeopple,
      status:req.body.status
    }
   )
  .then((event) => {
    res.redirect('/event/' + req.params.id)
  })
  .catch((error) => {
    console.log(error)
  })
});



module.exports = router;
=======

module.exports = router;
>>>>>>> 5d5648965db9d304594c377e5477200bcff38f3f
