import {MonthNames} from '../constants.js';
import {formatTime} from '../utils/utils.js';
import AbstractComponent from './abstract-component.js';

const createHashtagsMarkup = (hashtags) => {
  return hashtags.map((hashtag) => {
    return (
      `<span class="card__hashtag-inner">
        <span class="card__hashtag-name">
          #${hashtag}
        </span>
      </span>`
    );
  }).join(`\n`);
};

const createTaskTemplate = (task) => {
  const {description, tags, dueDate, color, repeatingDays, isFavorite, isArchive} = task; // получаем из объекта

  const isExpired = dueDate instanceof Date && dueDate < Date.now(); // проверяем на истекшую дату
  const isDateShowing = !!dueDate; // если даты нет, не показываем

  const date = isDateShowing ? `${dueDate.getDate()} ${MonthNames[dueDate.getMonth()]}` : ``; // если дата есть, то показываем число и месяц, если нет - ничего
  const time = isDateShowing ? `${formatTime(dueDate)}` : ``; // если дата есть, показываем время

  const hashtags = createHashtagsMarkup(Array.from(tags));

  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const favorite = isFavorite ? `card__btn--disabled` : ``;
  const archived = isArchive ? `card__btn--disabled` : ``;

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive ${archived}">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites ${favorite}"
          >
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <p class="card__text">${description}</p>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${date}</span>
                  <span class="card__time">${time}</span>
                </p>
              </div>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
                ${hashtags}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>`
  );
};

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  }
}
