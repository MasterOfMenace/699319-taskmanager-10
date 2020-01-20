import {renderElement, RenderPosition} from '../utils/render.js';

import TaskController, {EmptyTask, ViewMode} from '../controllers/task-controller';
import TaskListComponent from '../components/tasklist.js';
import LoadMoreButtonComponent from '../components/loadmorebtn.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoTasksComponent from '../components/no-tasks.js';

const SHOW_ON_START_COUNT = 8;
const SHOW_BY_BUTTON_COUNT = 8;

const renderTask = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task, ViewMode.DEFAULT);
    return taskController;
  });
};

export default class BoardController {
  constructor(container, tasksModel) {
    this._container = container;

    this._tasksModel = tasksModel;
    this._showedTasksControllers = [];
    this._showingTasksCount = SHOW_ON_START_COUNT;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._taskListComponent = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._creatingTask = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  render() {
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      renderElement(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderElement(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderElement(container, this._taskListComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.DEFAULT:
          this._showingTasksCount = SHOW_ON_START_COUNT;
          sortedTasks = tasks.slice(0, this._showingTasksCount);
          break;
        case SortType.DATE_UP:
          sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
      }

      this._removeTasks();
      this._renderTasks(sortedTasks);

      if (sortType === SortType.DEFAULT) {
        this._renderLoadMoreButton();
      } else {
        this._loadMoreButtonComponent.getElement().remove();
        this._loadMoreButtonComponent.removeElement();
      }

    });
  }

  _renderLoadMoreButton() {
    this._loadMoreButtonComponent.getElement().remove();
    this._loadMoreButtonComponent.removeElement();

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();

    renderElement(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const loadMoreBtnClickHandler = () => {
      const taskListElement = this._taskListComponent.getElement();
      const tasks = this._tasksModel.getTasks();

      const newTasks = renderTask(taskListElement, tasks.slice(this._showingTasksCount, this._showingTasksCount = this._showingTasksCount + SHOW_BY_BUTTON_COUNT), this._onDataChange, this._onViewChange);

      this._showedTasksControllers = this._showedTasksControllers.concat(newTasks);

      if (this._showingTasksCount >= tasks.length) {
        this._loadMoreButtonComponent.getElement().remove();
        this._loadMoreButtonComponent.removeElement();
      }
    };

    this._loadMoreButtonComponent.setClickHandler(loadMoreBtnClickHandler);
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._taskListComponent.getElement();

    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, ViewMode.ADDING);
  }

  _removeTasks() {
    this._showedTasksControllers.forEach((controller) => controller.destroy());
    this._showedTasksControllers = [];
  }

  _renderTasks(tasks) {
    const taskListElement = this._taskListComponent.getElement();

    const newTasks = renderTask(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTasksControllers = this._showedTasksControllers.concat(newTasks);
    this._showingTasksCount = this._showedTasksControllers.length;
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._removeTasks();
        this._renderTasks(this._tasksModel.getTasks().slice(0, this._showingTasksCount));
        this._renderLoadMoreButton();
      } else {
        this._tasksModel.addTask(newData);
        taskController.render(newData, ViewMode.DEFAULT);

        this._showedTasksControllers = [].concat(taskController, this._showedTasksControllers);
        this._showingTasksCount = this._showedTasksControllers.length;
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._removeTasks();
      this._renderTasks(this._tasksModel.getTasks().slice(0, this._showingTasksCount));
      this._renderLoadMoreButton();
    } else {
      const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

      if (isSuccess) {
        taskController.render(newData, ViewMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedTasksControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onFilterChange() {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, SHOW_ON_START_COUNT));
    this._renderLoadMoreButton();
  }
}
