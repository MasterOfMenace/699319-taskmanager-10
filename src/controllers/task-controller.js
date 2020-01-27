import {renderElement, RenderPosition, replace} from '../utils/render';
import TaskComponent from "../components/card";
import TaskEditFormComponent from "../components/editform";
import {Colors, Days} from '../constants';
import TaskModel from '../models/task';

const SHAKE_TIMEOUT = 600;

export const ViewMode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: [],
  color: Colors[0],
  isFavorite: false,
  isArchive: false,
};

const parseFormData = (formData) => {
  const repeatingDays = Days.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  const date = formData.get(`date`);

  return new TaskModel({
    'description': formData.get(`text`),
    'color': formData.get(`color`),
    'tags': formData.getAll(`hashtag`),
    'due_date': date ? new Date(date) : null,
    'repeating_days': formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    'is_favorite': false,
    'is_archived': false,
  });
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._viewMode = ViewMode.DEFAULT;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._viewMode = mode;
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditFormComponent(task);

    const editButtonClickHandler = () => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    const formSubmitHandler = (evt) => {
      evt.preventDefault();

      this._taskEditComponent.setData({
        saveButtonText: `Saving...`
      });

      const formData = this._taskEditComponent.getData();
      const data = parseFormData(formData);
      this._onDataChange(this, task, data);
    };

    this._taskComponent.setEditButtonClickHandler(editButtonClickHandler);
    this._taskEditComponent.setFormSubmitHandler(formSubmitHandler);

    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isArchived = !newTask.isArchived;
      this._onDataChange(this, task, newTask);
    });

    this._taskComponent.setFavoriteButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;
      this._onDataChange(this, task, newTask);
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._taskEditComponent.setData({
        deleteButtonText: `Deleting...`
      });

      this._onDataChange(this, task, null);
    });

    switch (mode) {
      case ViewMode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          renderElement(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case ViewMode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          oldTaskComponent.getElement().remove();
          oldTaskComponent.removeElement();
          oldTaskEditComponent.getElement().remove();
          oldTaskEditComponent.removeElement();
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  _replaceTaskToEdit() {
    this._onViewChange();

    replace(this._taskEditComponent, this._taskComponent);

    this._viewMode = ViewMode.EDIT;
  }

  _replaceEditToTask() {
    this._taskEditComponent.reset();

    replace(this._taskComponent, this._taskEditComponent);

    this._viewMode = ViewMode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscPress = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscPress) {
      if (this._viewMode === ViewMode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
    }
  }

  destroy() {
    this._taskComponent.getElement().remove();
    this._taskComponent.removeElement();
    this._taskEditComponent.getElement().remove();
    this._taskEditComponent.removeElement();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._viewMode !== ViewMode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  shake() {
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskEditComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;

      this._taskEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`
      });
    }, SHAKE_TIMEOUT);
  }
}
