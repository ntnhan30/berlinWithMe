const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const WaitingListSchema = new Schema({
 _event:{type:Schema.Types.ObjectId , ref:"Event"},
 _user:{type:Schema.Types.ObjectId, ref:"User"}

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const WaitingList = mongoose.model('WaitingList', WaitingListSchema);
module.exports = WaitingList;