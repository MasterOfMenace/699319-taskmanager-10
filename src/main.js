import {createMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createTaskListTemplate} from './components/tasklist.js';
import {createCardEditFormTemplate} from './components/editform.js';
import {generateCardTemplate} from './components/card.js';
import {createLoadMoreButton} from './components/loadmorebtn.js';
import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filter.js';

const TASK_COUNT = 22;
const SHOW_ON_START_COUNT = 8;
const SHOW_BY_BUTTON_COUNT = 8;

// получение количества карточек, попадающих под фильтр
/*
`all` - все карточки,
 `overdue`- если дата < сегодня,
 `today` - если дата = сегодня,
 `favorites` - isFavorites,
 `repeating` - если есть repeatClass,
 `tags` - если есть тэги,
 `archive` - isArchive */

const getCount = (cards) => {
  const allCount = cards.length;

  let overdueCount = 0;
  let todayCount = 0;
  let favCount = 0;
  let repCount = 0;
  let tagsCount = 0;
  cards.forEach((card) => {
    if (card.dueDate && card.dueDate < Date.now()) {
      overdueCount++;
    }
    if (card.dueDate && card.dueDate === new Date()) {
      todayCount++;
    }
    if (card.isFavorite) {
      favCount++;
    }
    if (Object.values(card.repeatingDays).some((val) => val === true)) {
      repCount++;
    }
    if (card.tags.size !== 0) {
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

const renderElement = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const pageMain = document.querySelector(`.main`);
const pageControl = pageMain.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(getCount(tasks));

renderElement(pageControl, createMenuTemplate());
renderElement(pageMain, createFilterTemplate(filters));
renderElement(pageMain, createTaskListTemplate());

const board = pageMain.querySelector(`.board`);
const taskList = board.querySelector(`.board__tasks`);

renderElement(taskList, createCardEditFormTemplate(tasks[0]));

let nowShown = SHOW_ON_START_COUNT;
tasks.slice(1, nowShown).forEach((task) => {
  renderElement(taskList, generateCardTemplate(task));
});

renderElement(board, createLoadMoreButton());
const loadMoreBtn = board.querySelector(`.load-more`);
loadMoreBtn.addEventListener(`click`, () => {
  tasks.slice(nowShown, nowShown = nowShown + SHOW_BY_BUTTON_COUNT).forEach((task) => {
    renderElement(taskList, generateCardTemplate(task));
  });

  if (nowShown >= TASK_COUNT) {
    loadMoreBtn.remove();
  }
});
