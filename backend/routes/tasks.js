const tasksRouter = require('express').Router()
const tasksController = require('./tasksController')
const { protect } = require('../middleware/auth')
tasksRouter.use(protect);
const upload = require('../middleware/upload')

tasksRouter.get('/', tasksController.getAllTasks)

tasksRouter.get('/:id', tasksController.getTaskById)

tasksRouter.post('/', tasksController.postTask)

tasksRouter.put('/:id', tasksController.updateTask)

tasksRouter.delete('/:id', tasksController.deleteTask)

//update task status
tasksRouter.patch('/status/:id', tasksController.updateTaskStatus)

// proof submission
tasksRouter.post('/proof', upload.single('proofImage'), tasksController.submitProof)

module.exports = tasksRouter