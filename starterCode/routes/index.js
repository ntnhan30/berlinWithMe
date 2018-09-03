const express = require('express');
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");



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
    nbPeopple: req.body.nbPeopple
  }
  Event.create(newEvent)
  .then( event => {
    console.log("NEW EVENT:", event);
    console.log( "REQ.user -->", req.user )

    let events = req.user._events.slice(0);
    events.push( event._id )
    console.log( "_events ref", events )
    User.findByIdAndUpdate( req.user._id, {_events: events} )
    .then( updatedUser => {
      console.log( "USER -->", updatedUser  )
      res.redirect("/")
    } )
  })
  });

router.get('/:owner/events/:id', (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      res.render('event/event-details', {
        event:event
      });
    })
});



/*Add router */
router.get("/event/add", (req,res,next)=>{
  res.render("event-add")
})



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
