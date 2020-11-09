import Task from "./Task";

class TaskStorage {
    constructor() {
        this.taskStorage = window.localStorage;

        if (typeof this.taskStorage === 'undefined') {
            console.error('This browser does not support local storage.');
            alert('This browser does not support local storage.');
        }
    }

    loadSavedTasks() {
        console.log(`Retrieving all saved tasks from localstorage.`);
        let tasks = new Map();
        let keys = Object.keys(this.taskStorage);
        for (let i = keys.length - 1; i >= 0; i--) {
            let item = this.taskStorage.getItem(keys[i]);
            let taskInfo = JSON.parse(item);
            //Convert tasks parsed JSON to Task Object
            tasks.set(keys[i], new Task(taskInfo.taskName, taskInfo.taskDescription, taskInfo.taskImportance, taskInfo.taskIsDone, taskInfo.taskID));
        }
        return tasks;
    }

    saveOverwriteTask(task) {
        this.taskStorage.setItem(task.ID, JSON.stringify(task));
        console.log(JSON.stringify(task));
        console.log(`Saved task with ID ${task.ID} to localStorage.`);
    }

    deleteTask(taskID) {
        console.log(`Deleted task with ID ${taskID}.`);
        this.taskStorage.removeItem(taskID);
    }
}

export default TaskStorage;