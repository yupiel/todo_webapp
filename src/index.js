import css from './index.css';
import html from './index.html';    //imports for webpack
import $ from 'jquery';

import Task from './Task.js';
import ListView from './ListView.js';
import TaskController from './TaskController.js';

$(function () {
    let model = new Task()
    let listView = new ListView(model);
    let controller = new TaskController(model, listView);
})