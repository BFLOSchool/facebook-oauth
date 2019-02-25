var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    unique: true,
    required: false
  },
  phoneNumber: {
    type: Number,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  facebookId: {
    type: String,
    required: false
  }
}); 

module.exports = mongoose.model('User', UserSchema);
