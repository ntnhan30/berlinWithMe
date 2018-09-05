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
      events.sort(function(a,b){
        return a.date - b.date;
      })
      .map(event => {
        event.hours = event.date.getHours().toString().padStart(2, "0");
        event.minutes = event.date.getMinutes().toString().padStart(2, "0");
        event.readableDate = event.date.toString().substring(0,21);
        return event;
      });
      console.log("THIS IS  THE TIME",events[0].date.toString().substring(0,21));
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
      }).populate('_user'),
    ])
    .then(([event, attendees]) => {
      let wannaJoin = attendees.map(function (ele) {
        return ele._user._id.toString();
      });
      
      let joiningList = attendees.slice(0, event.nbPeople);
     
      let WaitingList = attendees.slice(event.nbPeople, wannaJoin.length);
    
      let joined = joiningList.map(function (ele) {
        return ele._user._id.toString();
      }).includes(req.user._id.toString());
      
      let waiting = WaitingList.map(function (ele) {
        return ele._user._id.toString();
      }).includes(req.user._id.toString());
     
      let noPeopleGoing = joiningList.length;
  
      res.render('event/event-details', {
        event,
        joiningList,
        WaitingList,
        isOwner: req.user.username === event._owner.username,
        isNotOwner: req.user.username !== event._owner.username,
        isJoined: joined,
        isAvailable: noPeopleGoing < event.nbPeople,
        isWaiting: waiting
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
    location: req.body.location,
    date:new Date(req.body.date + ' ' + req.body.time),
    link: req.body.link,
    description: req.body.description,
    contact: req.body.contact,
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

router.get('/event/:id/joinWaittingList', (req, res, next) => {

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
          res.redirect('/' + event._owner.username + '/events/' + event._id)
        })
    })
    .catch((error) => {
      console.log(error)
    })
});

router.get('/search', (req, res, next) => {
  let event = req.query.event;
  console.log("THIS IS THE EVENT YOU WANT",event);

  Event.find({
    $or: [{
      name: new RegExp(''+event+'',"ig")
    }, {
      description: new RegExp(''+event+'',"ig")
    },
    {
      location: new RegExp(''+event+'',"ig")
    }
  ]
  })
  .populate('_owner')
  .then(events => {
    events.sort(function(a,b){
      return a.date - b.date;
      });
    res.render('index', {
      events
 }) })
 .catch((error) => {
  console.log(error)
})
});

module.exports = router;