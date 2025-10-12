const mongoose = require('mongoose');
const crypto = require('crypto');

const familySchema = mongoose.Schema({
  familyName: {
    type: String,
    required: [true, 'Family name is required'],
    trim: true
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
})

// Method to generate invite code
familySchema.methods.getInviteCode = function() {
  const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates an 6-character hex string
  this.inviteCode = code;
  return code;
}

familySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Family', familySchema) 
