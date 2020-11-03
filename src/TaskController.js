import $ from 'jquery';
import Task from './Task';

class TaskController {
    constructor(tasks) {
        this.tasks = tasks;
    }

    getAllSavedTasks() {
        return this.tasks;
    }

    getAmountOfSavedTasks() {
        return this.tasks.length;
    }

    taskIDExists(taskID) {
        for (let i = 0; i < this.tasks.length; i++) {
            const savedTask = this.tasks[i];
            if (savedTask.taskID == taskID)
                return true;
        }
        return false;
    }

    saveTaskInList(task) {   //Processing Save Task Event
        let edited = false;

        for (let i = 0; i < this.tasks.length; i++) {
            const savedTask = this.tasks[i];
            if (savedTask.taskID == task.taskID && savedTask != task) {     //If task ID is already in list, edit task
                this.tasks[i] = task;
                edited = true;
            }
        }

        if (!edited)
            this.tasks.push(task);                                          //Otherwise save as new Task

        console.dir(this.tasks);
    }

    deleteTaskFromList(taskID) {
        let taskIndex;

        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];

            if (task.taskID == taskID)
                taskIndex = i;
        }

        if (taskIndex > -1)
            this.tasks.splice(taskIndex, 1);
        else
            console.error(`Task with ID ${taskIndex} not found in task list.`);
    }
}

export default TaskController;