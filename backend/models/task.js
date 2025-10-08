const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
  title:
  {
    type: String,
    required: true
  },
  content: String,
  family:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  assignTo:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  status:
  {
    type: String,
    enum:['in_progress', 'done']
  
  }
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', blogSchema) 
