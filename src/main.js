import {renderElement, RenderPosition} from './utils/render.js';
import {generateTasks} from './mocks/task.js';

import SiteMenu, {MenuItem} from './components/menu.js';
import BoardController from './controllers/board-controller.js';
import BoardComponent from './components/board.js';
import TasksModel from './models/task';
import FilterController from './controllers/filter-controller';
import StatisticsComponent from './components/statistics.js';

const TASK_COUNT = 22;

const pageMain = document.querySelector(`.main`);
const pageControl = pageMain.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const menuComponent = new SiteMenu();
const filterController = new FilterController(pageMain, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);

// const statisticsComponent = new StatisticsComponent();

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

renderElement(pageControl, menuComponent, RenderPosition.BEFOREEND);
renderElement(pageMain, boardComponent, RenderPosition.BEFOREEND);
renderElement(pageMain, statisticsComponent, RenderPosition.BEFOREEND);

statisticsComponent.hide();
boardController.render(tasks);

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_TASK:
      menuComponent.setActiveItem(MenuItem.ADD_TASK);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.TASKS:
      menuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      break;
    case MenuItem.STATISTICS:
      menuComponent.setActiveItem(MenuItem.STATISTICS);
      statisticsComponent.show();
      boardController.hide();
      break;
  }
});

