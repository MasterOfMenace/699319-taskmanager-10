import AbstractComponent from './abstract-component.js';

const createTaskListTemplate = () =>
  (`<div class="board__tasks"></div>`);

export default class TaskListComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createTaskListTemplate();
  }
}
