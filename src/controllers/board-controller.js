import {renderElement, RenderPosition} from '../utils/render.js';

import TaskController from '../controllers/task-controller';
import TaskListComponent from '../components/tasklist.js';
import LoadMoreButtonComponent from '../components/loadmorebtn.js';
import SortComponent from '../components/sort.js';

const SHOW_ON_START_COUNT = 8;
const SHOW_BY_BUTTON_COUNT = 8;

const renderTask = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);
    return taskController;
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._tasks = [];
    this._showedTasksControllers = [];
    this._showingTasksCount = SHOW_ON_START_COUNT;
    this._sortComponent = new SortComponent();
    this._taskListComponent = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(tasks) {
    const container = this._container.getElement();
    this._tasks = tasks;

    renderElement(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderElement(container, this._taskListComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._taskListComponent.getElement();

    const newTasks = renderTask(taskListElement, this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);

    this._showedTasksControllers = this._showedTasksControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();

    renderElement(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const loadMoreBtnClickHandler = () => {
      const taskListElement = this._taskListComponent.getElement();

      const newTasks = renderTask(taskListElement, this._tasks.slice(this._showingTasksCount, this._showingTasksCount = this._showingTasksCount + SHOW_BY_BUTTON_COUNT), this._onDataChange, this._onViewChange);

      this._showedTasksControllers = this._showedTasksControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        this._loadMoreButtonComponent.getElement().remove();
        this._loadMoreButtonComponent.removeElement();
      }
    };

    this._loadMoreButtonComponent.setClickHandler(loadMoreBtnClickHandler);
  }

  _onDataChange(taskController, oldData, newData) {
    // console.log(this._tasks);
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTasksControllers.forEach((it) => {
      it.setDefaultView();
    });
  }
}
