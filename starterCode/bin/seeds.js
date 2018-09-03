const event = require("../data/event");
const Event= require("../models/Event");
const user= require("../data/user");
const User=require("../models/User")
const mongoose = require("mongoose");

mongoose
  .connect('mongodb://localhost/berlin')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

  // Event.deleteMany(  )
  // .then(x=>{console.log(x + " were deleted")
  // })
  Event.create(event)
  .then(events=>{
      console.log(events.length +  "were created" )
  })

  // User.deleteMany(  )
  // .then(x=>{console.log(x + " were deleted")
  // })
  User.create(user)
  .then(users=>{
      console.log(users.length +  "were created" )
  })

  setTimeout(()=>{
    mongoose.disconnect()
  },2000)