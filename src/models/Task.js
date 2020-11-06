import $ from 'jquery';
import { v4 } from 'uuid';

class Task {
    /**
     * @param {string} taskName Name max ? characters
     * @param {string} taskDescription Description of max 240 characters
     * @param {number} taskImportance 1(low), 2(medium), 3(high) Importance
     * @param {boolean} taskIsDone Done status for checkbox 
     * @param {number} taskID ID for task
     */
    constructor(taskName = null, taskDescription = null, taskImportance = null, taskIsDone = false, taskID = null) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskIsDone = taskIsDone;
        this.taskImportance = taskImportance;

        this.taskID = (taskID === null) ? this.generateUUID() : taskID;
    }

    get name() {
        return this.taskName;
    }

    set name(name) {
        this.taskName = name;
    }

    get description() {
        return this.taskDescription;
    }

    set description(desc) {
        this.taskDescription = desc;
    }

    /** 
     * Task importance between 1 and 3 (low to high)
     */
    get importance() {
        return this.taskImportance;
    }

    set importance(importance) {
        this.taskImportance = importance;
    }

    get isDone() {
        return this.taskIsDone;
    }

    set isDone(done) {
        this.taskIsDone = done;
    }

    get ID() {
        return this.taskID;
    }

    set ID(id) { }

    generateUUID() {
        return v4();
    }
}

export default Task; 