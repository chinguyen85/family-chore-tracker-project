const tasksRouter = require('express').Router()
const Task = require('../models/task')
const Family = require('../models/family')
const User = require('../models/user')

tasksRouter.get('/', async (request, response) => {
	const tasks = await Task.find({})
	response.json(tasks)
})

tasksRouter.get('/:id', async (request, response) => {
	const task = await Task.findById(request.params,id)
	if(task){
		response.json(task)
	} else {
		response.status(404).end()
	}
})