const Task = require('../models/task')
const Family = require('../models/family')
const User = require('../models/user')

// get all family tasks
const getAllTasks = async (request, response) => {
    try {
        const tasks = await Task.find({ familyId: request.user.familyId}) //only one family
        response.json(tasks) 
    } catch (error) {
        response.status(500).json({ error: error.message })
    } 
}

// get one task by id
const getTaskById = async (request, response) => {
    try {
        const task = await Task.findOne({
            _id: request.params.id,
            familyId: request.user.familyId
        })
        if (task) {
            response.json(task)
        } else {
            response.status(404).json({ error: 'Task not found'})
        }
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
}

// post a new task
const postTask = async (request, response) => {
    if(!request.body 
        || !request.body.title 
        || !request.body.rewardValue
        || !request.body.dueDate
        || !request.user.familyId//
        || !request.body.assignTo)
        return response.status(400).end()

    try {
        const newTask = new Task({
            title: request.body.title,
            description: request.body.description || '', 
            rewardValue: request.body.rewardValue,
            dueDate: request.body.dueDate,
            familyId: request.user.familyId, // get from auth
            assignTo: request.body.assignTo,
            notificationTime: request.body.notificationTime, 
            status: 'Pending'
        })

        const savedTask = await newTask.save()
        response.status(201).json(savedTask)
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

// update a task
const updateTask = async (request, response) => {
    try {
        const updatedTask = await Task.findOneAndUpdate (
            // query conditions
            {
                _id: request.params.id,
                familyId: request.user.familyId // add family auth
            },
            //update data
            request.body,
            //options configuration
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

// delete one task
const deleteTask = async (request, response) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: request.params.id,
            familyId: request.user.familyId
        })

        if(!task){
            return response.status(404).json({ error: 'Task not found'})
        }
        response.status(204).end()
    } catch (error) {
        response.status(400).json({ error: error.message})
    }
}

//complete one task
const updateTaskStatus = async (request, response) => {
    const newStatus = request.body.status

    if (!newStatus) 
        return response.status(400).json({ error: 'Status is required' })
    

    try {
        // find task
        const task = await Task.findOne({
            _id: request.params.id,
            familyId: request.user.familyId
        })
        
        console.log('updateTaskStatus:', {
            id: request.params.id,
            familyId: request.user.familyId,
            status: request.body.status
        });

        if (!task) {
            return response.status(404).json({ error: 'Task not found' })
        }

        //only supervisor can approve or reject
        if(request.user.role !== 'Supervisor' && (newStatus === 'Completed' || newStatus === 'Rejected')){
            return response.status(403).json({ error: 'Only supervisors can approve/reject tasks' })
        }

        if (newStatus === 'For_Approval' && !task.assignTo.includes(request.user._id)){
            return response.status(403).json({ error: 'You can not complete tasks that are not assigned to you' })
        }

        //update task
        task.status = newStatus
        const updatedTask = await task.save()
    
        response.json(updatedTask)
    } catch (error) {
        response.status(400).json({ error: error.message})
        
    }
}

module.exports =  {
    getAllTasks, getTaskById, postTask, updateTask, deleteTask, updateTaskStatus
} 