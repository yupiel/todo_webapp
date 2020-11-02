import $ from 'jquery';
import Task from './Task';

class TaskController {
    constructor(taskModel, listView) {
        this.taskModel = taskModel;
        this.listView = listView;

        this.taskList = [new Task('Test Task', 'Test Description', 3, true)]

        $(document).on('saveTask', (event, task) => this.saveTaskInList(task));  //Subscribing to Save Task Event
        listView.updateTasklist(this.taskList);
    }

    getAllSavedTasks() {
        return this.taskList;
    }

    saveTaskInList(task) {   //Processing Save Task Event
        this.taskList.push(task);
        console.dir(this.taskList);
    }
}

export default TaskController;