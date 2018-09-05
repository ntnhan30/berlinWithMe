const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const WantToGoSchema = new Schema({
 _event:{type:Schema.Types.ObjectId , ref:"Event"},
 _user:{type:Schema.Types.ObjectId, ref:"User"}

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const WantToGo = mongoose.model('WantToGo', WantToGoSchema);
module.exports = WantToGo;