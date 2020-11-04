import $ from 'jquery';
import Task from '../models/Task.js'

class ListView {
    constructor(taskController) {
        this.taskController = taskController;

        this.taskTemplate = $.parseHTML(`
            <div class='content__task'> 
                <input type='text' class='content__taskname' placeholder='Task Name' contenteditable=true maxlength='24'/>
                <span class='content__taskimportance'></span> 
                <span class='content__taskmenutoggle content__taskmenutoggle--closed'></span>
                <span class='content__taskdone'></span>
                <div class='content--clearfloat'></div> 
                <div class='content__taskmenu' style='display: none;'>
                    <textarea rows='5' class='content__taskdescription' placeholder='Task Description' contenteditable=true maxlength='240'></textarea>
                    <div class='content--clearfloat'></div>
                    <span class='content__taskchanger content__taskimportance--low'></span>
                    <span class='content__taskchanger content__taskimportance--medium'></span>
                    <span class='content__taskchanger content__taskimportance--high'></span>
                    <span class='content__taskdelete content__taskdelete--deletetask'></span>
                    <span class='content__taskedit'></span>
                </div>
            </div>
            `);

        this.subscribeToUIEvents();
        this.updateTasklist();
    }

    createNewTask() {
        //Create Task with default values
        let defaultTaskTemplate = new Task('', '', 2, false);
        let defaultTaskTemplateUIElement = this.taskObjectToHTML(defaultTaskTemplate);
        //Add Save new button
        $(defaultTaskTemplateUIElement).children('.content__taskmenu').children('.content__taskedit').addClass('content__taskedit--savenew');

        //Subscribe Task to all Task Events
        this.subscribeTaskToTaskEvents(defaultTaskTemplateUIElement, defaultTaskTemplate.ID);

        //Add to beginning of ListView
        $('.content__tasklist').prepend(defaultTaskTemplateUIElement);
        $('.content__tasklist').children('.content__task').first().children('.content__taskmenutoggle').trigger('click');
    }

    toggleTaskMenu(target) {
        $(target).siblings('.content__taskmenu').slideToggle('slow');
        $(target).toggleClass('content__taskmenutoggle--closed content__taskmenutoggle--open');
    }

    toggleEditingButtons(target) {
        if (!$(target).hasClass('content__taskedit--savenew')) {
            //Toggle Start Edit button and Save Changes button
            $(target).toggleClass('content__taskedit--startedit content__taskedit--saveedit');
        }
        else {
            //Remove "new" status from target task subview
            $(target).removeClass('content__taskedit--savenew');
            $(target).addClass('content__taskedit--startedit');
        }
    }

    toggleEditing(target) {
        const targetTask = $(target).parent('.content__taskmenu').parent('.content__task');

        //Toggle Editing for text fields
        if ($(target).hasClass('content__taskedit--startedit')) {
            $(targetTask).children('.content__taskname').attr('disabled', true);
            $(targetTask).children('.content__taskmenu').children('.content__taskdescription').attr('disabled', true);
        }
        else if ($(target).hasClass('content__taskedit--saveedit')) {
            $(targetTask).children('.content__taskname').attr('disabled', false);
            $(targetTask).children('.content__taskmenu').children('.content__taskdescription').attr('disabled', false);
        }
        else if ($(target).hasClass('content__taskedit--savenew')) {
            $(targetTask).children('.content__taskname').attr('disabled', true);
            $(targetTask).children('.content__taskmenu').children('.content__taskdescription').attr('disabled', true);
        }
    }

    updateTasklist() {
        this.taskController.getAllSavedTasks().forEach(task => {
            let taskFromList = this.taskObjectToHTML(task);
            //Add Editing button for task
            $(taskFromList).children('.content__taskmenu').children('.content__taskedit').addClass('content__taskedit--startedit');
            this.toggleEditing($(taskFromList).children('.content__taskmenu').children('.content__taskedit'));

            this.subscribeTaskToTaskEvents(taskFromList, task.ID);

            $('.content__tasklist').prepend(taskFromList);
        });
    }

    //#region Events and Event Helpers

    subscribeToUIEvents() {
        //Creation Event
        $('.content__addtask').on('click', () => this.createNewTask());

        //Taskmenu Toggling Event
        $(document).on('click', '.content__taskmenutoggle', (event) => this.toggleTaskMenu(event.target));

        //Delete Button Events
        $(document).on('click', '.content__taskdelete--deletetask', (event) => $(event.target).triggerHandler('discardDeleteTask'));

        //Edit Button Events
        $(document).on('click', '.content__taskedit--startedit', (event) => {
            this.toggleEditingButtons(event.target);
            this.toggleEditing(event.target);
        });
        $(document).on('click', '.content__taskedit--saveedit', (event) => {
            this.toggleEditingButtons(event.target);
            this.toggleEditing(event.target);
            $(event.target).triggerHandler('saveTaskChanges');
        });
        $(document).on('click', '.content__taskedit--savenew', (event) => {
            this.toggleEditingButtons(event.target);
            this.toggleEditing(event.target);
            $(event.target).triggerHandler('saveNewTask');
        });

        //Visual sugar
        $(document).on('input', '.content__taskname', (event) => this.resizeInputField(event.target));
    }

