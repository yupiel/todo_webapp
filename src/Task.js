import $ from 'jquery';

class Task {
    /**
     * 
     * @param {string} taskName Name max ? characters
     * @param {string} taskDescription Description of max 240 characters
     * @param {number} taskImportance 1(low), 2(medium), 3(high) Importance
     * @param {boolean} taskIsDone Done status for checkbox 
     */
    constructor(taskName, taskDescription, taskImportance, taskIsDone) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskIsDone = taskIsDone;
        this.taskImportance = taskImportance;
    }
}

export default Task; 