class validator{
    static validateTasksInfo( tasksInfo , tasksData){
        if( tasksInfo.hasOwnProperty('taskId') &&
        tasksInfo.hasOwnProperty('taskTitle') &&
        tasksInfo.hasOwnProperty('taskDescription') &&
        tasksInfo.hasOwnProperty('completionStatus') 
        ){
            return{
                "status" : true,
                "message" : "task has been added"
            }
        }
        else{
            return{
                "status" : false,
                "message" : " task info is malformed,please provide all the details"
            }
        }
    }
}

module.exports= validator;