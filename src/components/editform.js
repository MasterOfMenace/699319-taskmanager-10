import {Colors, Days} from '../constants.js';
import {formatTime, formatDate} from '../utils/utils.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const ButtonsData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createColorsMarkup = (colors, currentColor) => {
  return colors.map((color) => {
    return (
      `<input
      type="radio"
      id="color-${color}-4"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${currentColor === color ? `checked` : ``}
    />
    <label
      for="color-${color}-4"
      class="card__color card__color--${color}"
      >${color}</label
    >`
    );
  }).join(`\n`);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days.map((day) => {
    const isChecked = repeatingDays[day];

    return (
      `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day}-4"
      name="repeat"
      value="${day}"
      ${isChecked ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-4"
      >${day}</label
      >`
    );
  }).join(`\n`);
};

const createHashtagsMarkup = (tags) => {
  return tags.map((tag) => {
    return (
      `<span class="card__hashtag-inner">
        <input
          type="hidden"
          name="hashtag"
          value="${tag}"
          class="card__hashtag-hidden-input"
        />
        <p class="card__hashtag-name">
          #${tag}
        </p>
        <button type="button" class="card__hashtag-delete">
          delete
        </button>
      </span>`
    );
  }).join(`\n`);
};

const createTaskEditFormTemplate = (task, options = {}) => {
  const {dueDate} = task;
  const {color, tags, isDateShowing, isRepeatingTask, currentRepeatingDays, currentDescription, externalData} = options;
  const description = currentDescription;
  const isExpired = dueDate instanceof Date && dueDate < Date.now();

  const date = (isDateShowing && dueDate) ? formatDate(dueDate, `DD MMMM`) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const isRepeating = (repeatingDays) => Object.values(repeatingDays).some(Boolean);

  const isBlockSaveButton = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(currentRepeatingDays));

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colors = createColorsMarkup(Colors, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(Days, currentRepeatingDays);
  const hashtagsMarkup = createHashtagsMarkup(tags);

  const {saveButtonText, deleteButtonText} = externalData;

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <label>
            <textarea
              class="card__text"
              placeholder="Start typing your text here..."
              name="text"
              minlength="1"
              maxlength="140"
            >${description}</textarea>
          </label>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
              </button>

              ${isDateShowing ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>` : ``}

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
              </button>

              ${isRepeatingTask ? `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                  ${repeatingDaysMarkup}
                  </div>
                </fieldset>` : ``}
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
              ${hashtagsMarkup ? hashtagsMarkup : ``}
              </div>

              <label>
                <input
                  type="text"
                  class="card__hashtag-input"
                  name="hashtag-input"
                  placeholder="Type new hashtag here"
                />
              </label>
            </div>
          </div>

          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              ${colors}
            </div>
          </div>
        </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
          <button class="card__delete" type="button">${deleteButtonText}</button>
        </div>
      </div>
    </form>
  </article>`
  );
};

export default class TaskEditFormComponent extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._currentRepeatingDays = Object.assign({}, task.repeatingDays);
    this._tags = Array.from(task.tags);
    this._color = task.color;
    this._currentDescription = task.description;

    this._externalData = ButtonsData;

    this._flatpickr = null;
    this._formSubmitHandler = null;
    this._deleteButtonClickHandler = null;
    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditFormTemplate(this._task, {
      color: this._color,
      tags: this._tags,
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      currentRepeatingDays: this._currentRepeatingDays,
      currentDescription: this._currentDescription,
      externalData: this._externalData
    });
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, ButtonsData, data);
    this.rerender();
  }

  setFormSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._formSubmitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setFormSubmitHandler(this._formSubmitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._currentRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;

    this.rerender();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);

      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate,
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__colors-wrap`)
      .addEventListener(`change`, (evt) => {
        this._color = evt.target.value;
        this.rerender();
      });

    element.querySelector(`.card__hashtag-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.classList.contains(`card__hashtag-delete`)) {
          const hashtagValue = evt.target.parentNode.firstElementChild.value;
          const index = this._tags.findIndex((it) => it === hashtagValue);
          this._tags = this._tags.slice(0, index).concat(this._tags.slice(index + 1));
          this.rerender();
        }
      });

    element.querySelector(`.card__hashtag-input`)
      .addEventListener(`change`, (evt) => {
        const newHashtag = evt.target.value;
        this._tags.push(newHashtag);
        this.rerender();
      });

    element.querySelector(`.card__text`)
      .addEventListener(`input`, (evt) => {
        this._currentDescription = evt.target.value;
      });

    element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;
      this.rerender();
    });

    element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this._isRepeatingTask = !this._isRepeatingTask;
      this.rerender();
    });

    const repeatingDays = element.querySelector(`.card__repeat-days`);
    if (repeatingDays) {
      repeatingDays.addEventListener(`change`, (evt) => {
        this._currentRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
      });
    }
  }
}
