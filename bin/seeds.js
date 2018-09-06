require("dotevn").config();
const event = require("../data/event");
const Event= require("../models/Event");
const user= require("../data/user");
const User=require("../models/User")
const mongoose = require("mongoose");


mongoose
  // .connect('mongodb://localhost/berlin')
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

  let newUser = new User({
    username: "Darling",
    profillePicture:"https://images.pexels.com/photos/59523/pexels-photo-59523.jpeg?cs=srgb&dl=animal-dog-pet-59523.jpg&fm=jpg",
    info: "I just moved to Berlin and I do not know so many people and i am looking for some"
  });

  let newEvent = new Event({
    name:"New",
    adress:{
        street:"Karal-Marx 139",
        city:"Berli ",
        postCode:10423,
      },
    date:"2018-09-10",
    time: "20:30",
    link:"http://event-link.com/",
    description: "The most amazing event in Berlin",
    phoneNumber: "+49 098745643",
    nbPeople: 2,
    _owner: newUser
  })

  Event.deleteMany(  )
  .then(x => {
    console.log(x + " were deleted")
    return User.deleteMany()
    .then( () => {
      return newEvent.save()
    })
    .then( event => {
      console.log("New event was created" )
      return newUser.save()
    })
    .then( user => {
      console.log(user +  " was created" )
      mongoose.disconnect()
    })
  })
