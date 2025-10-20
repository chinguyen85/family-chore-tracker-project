const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  rewardValue: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  dueDate: {
    type: Date,
    required: true
  },
  notificationTime: {
    type: Date
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  assignTo: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'For_Approval', 'Completed', 'Rejected'],
    default: 'Pending'
  },
  // Fields for proof upload
  proofImage: {
    type: String,
    required: false
  },
  proofNotes: {
    type: String,
    required: false
  },
  completedAt: {
    type: Date,
    required: false
  },
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema) 