    subscribeTaskToTaskEvents(taskHTMLElement, originalTaskID) {
        this.subscribeTaskToSaveNewTaskEvent(taskHTMLElement, originalTaskID);
        this.subscribeTaskToSaveTaskChangesEvent(taskHTMLElement, originalTaskID);
        this.subscribeTaskToDeleteTaskEvent(taskHTMLElement, originalTaskID);
    }

    subscribeTaskToSaveNewTaskEvent(taskHTMLElement, originalTaskID) {
        $(taskHTMLElement).children('.content__taskmenu').children('.content__taskedit').on('saveNewTask', (event) => {
            let targetTaskView = $(event.target).parent('.content__taskmenu').parent('.content__task');
            let saveTaskModel = this.taskObjectFromHTML(targetTaskView);
            saveTaskModel.ID = originalTaskID;

            //TODO: Better Input validation => (Controller)
            if (saveTaskModel.name == null || saveTaskModel.name == '') {
                alert('Task Name cannot be empty');
                this.toggleTaskMenu($(targetTaskView).children('.content__taskmenu'));
                return;
            }

            this.taskController.saveNewTask(saveTaskModel);
        });
    }

    subscribeTaskToSaveTaskChangesEvent(taskHTMLElement, originalTaskID) {
        $(taskHTMLElement).children('.content__taskmenu').children('.content__taskedit').on('saveTaskChanges', (event) => {
            let targetTaskView = $(event.target).parent('.content__taskmenu').parent('.content__task');
            let saveTaskModel = this.taskObjectFromHTML(targetTaskView);
            let editedTask = new Task(saveTaskModel.name, saveTaskModel.description, saveTaskModel.importance, saveTaskModel.isDone, originalTaskID);

            if (editedTask.name == null || editedTask.name == '') {
                alert('Task Name cannot be empty');
                return;
            }

            this.taskController.saveTaskChanges(editedTask);
        })
    }

    subscribeTaskToDeleteTaskEvent(taskHTMLElement, originalTaskID) {
        $(taskHTMLElement).children('.content__taskmenu').children('.content__taskdelete').on('discardDeleteTask', (event) => {
            this.taskController.deleteTask(originalTaskID);

            //Delete Visual Element of task
            let targetTask = $(event.target).parent('.content__taskmenu').parent('.content__task');
            $(targetTask).remove();
        });
    }
    //#endregion

    //#region Converters
    /**
     * Fills Task Object's information into a Task Template
     * @param {Task} taskObject 
     * @returns {string} Filled Task Template
     */
    taskObjectToHTML(taskObject) {
        let filledTaskTemplate = $(this.taskTemplate).clone();
        $(filledTaskTemplate).children('.content__taskname').val(taskObject.name);
        $(filledTaskTemplate).children('.content__taskmenu').children('.content__taskdescription').val(taskObject.description);

        let importanceCSSClass = '';
        switch (taskObject.importance) {
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
                throw new Error(`Importance for taskObject ${taskName} could not be assigned.`);
        }
        $(filledTaskTemplate).children('.content__taskimportance').addClass(importanceCSSClass);

        $(filledTaskTemplate).children('.content__taskdone').addClass(taskObject.isDone ? 'content__taskdone--true' : 'content__taskdone--false');

        return $(filledTaskTemplate);
    }

    taskObjectFromHTML(taskHTML) {
        let taskName, taskDescription, taskImportance, taskIsDone;
        taskName = $(taskHTML).children('.content__taskname').val();
        taskDescription = $(taskHTML).children('.content__taskmenu').children('.content__taskdescription').val();

        if ($(taskHTML).children('.content__taskimportance').hasClass('content__taskimportance--low')) {
            taskImportance = 1;
        }
        else if ($(taskHTML).children('.content__taskimportance').hasClass('content__taskimportance--medium')) {
            taskImportance = 2;
        }
        else if ($(taskHTML).children('.content__taskimportance').hasClass('content__taskimportance--high')) {
            taskImportance = 3;
        }
        else {
            throw new Error(`Importance for taskObject ${taskName} could not be retrieved.`);
        }

        $(taskHTML).children('.content__taskdone').hasClass('content__taskdone--true') ? taskIsDone = true : taskIsDone = false;

        return this.taskController.createNewTask(taskName, taskDescription, taskImportance, taskIsDone);
    }
    //#endregion

    //Visual sugar
    resizeInputField(target) {
        $(target).css({ 'width': $(target).val().length + 'ch' });
    }
}

export default ListView;