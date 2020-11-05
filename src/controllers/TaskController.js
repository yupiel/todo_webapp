import $ from 'jquery';
import Task from '../models/Task';

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

    createNewTask(name, description, importance, done) {
        return new Task(name, description, importance, done);
    }

    saveNewTask(task) {
        //TODO: input validation

        if (this.tasks.has(task.ID)) {
            console.error(`Overwriting Tasks is not permitted. ID: ${task.ID}`);
            return;
        }

        this.tasks.set(task.ID, task);

        console.log(`Saved Task with ID ${task.ID} as new.`);
    }

    saveTaskChanges(task) {
        if (!this.tasks.has(task.ID)) {
            console.error(`Cannot save changes to non-existent Task. ID: ${task.ID}`);
            return;
        }

        this.tasks.set(task.ID, task);

        console.log(`Edited Task with ID ${task.ID}.`);
    }

    deleteTask(taskID) {
        if (!this.tasks.has(taskID)) {
            console.error(`Cannot delete non-existent Task. ID: ${taskID}`);
            return;
        }

        this.tasks.delete(taskID)

        console.log(`Deleted Task with ID ${taskID}.`);
    }
}

export default TaskController;