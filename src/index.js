import css from './style/index.css';
import html from './index.html';    //imports for webpack
import $ from 'jquery';

import Task from './Task.js';
import ListView from './ListView.js';
import TaskController from './TaskController.js';

$(function () {
    let tasks = [new Task('Test Task', 'Test Description', 3, true, 1)]

    let controller = new TaskController(tasks);
    let listView = new ListView(controller);
})