import css from './style/index.css';
import html from './index.html';    //imports for webpack
import $ from 'jquery';

import Task from './models/Task.js';
import ListView from './views/ListView.js';
import TaskController from './controllers/TaskController.js';

import taskStorage from './models/TaskStorage';

$(function () {
    //Adding testing task
    let newTask = new Task('Test Task', 'Test Description', 3, true);
    taskStorage.set(newTask.ID, newTask);

    let controller = new TaskController(taskStorage);
    let listView = new ListView(controller);
})