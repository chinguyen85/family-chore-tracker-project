const tasksRouter = require('express').Router()
const tasksController = require('./tasksController')

tasksRouter.get('/', tasksController.getAllTasks)

tasksRouter.get('/:id', tasksController.getTaskById)

tasksRouter.post('/', tasksController.postTask)

tasksRouter.put('/:id', tasksController.updateTask)

tasksRouter.delete('/:id', tasksController.deleteTask)

module.exports = tasksRouter