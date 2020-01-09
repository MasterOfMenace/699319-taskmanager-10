import {renderElement, RenderPosition, replace} from '../utils/render';
import TaskComponent from "../components/card";
import TaskEditFormComponent from "../components/editform";
import {Colors} from '../constants';

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

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._viewMode = ViewMode.DEFAULT;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._taskComponent = null;
    this._taskEditComponent = null;
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._viewMode = mode;
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditFormComponent(task);

    const editButtonClickHandler = () => {
      this._replaceTaskToEdit();
    };

    const formSubmitHandler = (evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
    };

    this._taskComponent.setEditButtonClickHandler(editButtonClickHandler);
    this._taskEditComponent.setFormSubmitHandler(formSubmitHandler);

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    this._taskComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

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
  }

  destroy() {
    this._taskComponent.getElement().remove();
    this._taskComponent.removeElement();
    this._taskEditComponent.getElement().remove();
    this._taskEditComponent.removeElement();
  }

  setDefaultView() {
    if (this._viewMode !== ViewMode.DEFAULT) {
      this._replaceEditToTask();
    }
  }
}
