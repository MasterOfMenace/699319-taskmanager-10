import {renderElement, RenderPosition} from './utils/render.js';
import {generateTasks} from './mocks/task.js';

import SiteMenu from './components/menu.js';
import BoardController from './controllers/board-controller.js';
import BoardComponent from './components/board.js';
import TasksModel from './models/task';
import FilterController from './controllers/filter-controller';

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

menuComponent.getElement().querySelector(`.control__label--new-task`).addEventListener(`click`, () => {
  boardController.createTask();
});

renderElement(pageControl, menuComponent, RenderPosition.BEFOREEND);
renderElement(pageMain, boardComponent, RenderPosition.BEFOREEND);


boardController.render(tasks);
