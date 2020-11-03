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

    subscribeToUIEvents() {
        $('.content__addtask').on('click', () => this.createNewTask());
        $(document).on('click', '.content__taskmenutoggle', (event) => this.toggleTaskMenu(event.target));
        $(document).on('click', '.content__taskdelete', (event) => this.deleteTask(event.target));

        //Visual sugar
        $(document).on('input', '.content__taskname', (event) => this.resizeInputField(event.target));
    }

    createNewTask() {
        //Create Task as default
        let defaultTaskTemplate = new Task('', '', 2, false, this.taskController.getAmountOfSavedTasks() + 1);
        let defaultTaskTemplateUIElement = this.taskObjectToHTML(defaultTaskTemplate);

        this.subscribeTaskToSaveTaskEvent(defaultTaskTemplateUIElement, defaultTaskTemplate.taskID);

        //Append to ListView
        $('.content__tasklist').prepend(defaultTaskTemplateUIElement);
        $('.content__tasklist').children('.content__task').first().children('.content__taskmenutoggle').trigger('click');
    }

    toggleTaskMenu(target) {
        //Make Content Editable
        if ($(target).hasClass('content__taskmenutoggle--closed')) {
            $(target).parent('.content__task').children('.content__taskname').attr('disabled', false);
        }
        else if ($(target).hasClass('content__taskmenutoggle--open')) {
            //Input validation
            let targetTaskObject = this.taskObjectFromHTML($(target).parent('.content__task'));
            if (targetTaskObject.taskName == '') {
                alert('Task Name cannot be empty!');
                return;
            }
            else {
                $(target).parent('.content__task').children('.content__taskname').attr('disabled', true);
            }
        }

        if ($(target).hasClass('content__taskmenutoggle--open')) //Trigger save event if menu is open
            $(target).triggerHandler('saveTask');

        $(target).siblings('.content__taskmenu').slideToggle('slow');
        $(target).toggleClass('content__taskmenutoggle--closed content__taskmenutoggle--open');
    }

    deleteTask(target) {
        $(target).parent('.content__taskmenu').parent('.content__task').remove();
    }

    updateTasklist() {
        this.taskController.getAllSavedTasks().forEach(task => {
            let taskFromList = this.taskObjectToHTML(task);
            this.subscribeTaskToSaveTaskEvent(taskFromList, task.taskID);
            
            $('.content__tasklist').prepend(taskFromList);
        });
    }

    subscribeTaskToSaveTaskEvent(taskHTMLElement, originalTaskID){
        $(taskHTMLElement).children('.content__taskmenutoggle').on('saveTask', (event) => {    //Subscribe to
            let targetTask = $(event.target).parent('.content__task');
            let saveTaskObject = this.taskObjectFromHTML(targetTask); 
            saveTaskObject.taskID = originalTaskID;

            this.taskController.saveTaskInList(saveTaskObject);
        });
    }

    //HELPERS

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

    resizeInputField(target) {  //Visual sugar for adaptable size input
        $(target).css({ 'width': $(target).val().length + 'ch' });
    }
}

export default ListView;