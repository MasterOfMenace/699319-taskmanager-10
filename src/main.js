import {renderElement, RenderPosition} from './utils/render.js';
import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filter.js';

import SiteMenu from './components/menu.js';
import FilterComponent from './components/filter.js';
import TaskListComponent from './components/tasklist.js';
import TaskComponent from './components/card.js';
import LoadMoreButtonComponent from './components/loadmorebtn.js';
import TaskEditFormComponent from './components/editform.js';

const TASK_COUNT = 22;
const SHOW_ON_START_COUNT = 8;
const SHOW_BY_BUTTON_COUNT = 8;

const renderTask = (task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditFormComponent(task);

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);

  editButton.addEventListener(`click`, () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  });

  const taskEditForm = taskEditComponent.getElement().querySelector(`form`);

  taskEditForm.addEventListener(`submit`, () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  });

  renderElement(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const getCount = (tasks) => {
  const allCount = tasks.length;

  let overdueCount = 0;
  let todayCount = 0;
  let favCount = 0;
  let repCount = 0;
  let tagsCount = 0;

  tasks.forEach((task) => {
    if (task.dueDate && task.dueDate < Date.now()) {
      overdueCount++;
    }
    if (task.dueDate && task.dueDate === new Date()) {
      todayCount++;
    }
    if (task.isFavorite) {
      favCount++;
    }
    if (Object.values(task.repeatingDays).some((val) => val === true)) {
      repCount++;
    }
    if (task.tags.size !== 0) {
      tagsCount++;
    }
  });

  return {
    all: allCount,
    overdue: overdueCount,
    today: todayCount,
    favorites: favCount,
    repeating: repCount,
    tags: tagsCount,
  };
};

const pageMain = document.querySelector(`.main`);
const pageControl = pageMain.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(getCount(tasks));

const menuComponent = new SiteMenu();
const filterComponent = new FilterComponent(filters);
const boardComponent = new TaskListComponent();
const loadMoreBtnComponent = new LoadMoreButtonComponent();

renderElement(pageControl, menuComponent, RenderPosition.BEFOREEND);
renderElement(pageMain, filterComponent, RenderPosition.BEFOREEND);
renderElement(pageMain, boardComponent, RenderPosition.BEFOREEND);

const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

let nowShown = SHOW_ON_START_COUNT;
tasks.slice(0, nowShown).forEach((task) => {
  renderTask(task);
});

renderElement(boardComponent.getElement(), loadMoreBtnComponent, RenderPosition.BEFOREEND);
const loadMoreBtn = boardComponent.getElement().querySelector(`.load-more`);

loadMoreBtn.addEventListener(`click`, () => {
  loadMoreBtnComponent.getElement().addEventListener(`click`, () => {
    tasks.slice(nowShown, nowShown = nowShown + SHOW_BY_BUTTON_COUNT).forEach((task) => {
      renderTask(task);
    });

    if (nowShown >= TASK_COUNT) {
      loadMoreBtnComponent.getElement().remove();
      loadMoreBtnComponent.removeElement();
    }
  });
});
