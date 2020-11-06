import $ from 'jquery';
import TaskSubView from './TaskSubView.js'

class ListView {
    constructor(taskController) {
        this.taskController = taskController;
        this.taskSubViews = [];

        this.subscribeToUIEvents();
        this.updateTasklist();
    }

    get temporaryTaskExists() {
        let result = false;
        this.taskSubViews.forEach(task => {
            if (task.isTemporaryTask)
                result = true;
        })
        this.toggleAddNewTaskButtonDisabled();
        return result;
    }

    createNewTask() {
        if (this.temporaryTaskExists)
            return;

        let newTaskSubView = new TaskSubView(this.taskController, null, true);
        this.taskSubViews.unshift(newTaskSubView); //TODO: Finish temp task creation

        //Add to beginning of ListView
        $('.content__tasklist').prepend(newTaskSubView.htmlElement);
        newTaskSubView.toggleTaskMenu();

        this.toggleAddNewTaskButtonDisabled();
    }

    updateTasklist() {
        //Clear current tasks from list
        $('.content__tasklist').empty();
        this.taskSubViews.splice(0, this.taskSubViews.length);

        //Create HTML Node for every saved task
        this.taskController.getAllSavedTasks().forEach(task => {
            console.log('tasks from list: ' + task.ID)
            let savedTask = new TaskSubView(this.taskController, task, false);
            this.taskSubViews.push(savedTask);
        });

        //TODO: Add sorting before appending
        //Display all task subviews
        this.taskSubViews.forEach(task => {
            $('.content__tasklist').append(task.htmlElement);
        })

        if (!this.temporaryTaskExists)
            this.toggleAddNewTaskButtonDisabled();
    }

    toggleAddNewTaskButtonDisabled() {
        $('.content__addtask').attr('disabled', (index, attr) => {
            return attr == 'disabled' ? false : 'disabled';
        })
    }

    //#region Events and Event Helpers

    subscribeToUIEvents() {
        //Creation Event
        $('.content__addtask').on('click', () => this.createNewTask());

        //Taskmenu Toggling Event
        $(document).on('click', '.content__taskmenutoggle', (event) => {
            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__task').index()];
            targetTaskSubview.toggleTaskMenu();
        });

        //Delete Button Events
        $(document).on('click', '.content__taskdelete', (event) => {
            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__taskmenu').parent('.content__task').index()];
            targetTaskSubview.deleteTask();
            this.updateTasklist();
        });

        //Edit Button Events
        $(document).on('click', '.content__taskedit--startedit', (event) => {   //TODO: maybe change to event
            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__taskmenu').parent('.content__task').index()];
            targetTaskSubview.toggleEditingButtons();
            targetTaskSubview.toggleEditing();
        });
        $(document).on('click', '.content__taskedit--saveedit', (event) => {
            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__taskmenu').parent('.content__task').index()];
            targetTaskSubview.saveTaskChanges();
        });
        $(document).on('click', '.content__taskedit--savenew', (event) => {
            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__taskmenu').parent('.content__task').index()];
            let success = targetTaskSubview.saveNewTask();

            if(success)
                this.updateTasklist();
        });

        $(document).on('click', '.content__taskdone', (event) => {
            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__task').index()];
            targetTaskSubview.toggleTaskDoneState();
        })

        $(document).on('click', '.content__taskchanger', (event) => {
            let newImportance = 0;
            if($(event.target).hasClass('content__taskimportance--low')){
                newImportance = 1;
            }
            else if ($(event.target).hasClass('content__taskimportance--medium')){
                newImportance = 2;
            }
            else if ($(event.target).hasClass('content__taskimportance--high')){
                newImportance = 3;
            }

            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__taskmenu').parent('.content__task').index()];
            targetTaskSubview.changeTaskImportance(newImportance);
        })

        //Visual sugar
        $(document).on('input', '.content__taskname', (event) => this.resizeInputField(event.target));
    }

    //Visual sugar
    resizeInputField(target) {
        $(target).css({ 'width': $(target).val().length + 'ch' });
    }
}

export default ListView;