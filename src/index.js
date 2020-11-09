import css from './style/index.css';
import html from './index.html';    //imports for webpack
import $ from 'jquery';

import Task from './models/Task.js';
import ListView from './views/ListView.js';
import TaskController from './controllers/TaskController.js';

import TaskStorage from './models/TaskStorage';

$(function () {
    let storage = new TaskStorage();

    let controller = new TaskController(storage);
    let listView = new ListView(controller);
})