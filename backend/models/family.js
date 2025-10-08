const mongoose = require('mongoose')

const familySchema = mongoose.Schema({
  name:
  {
    type:String,
    required: true
  },
  members:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  tasks:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  }
})

familySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Family', blogSchema) 
