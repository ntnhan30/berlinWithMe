const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  name: String,
  location:{
    type: String, enum: ["Neukölln‎", "Friedrichshain", "Kreuzberg‎", "Mitte", "Charlottenburg", "other"], default: "other" 
  },
  date: Date,
  // time: String,
  _owner: {type: Schema.Types.ObjectId , ref:"User"},
  link: String,
  description: String,
  contact: String,
  nbPeople: { type: Number, required: true },
  status: { type: String, enum: ["full", "available"], default: "available" },
 }, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;