const mongoose = require('mongoose')

const familySchema = mongoose.Schema({
  familyName: {
    type: String,
    required: true
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
  // members: [{ ////////
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }],
  // tasks: [{ ////////
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Task'
  // }]
})

familySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Family', familySchema) 
