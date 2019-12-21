import {renderElement, RenderPosition} from '../utils/render.js';

import TaskComponent from '../components/card.js';
import TaskEditFormComponent from '../components/editform.js';
import TaskListComponent from '../components/tasklist.js';
import LoadMoreButtonComponent from '../components/loadmorebtn.js';
import SortComponent from '../components/sort.js';

const SHOW_ON_START_COUNT = 8;
const SHOW_BY_BUTTON_COUNT = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditFormComponent(task);

  const editButtonClickHandler = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };
  const formSubmitHandler = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  taskComponent.setEditButtonClickHandler(editButtonClickHandler);
  taskEditComponent.setFormSubmitHandler(formSubmitHandler);

  renderElement(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
    this._taskListComponent = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();

    renderElement(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderElement(container, this._taskListComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._taskListComponent.getElement();

    let nowShown = SHOW_ON_START_COUNT;
    tasks.slice(0, nowShown).forEach((task) => {
      renderTask(taskListElement, task);
    });

    renderElement(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const loadMoreBtnClickHandler = () => {
      tasks.slice(nowShown, nowShown = nowShown + SHOW_BY_BUTTON_COUNT).forEach((task) => {
        renderTask(taskListElement, task);
      });

      if (nowShown >= tasks.length) {
        this._loadMoreButtonComponent.getElement().remove();
        this._loadMoreButtonComponent.removeElement();
      }
    };

    this._loadMoreButtonComponent.setClickHandler(loadMoreBtnClickHandler);
  }


}
