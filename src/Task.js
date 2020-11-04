import $ from 'jquery';

class Task {
    /**
     * 
     * @param {string} taskName Name max ? characters
     * @param {string} taskDescription Description of max 240 characters
     * @param {number} taskImportance 1(low), 2(medium), 3(high) Importance
     * @param {boolean} taskIsDone Done status for checkbox 
     * @param {number} taskID ID for task
     */
    constructor(taskName, taskDescription, taskImportance, taskIsDone) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskIsDone = taskIsDone;
        this.taskImportance = taskImportance;

        this.taskID = this.generateUUID();
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

    /** Task importance between 1 and 3 (low to high)
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
        this.isDone = done;
    }

    get ID() {
        return this.taskID;
    }

    set ID(id) {
        this.taskID == id;
    }

    generateUUID() {

    }
}

export default Task; 