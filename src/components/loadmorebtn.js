import AbstractComponent from './abstract-component.js';

const createLoadMoreButton = () => `<button class="load-more" type="button">load more</button>`;

export default class LoadMoreButtonComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createLoadMoreButton();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
