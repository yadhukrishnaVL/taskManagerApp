const express = require('express');
const tasksData = require('./tasks.json');
const validator = require('./helpers/validator.js')
const fs = require('fs');
const path=require('path');
const PORT = 3000;

const app = express();
app.use(express.json());

//Retrieve all tasks.
app.get('/tasks', (req, res) => {
    res.status(200).json(tasksData);
})

//Retrieve a single task by its ID.
app.get('/tasks/:taskId', (req, res) => {
    let assignmentTasks= tasksData.tasks;
    let taskIdpassed = req.params.taskId;
    let filteredTasks = assignmentTasks .filter(val => val.taskId==taskIdpassed);   
   
    if ( filteredTasks.length == 0){
        return res.status(404).send(' no appropriate course with this course id ')
    }

    return res.status(200).json(filteredTasks);
})

//Create a new task.
app.post('/tasks', (req,res) => {
    const userProvidedDtails=req.body;
    let writePath= path.join(__dirname, '' ,'tasks.json')
    if(validator.validateTasksInfo(userProvidedDtails).status == true){
        let taskDataModified = JSON.stringify(userProvidedDtails);
        let taskModified = tasksData.tasks
        taskModified.push(JSON.parse(taskDataModified));
        fs.writeFile(writePath, JSON.stringify(taskModified), {encoding : 'utf8' , flag : 'w'} , (err, data) => {
            
             if(err)
             {
                 return res.status(500).send('somethimg went wrong while creating the task');
 
             }
             else{
                 return res.status(201).send(validator.validateTasksInfo(userProvidedDtails).message);
             }
        })
    }
    else{

        res.status(400).json(validator.validateTasksInfo(userProvidedDtails))
    }
})


//Update an existing task by its ID
app.put('/tasks/:taskId', (req,res) => {
    let assignmentTasks= tasksData.tasks;
    let taskIdpassed = req.params.taskId;  
    let filteredTasks_ind = assignmentTasks.findIndex(val => val.taskId==taskIdpassed);  
    if ( filteredTasks_ind  == -1){
        return res.status(404).send(' no appropriate task with this taskid')
    }
    else{
    const userProvidedData=req.body;
    let writePath= path.join(__dirname, '' ,'tasks.json')
    let taskDataModified = JSON.stringify(userProvidedData)
   let taskTitle=userProvidedData.taskTitle
   let taskDescription=userProvidedData.taskDescription
   let completionStatus=userProvidedData.completionStatus
    assignmentTasks[filteredTasks_ind]={
        ...tasksData.tasks[filteredTasks_ind],
        taskTitle,
        taskDescription,
        completionStatus
    }
    let tasks =assignmentTasks
        fs.writeFile(writePath, JSON.stringify({tasks}), {encoding : 'utf8' , flag : 'w'} , (err, data) => {
            
             if(err)
             {
                 return res.status(500).send('somethimg went wrong while updating the task');
 
             }
             else{
                 return res.status(201).send((userProvidedData).message);
             }
        })
    }
    })

    //Delete a task by its ID.
    app.delete('/tasks/:taskId', async (req,res) => {
        const assignmentTasks= tasksData.tasks;
        let taskIdpassed = req.params.taskId;
        let writePath= path.join(__dirname, '' ,'tasks.json')  
        let filteredTasks_ind = assignmentTasks.findIndex(val => val.taskId==taskIdpassed);  
        if ( filteredTasks_ind  == -1){
            return res.status(404).send(' no appropriate task with this taskid')
        }
        else{
            const result = assignmentTasks.splice(filteredTasks_ind,1)[0]
           
            let tasks =assignmentTasks
            fs.writeFile(writePath, JSON.stringify({tasks}), {encoding : 'utf8' , flag : 'w'} , (err, data) => {
            
                if(err)
                {
                    return res.status(500).send('somethimg went wrong while updating the task');
    
                }
                else{
                    return res.status(201).send(result);
                }
           })

        }
    })

app.listen(PORT, (error) => {
    if (error) {
        console.log('something went wrong while starting the server');
    }
    else {
        console.log('server is running on port 3000');
    }
});