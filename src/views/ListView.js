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
        this.taskSubViews.unshift(newTaskSubView);

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
            let savedTask = new TaskSubView(this.taskController, task, false);
            this.taskSubViews.push(savedTask);
        });

        this.taskSubViews = this.sortTaskSubviewsByImportance(this.taskSubViews);
        //Display all task subviews
        this.taskSubViews.forEach(task => {
            console.log(task.taskModel);
            $('.content__tasklist').append(task.htmlElement);
        })

        if (!this.temporaryTaskExists)
            this.toggleAddNewTaskButtonDisabled();
    }

    sortTaskSubviewsByImportance(taskSubViews) {
        let doneTasks = [];
        let notDoneTasks = [];

        taskSubViews.forEach(task => {
            if (task.taskModel.isDone)
                doneTasks.push(task);
            else
                notDoneTasks.push(task);
        })

        doneTasks.sort((a, b) => {
            return b.taskModel.importance - a.taskModel.importance;
        })

        notDoneTasks.sort((a, b) => {
            return b.taskModel.importance - a.taskModel.importance;
        })

        console.dir(`Not done Tasks: ${notDoneTasks.length}`);
        console.dir(`Done Tasks: ${doneTasks.length}`);

        taskSubViews = [...notDoneTasks, ...doneTasks];
        return taskSubViews;
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
            let success = targetTaskSubview.saveTaskChanges();
            if (success)
                this.updateTasklist();
        });
        $(document).on('click', '.content__taskedit--savenew', (event) => {
            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__taskmenu').parent('.content__task').index()];
            let success = targetTaskSubview.saveNewTask();

            if (success)
                this.updateTasklist();
        });

        $(document).on('click', '.content__taskdone', (event) => {
            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__task').index()];
            let success = targetTaskSubview.toggleTaskDoneState();
            if (success)
                this.updateTasklist();
        })

        $(document).on('click', '.content__taskchanger', (event) => {
            let newImportance = 0;
            if ($(event.target).hasClass('content__taskimportance--low')) {
                newImportance = 1;
            }
            else if ($(event.target).hasClass('content__taskimportance--medium')) {
                newImportance = 2;
            }
            else if ($(event.target).hasClass('content__taskimportance--high')) {
                newImportance = 3;
            }

            let targetTaskSubview = this.taskSubViews[$(event.target).parent('.content__taskmenu').parent('.content__task').index()];
            let success = targetTaskSubview.changeTaskImportance(newImportance);
            if (success)
                this.updateTasklist();
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