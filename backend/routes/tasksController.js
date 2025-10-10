const Task = require('../models/task')
const Family = require('../models/family')
const User = require('../models/user')

const getAllTasks = async (request, response) => {
    const tasks = await Task.find({})
    response.json(tasks) 
}

const getTaskById = async (request, response) => {
    const task = await Task.findById(request.param.id)
    if (task) {
        response.json(task)
    } else {
        response.status(404).json({ error: 'Task not found'})
    }
}

const postTask = async (request, response) => {
    if(!request.body 
        || !request.body.title 
        || !request.body.rewardValue
        || !request.body.dueDate
        || !request.body.familyId
        || !request.body.assignTo)
        return response.status(400).end()

    

}

module.exports =  {
    getAllTasks, getTaskById, postTask
} 