import $ from 'jquery';
import Task from './Task.js'

class ListView {
    constructor(taskController) {
        this.taskController = taskController;

        this.taskTemplate = $.parseHTML(`
            <div class='content__task'> 
                <input type='text' class='content__taskname' placeholder='Task Name' disabled=true maxlength='24'/>
                <span class='content__taskimportance'></span> 
                <span class='content__taskmenutoggle content__taskmenutoggle--closed'></span>
                <span class='content__taskdone'></span>
                <div class='content--clearfloat'></div> 
                <div class='content__taskmenu' style='display: none;'>
                    <textarea rows='5' class='content__taskdescription' placeholder='Task Description' maxlength='240'></textarea>
                    <div class='content--clearfloat'></div>
                    <span class='content__taskchanger content__taskimportance--low'></span>
                    <span class='content__taskchanger content__taskimportance--medium'></span>
                    <span class='content__taskchanger content__taskimportance--high'></span>
                    <span class='content__taskdelete'></span>
                </div>
            </div>
            `);

        this.subscribeToUIEvents();
        this.updateTasklist();
    }

    createNewTask() {
        //Create Task as default
        let defaultTaskTemplate = new Task('', '', 2, false, this.taskController.getAmountOfSavedTasks() + 1);
        let defaultTaskTemplateUIElement = this.taskObjectToHTML(defaultTaskTemplate);

        //Subscribe Task to all Task Events
        this.subscribeTaskToTaskEvents(defaultTaskTemplateUIElement, defaultTaskTemplate.taskID);

        //Add to beginning of ListView
        $('.content__tasklist').prepend(defaultTaskTemplateUIElement);
        $('.content__tasklist').children('.content__task').first().children('.content__taskmenutoggle').trigger('click');
    }

    toggleTaskMenu(target) {
        this.toggleEditing(target);
        $(target).siblings('.content__taskmenu').slideToggle('slow');
        $(target).toggleClass('content__taskmenutoggle--closed content__taskmenutoggle--open');

        if ($(target).hasClass('content__taskmenutoggle--closed')) //Trigger save event AFTER menu has been closed
            $(target).triggerHandler('saveTask');   //Used here instead of .on() event to ensure event order
    }

    toggleEditing(target) {
        if ($(target).hasClass('content__taskmenutoggle--closed'))
            $(target).parent('.content__task').children('.content__taskname').attr('disabled', false);
        else if ($(target).hasClass('content__taskmenutoggle--open'))
            $(target).parent('.content__task').children('.content__taskname').attr('disabled', true);
    }

    updateTasklist() {
        this.taskController.getAllSavedTasks().forEach(task => {
            let taskFromList = this.taskObjectToHTML(task);
            this.subscribeTaskToTaskEvents(taskFromList, task.taskID);

            $('.content__tasklist').prepend(taskFromList);
        });
    }

    //#region Events and Event Helpers

    subscribeToUIEvents() {
        //Globally available events without order
        $('.content__addtask').on('click', () => this.createNewTask());
        $(document).on('click', '.content__taskmenutoggle', (event) => this.toggleTaskMenu(event.target));
        $(document).on('click', '.content__taskdelete', (event) => $(event.target).triggerHandler('deleteTask'));

        //Visual sugar
        $(document).on('input', '.content__taskname', (event) => this.resizeInputField(event.target));
    }

    subscribeTaskToTaskEvents(taskHTMLElement, originalTaskID) {
        this.subscribeTaskToSaveTaskEvent(taskHTMLElement, originalTaskID);
        this.subscribeTaskToDeleteTaskEvent(taskHTMLElement, originalTaskID);
    }

    subscribeTaskToSaveTaskEvent(taskHTMLElement, originalTaskID) {
        $(taskHTMLElement).children('.content__taskmenutoggle').on('saveTask', (event) => {
            let targetTask = $(event.target).parent('.content__task');
            let saveTaskObject = this.taskObjectFromHTML(targetTask);
            saveTaskObject.taskID = originalTaskID;

            if (saveTaskObject.taskName == '') {    //visual level input validation
                alert('Task Name cannot be empty!');
                this.toggleTaskMenu(event.target);
                return;
            }

            this.taskController.saveTaskInList(saveTaskObject);
        });
    }

    subscribeTaskToDeleteTaskEvent(taskHTMLElement, originalTaskID) {
        $(taskHTMLElement).children('.content__taskmenu').children('.content__taskdelete').on('deleteTask', (event) => {
            if (this.taskController.taskIDExists(originalTaskID))           //Delete Task from the saved task lists if it exists
                this.taskController.deleteTaskFromList(originalTaskID);
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
        $(filledTaskTemplate).children('.content__taskname').val(taskObject.taskName);
        $(filledTaskTemplate).children('.content__taskmenu').children('.content__taskdescription').val(taskObject.taskDescription);

        let importanceCSSClass = '';
        switch (taskObject.taskImportance) {
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

        $(filledTaskTemplate).children('.content__taskdone').addClass(taskObject.taskIsDone ? 'content__taskdone--true' : 'content__taskdone--false');

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

        return new Task(taskName, taskDescription, taskImportance, taskIsDone);
    }
    //#endregion

    //Visual sugar
    resizeInputField(target) {
        $(target).css({ 'width': $(target).val().length + 'ch' });
    }
}

export default ListView;