import $ from 'jquery';
import Task from '../models/Task';

class TaskController {
    constructor(tasks) {
        this.storage = tasks;
        this.tasks = tasks.loadSavedTasks();
        console.log(this.tasks);
    }

    getAllSavedTasks() {
        return this.tasks;
    }

    saveNewTask(task) {
        if (task.name == null || task.name == '') {
            console.error(`Task could not be saved as the required field 'name' is empty. ID: ${task.ID}`);
            return;
        }
        if (task.description == null || task.description.length > 240) {
            console.error(`Task descriptions cannot be over 240 charactgers long. ID: ${task.ID}`);
            return;
        }

        if (this.tasks.has(task.ID)) {
            console.error(`Overwriting Tasks is not permitted. ID: ${task.ID}`);
            return;
        }

        this.tasks.set(task.ID, task);
        this.storage.saveOverwriteTask(task);

        console.log(`Saved Task with ID ${task.ID} as new.`);
    }

    saveTaskChanges(task) {
        if (!this.tasks.has(task.ID)) {
            console.error(`Cannot save changes to non-existent Task. ID: ${task.ID}`);
            return;
        }

        this.tasks.set(task.ID, task);
        this.storage.saveOverwriteTask(task)

        console.log(`Edited Task with ID ${task.ID}.`);
    }

    deleteTask(taskID) {
        if (!this.tasks.has(taskID)) {
            console.error(`Cannot delete non-existent Task. ID: ${taskID}`);
            return;
        }

        this.tasks.delete(taskID)
        this.storage.deleteTask(taskID);

        console.log(`Deleted Task with ID ${taskID}.`);
    }

    changeTaskDoneState(taskID, isDone) {
        if (typeof isDone !== 'boolean') {
            console.error(`Done Parameter must be boolean.`);
        }

        if (!this.tasks.has(taskID)) {
            console.error(`Cannot change done state of non-existent Task. ID: ${taskID}.`);
            return;
        }

        this.tasks.get(taskID).isDone = isDone;
        this.storage.saveOverwriteTask(this.tasks.get(taskID));

        console.log(`Changed done state of Task with ID ${taskID}.`);
    }

    changeTaskImportance(taskID, importance) {
        if (!this.tasks.has(taskID)) {
            console.error(`Cannot change done state of non-existent Task. ID: ${taskID}.`);
            return;
        }

        this.tasks.get(taskID).importance = importance;
        this.storage.saveOverwriteTask(this.tasks.get(taskID));

        console.log(`Changed importance of Task with ID ${taskID}.`);
    }
}

export default TaskController;