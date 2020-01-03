import {renderElement, RenderPosition} from './utils/render.js';
import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filter.js';

import SiteMenu from './components/menu.js';
import FilterComponent from './components/filter.js';
import BoardController from './controllers/board-controller.js';
import BoardComponent from './components/board.js';

const TASK_COUNT = 22;

const getCountForFilters = (tasks) => {
  const allCount = tasks.length;

  let overdueCount = 0;
  let todayCount = 0;
  let favCount = 0;
  let repCount = 0;
  let tagsCount = 0;
  let archCount = 0;

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
    if (task.isArchive) {
      archCount++;
    }
  });

  return {
    all: allCount,
    overdue: overdueCount,
    today: todayCount,
    favorites: favCount,
    repeating: repCount,
    tags: tagsCount,
    archive: archCount,
  };
};

const pageMain = document.querySelector(`.main`);
const pageControl = pageMain.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(getCountForFilters(tasks));

const menuComponent = new SiteMenu();
const filterComponent = new FilterComponent(filters);
const boardComponent = new BoardComponent();

renderElement(pageControl, menuComponent, RenderPosition.BEFOREEND);
renderElement(pageMain, filterComponent, RenderPosition.BEFOREEND);
renderElement(pageMain, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent);

boardController.render(tasks);
