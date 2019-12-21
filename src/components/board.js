import AbstractComponent from "./abstract-component";

const createBoardTemplate = () =>
  (`<section class="board container"></section>`);

export default class BoardComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createBoardTemplate();
  }
}
