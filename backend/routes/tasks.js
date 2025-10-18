const tasksRouter = require('express').Router()
const tasksController = require('./tasksController')
const { protect } = require('../middleware/auth')
tasksRouter.use(protect)

tasksRouter.get('/', tasksController.getAllTasks)

//get one user's all tasks
tasksRouter.get('/my', tasksController.getTaskByUser);

tasksRouter.get('/:id', tasksController.getTaskById)

tasksRouter.post('/', tasksController.postTask)

tasksRouter.put('/:id', tasksController.updateTask)

tasksRouter.delete('/:id', tasksController.deleteTask)

//update task status
tasksRouter.patch('/status/:id', tasksController.updateTaskStatus)

module.exports = tasksRouter