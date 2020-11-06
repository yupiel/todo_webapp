import $ from 'jquery';
import Task from '../models/Task.js'

class TaskSubView {
    constructor(controller, taskModel, tempTask = false) {
        this.taskController = controller;
        this.taskModel = taskModel;
        this.temporaryTask = tempTask;

        this.taskElement = $.parseHTML(`
            <div class='content__task'> 
                <input type='text' class='content__taskname' placeholder='Task Name' contenteditable=true maxlength='24' disabled='disabled'/>
                <span class='content__taskimportance'></span> 
                <span class='content__taskmenutoggle content__taskmenutoggle--closed'></span>
                <span class='content__taskdone'></span>
                <div class='content--clearfloat'></div> 
                <div class='content__taskmenu' style='display: none;'>
                    <textarea rows='5' class='content__taskdescription' placeholder='Task Description' contenteditable=true maxlength='240' disabled='disabled'></textarea>
                    <div class='content--clearfloat'></div>
                    <span class='content__taskchanger content__taskimportance--low'></span>
                    <span class='content__taskchanger content__taskimportance--medium'></span>
                    <span class='content__taskchanger content__taskimportance--high'></span>
                    <span class='content__taskdelete'></span>
                    <span class='content__taskedit'></span>
                </div>
            </div>
            `);

        if (this.taskModel) {
            this.fromTaskModel(this.taskModel);
        }
        else {
            //Initialize Task with default Values
            this.taskModel = new Task('', '', 2, false);
            console.log('no task passed');
            this.fromTaskModel(this.taskModel);
        }
    }

    get isTemporaryTask() {
        return this.temporaryTask;
    }

    set isTemporaryTask(temp) {
        if (typeof temp !== 'boolean')
            return;

        this.temporaryTask = temp;
    }

    get htmlElement() {
        return this.taskElement;
    }

    saveNewTask() {
        //Save data from the HTML of this Task Subview to it's attached Task Model
        this.toTaskModel();

        if (!this.taskModel.name) {
            alert('Task Name cannot be empty');
            return false;
        }

        this.taskController.saveNewTask(this.taskModel);
        this.toggleSaveButtonState()

        //On Reloading tasks, unsaved tasks will be deleted automatically
        this.temporaryTask = false;

        return true;
    }

    saveTaskChanges() {
        //Save edited data from the HTML of this Task Subview to it's attached Task Model
        this.toTaskModel();

        if (!this.taskModel.name) {
            alert('Task Name cannot be empty');
            return false;
        }

        this.taskController.saveTaskChanges(this.taskModel);

        this.toggleEditingButtons();
        this.toggleEditing();
        return true;
    }

    deleteTask() {
        if (!this.temporaryTask) //Only send deletion request to controller if task isn't a temporary (UI only) one
            this.taskController.deleteTask(this.taskModel.ID);
        
        return true;
    }

    toggleTaskDoneState() {
        if (!this.temporaryTask)
            this.taskController.changeTaskDoneState(this.taskModel.ID, !this.taskModel.isDone);

        this.toggleDoneButtonState();
        return true;
    }
    //#endregion

    toggleTaskMenu() {
        $(this.taskElement).children('.content__taskmenu').slideToggle('slow');
        $(this.taskElement).children('.content__taskmenutoggle').toggleClass('content__taskmenutoggle--closed content__taskmenutoggle--open');
    }

    toggleEditingButtons() {
        $(this.taskElement).children('.content__taskmenu').children('.content__taskedit').toggleClass('content__taskedit--startedit content__taskedit--saveedit');
    }

    toggleEditing() {
        const editButtonElement = $(this.taskElement).children('.content__taskmenu').children('.content__taskedit');
        console.log(`Toggled Editing for task ${this.taskModel.ID}.`);
        console.log(`Edit button element ${$(editButtonElement).hasClass('content__taskedit--startedit')}`);
        //Toggle Editing for text fields
        if ($(editButtonElement).hasClass('content__taskedit--startedit')) {
            console.log(`Task with ID ${this.taskModel.ID} is not temporary Task.`);
            $(this.taskElement).children('.content__taskname').attr('disabled', true);
            $(this.taskElement).children('.content__taskmenu').children('.content__taskdescription').attr('disabled', true);
        }
        else if ($(editButtonElement).hasClass('content__taskedit--saveedit')) {
            console.log(`Task with ID ${this.taskModel.ID} is temporary Task.`);
            $(this.taskElement).children('.content__taskname').attr('disabled', false);
            $(this.taskElement).children('.content__taskmenu').children('.content__taskdescription').attr('disabled', false);
        }
    }

    toggleSaveButtonState() {
        const saveButtonElement = $(this.taskElement).children('.content__taskmenu').children('.content__taskedit');

        $(this.taskElement).children('.content__taskname').attr('disabled', true);
        $(this.taskElement).children('.content__taskmenu').children('.content__taskdescription').attr('disabled', true);

        //Remove "new" status from target task subview
        $(saveButtonElement).removeClass('content__taskedit--savenew');
        $(saveButtonElement).addClass('content__taskedit--startedit');
    }

    toggleDoneButtonState() {
        $(this.taskElement).children('.content__taskdone').toggleClass('content__taskdone--false content__taskdone--true');
    }

    //#region Converters
    fromTaskModel(taskModel) {
        $(this.taskElement).children('.content__taskname').val(taskModel.name);
        $(this.taskElement).children('.content__taskmenu').children('.content__taskdescription').val(taskModel.description);

        let importanceCSSClass = '';
        switch (taskModel.importance) {
            case 1:
                importanceCSSClass = 'content__taskimportance--low';
                break;
            case 2:
                importanceCSSClass = 'content__taskimportance--medium';
                break;
            case 3:
                importanceCSSClass = 'content__taskimportance--high';
                break;
            default:
                throw new Error(`Importance for taskObject ${taskModel.id} could not be assigned.`);
        }
        $(this.taskElement).children('.content__taskimportance').addClass(importanceCSSClass);

        $(this.taskElement).children('.content__taskdone').addClass(taskModel.isDone ? 'content__taskdone--true' : 'content__taskdone--false');

        if (this.temporaryTask) {
            $(this.taskElement).children('.content__taskmenu').children('.content__taskedit').addClass('content__taskedit--savenew');
            $(this.taskElement).children('.content__taskname').attr('disabled', false);
            $(this.taskElement).children('.content__taskmenu').children('.content__taskdescription').attr('disabled', false);
        }
        else {
            $(this.taskElement).children('.content__taskmenu').children('.content__taskedit').addClass('content__taskedit--startedit');
        }
    }

    toTaskModel() {
        this.taskModel.name = $(this.taskElement).children('.content__taskname').val();
        this.taskModel.description = $(this.taskElement).children('.content__taskmenu').children('.content__taskdescription').val();

        if ($(this.taskElement).children('.content__taskimportance').hasClass('content__taskimportance--low')) {
            this.taskModel.importance = 1;
        }
        else if ($(this.taskElement).children('.content__taskimportance').hasClass('content__taskimportance--medium')) {
            this.taskModel.importance = 2;
        }
        else if ($(this.taskElement).children('.content__taskimportance').hasClass('content__taskimportance--high')) {
            this.taskModel.importance = 3;
        }
        else {
            throw new Error(`Importance for taskObject ${taskName} could not be retrieved.`);
        }

        $(this.taskElement).children('.content__taskdone').hasClass('content__taskdone--true') ? this.taskModel.isDone = true : this.taskModel.isDone = false;

        return this.taskModel;
    }
    //#endregion
}

export default TaskSubView;