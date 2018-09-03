const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  name: String,
  address:{
    street: String,
    city:String,
    postCode:Number,
  },
  date: Date,
  time: String,
  _owner: {type: Schema.Types.ObjectId , ref:"User"},
  link: String,
  description: String,
  phoneNumber: String,
  nbPeople: Number,
  status: { type: String, enum: ["full", "available"] },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;