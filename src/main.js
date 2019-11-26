const TASK_COUNT = 3;

import {createMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createTaskListTemplate} from './components/tasklist.js';
import {createCardAddFormTemplate} from './components/addform.js';
import {createCardTemplate} from './components/card.js';
import {createLoadMoreButton} from './components/loadmorebtn.js';

const renderElement = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderTasks = (count, container) => {
  for (let i = 0; i < count; i++) {
    renderElement(container, createCardTemplate());
  }
};

const pageMain = document.querySelector(`.main`);
const pageControl = pageMain.querySelector(`.main__control`);
renderElement(pageControl, createMenuTemplate());
renderElement(pageMain, createFilterTemplate());
renderElement(pageMain, createTaskListTemplate());

const board = pageMain.querySelector(`.board`);
const taskList = board.querySelector(`.board__tasks`);
renderElement(taskList, createCardAddFormTemplate());

renderTasks(TASK_COUNT, taskList);

renderElement(board, createLoadMoreButton());
