const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const linkSchema = new Schema({
 _event:{type:Schema.Types.ObjectId , ref:"Event"},
 _user:{type:Schema.Types.ObjectId, ref:"User"}

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;