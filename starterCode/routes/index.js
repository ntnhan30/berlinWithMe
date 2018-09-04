const express = require('express');
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const WantToGo = require("../models/WantToGo");
const {
  ensureLoggedIn
} = require('connect-ensure-login');

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

/* GET event details ****/
router.get('/:owner/events/:id', ensureLoggedIn('/auth/login'), (req, res, next) => {
  Promise.all([
      Event.findById(req.params.id).populate('_owner'),
      WantToGo.find({
        _event: req.params.id
      }).populate('_user')
    ])
    .then(([event, attendees]) => {
      console.log("PHONE:", event.phoneNumber);
      let joined = attendees.map(function (ele) {
        return ele._user._id.toString();
      }).includes(req.user._id.toString());

      let noPeopleGoing = attendees.map(function (ele) {
        return ele._user._id;
      }).length
      res.render('event/event-details', {
        event,
        attendees,
        isOwner: req.user.username === event._owner.username,
        isNotOwner: req.user.username !== event._owner.username,
        isJoined: joined,
        isAvailable: noPeopleGoing < event.nbPeople
      });
    });
});

/*Add router */
router.get("/event/add", ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render("event/event-add")
})

/*Ana -created the adding rout */
router.post("/event/adding", (req, res) => {
  let newEvent = {
    name: req.body.name,
    _owner: req.user._id,
    address: {
      street: req.body.street,
      city: req.body.city,
      postCode: req.body.postCode,
    },
    date: req.body.date,
    time: req.body.time,
    description: req.body.description,
    phoneNumber: req.body.phoneNumber,
    nbPeople: req.body.nbPeople,
  }
  Event.create(newEvent)
    .then(event => {
      let events = req.user._events.slice(0);
      events.push(event._id)
      User.findByIdAndUpdate(req.user._id, {
          _events: events
        })
        .then(updatedUser => {
          res.redirect('/event/' + event._id + '/join')
        })
    })
    .catch(err => {
      throw err
    })
});

/* Ana- created the edit route */
router.get('/:owner/events/:id/edit', (req, res, next) => {
  Event.findById(req.params.id)
    .populate('_owner')
    .then(event => {
      res.render("event/event-edit", {
        event: event
      })
    })
    .catch((error) => {
      console.log(error)
    })
});

router.post('/:owner/events/:id/update', (req, res, next) => {
  Event.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      address: {
        street: req.body.street,
        city: req.body.city,
        postCode: req.body.postCode,
      },
      date: req.body.date,
      time: req.body.time,
      description: req.body.description,
      phoneNumber: req.body.phoneNumber,
      nbPeople: req.body.nbPeople,
      status: req.body.status
    })
    .populate('_owner')
    .then((event) => {
      res.redirect('/')
    })
    .catch((error) => {
      console.log(error)
    })
});

router.get('/event/:id/delete', (req, res, next) => {
  Event.findByIdAndRemove(req.params.id)
    .then((event) => {
      res.redirect('/')
    })
    .catch((error) => {
      console.log(error)
    })
});

router.get('/event/:id/join', (req, res, next) => {

  let newWantToGo = {
    _event: req.params.id,
    _user: req.user._id,
  }
  WantToGo.create(newWantToGo)
    .then((event) => {
      Event.findById(req.params.id)
        .populate('_owner')
        .then(event => {
          res.redirect('/' + event._owner.username + '/events/' + event._id)
        })
    })
    .catch((error) => {
      console.log(error)
    })

});

router.get('/event/:id/leave', (req, res, next) => {
  WantToGo.deleteOne({
      $and: [{
        _event: req.params.id
      }, {
        _user: req.user._id
      }]
    })
    .then((connection) => {
      Event.findById(req.params.id)
        .populate('_owner')
        .then(event => {
          console.log(event._owner.username)
          console.log(event._id)
          res.redirect('/' + event._owner.username + '/events/' + event._id)
        })

    })
    .catch((error) => {
      console.log(error)
    })

});


module.exports = router;