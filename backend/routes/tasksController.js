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

// get tasks by user
const getTaskByUser = async (request, response) => {
    try {
        const tasks = await Task.find({ assignTo: request.user.id });
        response.json(tasks);
    }  catch (error) {
        response.status(500).json({ error: error.message });
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
    // 
    if (!request.body) {
        return response.status(400).json({ error: 'Request body is required' })
    }

    const { title, description, rewardValue, dueDate, assignTo, notificationTime } = request.body

    if (!title) {
        return response.status(400).json({ error: 'Title is required' })
    }
    if (rewardValue === undefined || rewardValue === null) {
        return response.status(400).json({ error: 'Reward value is required' })
    }
    if (typeof rewardValue !== 'number' || rewardValue < 0 || rewardValue > 5) {
        return response.status(400).json({ error: 'Reward value must be a number between 0 and 5' })
    }
    if (!dueDate) {
        return response.status(400).json({ error: 'Due date is required' })
    }
    if (!request.user || !request.user.familyId) {
        return response.status(400).json({ error: 'Family context is missing' })
    }
    if (!assignTo) {
        return response.status(400).json({ error: 'assignTo is required' })
    }

    // Normalize assignTo: schema expects an array, accept string and wrap
    const normalizedAssignTo = Array.isArray(assignTo) ? assignTo : [assignTo]

    try {
        const newTask = new Task({
            title,
            description: description || '',
            rewardValue,
            dueDate,
            familyId: request.user.familyId, // from auth
            assignTo: normalizedAssignTo,
            notificationTime,
            status: 'Pending'
        })

        const savedTask = await newTask.save()
        return response.status(201).json(savedTask)
    } catch (error) {
        return response.status(400).json({ error: error.message })
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
    getAllTasks, getTaskByUser, getTaskById, postTask, updateTask, deleteTask, updateTaskStatus
} 