const Task = require('../models/task')
const Family = require('../models/family')
const User = require('../models/user')

const getAllTasks = async (request, response) => {
    try {
        const tasks = await Task.find({})
        response.json(tasks) 
    } catch (error) {
        response.status(500).json({ error: error.message })
    } 
}

const getTaskById = async (request, response) => {
    try {
        const task = await Task.findById(request.params.id)
        if (task) {
            response.json(task)
        } else {
            response.status(404).json({ error: 'Task not found'})
        }
    } catch (error) {
        response.status(500).json({ error: error.message })
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

    try {
        const newTask = new Task({
            title: request.body.title,
            description: request.body.description || '', 
            rewardValue: request.body.rewardValue,
            dueDate: request.body.dueDate,
            familyId: request.body.familyId,
            assignTo: request.body.assignTo,
            notificationTime: request.body.notificationTime, //
            status: 'Pending'
        })

        const savedTask = await newTask.save()
        response.status(201).json(savedTask)
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

const updateTask = async (request, response) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate (
            request.params.id,
            request.body,
            {
                new: true, //return new
                runValidators: true //valitate schema
            }
        )
        
        if (!updatedTask){
            return response.status(404).json({ error: 'Task not found'})
        }

        response.json(updatedTask)
    } catch (error) {
        response.status(400).json({ error: error.message})
    }
}

const deleteTask = async (request, response) => {
    try {
        const task = await Task.findByIdAndDelete(request.params.id)

        if(!task){
            return response.status(404).json({ error: 'Task not found'})
        }
        response.status(204).end()
    } catch (error) {
        response.status(400).json({ error: error.message})
    }
}

module.exports =  {
    getAllTasks, getTaskById, postTask, updateTask, deleteTask
} 