import {createElement} from '../utils.js';

const createLoadMoreButton = () => `<button class="load-more" type="button">load more</button>`;

export default class LoadMoreButtonComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadMoreButton();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
