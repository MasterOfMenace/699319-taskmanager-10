import AbstractComponent from './abstract-component.js';

const createTaskListTemplate = () =>
  (`<section class="board container">
  <div class="board__filter-list">
    <a href="#" class="board__filter">SORT BY DEFAULT</a>
    <a href="#" class="board__filter">SORT BY DATE up</a>
    <a href="#" class="board__filter">SORT BY DATE down</a>
  </div>

  <div class="board__tasks">
  </div>
</section>`);

export default class TaskListComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createTaskListTemplate();
  }
}
