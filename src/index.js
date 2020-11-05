import css from './style/index.css';
import html from './index.html';    //imports for webpack
import $ from 'jquery';

import Task from './models/Task.js';
import ListView from './views/ListView.js';
import TaskController from './controllers/TaskController.js';

$(function () {
    let tasks = new Map();

    let newTask = new Task('Test Task', 'Test Description', 3, true);
    tasks.set(newTask.ID, newTask);

    let controller = new TaskController(tasks);
    let listView = new ListView(controller);
})