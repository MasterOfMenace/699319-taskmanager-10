import {renderElement, RenderPosition} from '../utils/render';
import TaskComponent from "../components/card";
import TaskEditFormComponent from "../components/editform";

export default class TaskController {
  constructor(container) {
    this._container = container;

    this._taskComponent = null;
    this._taskEditComponent = null;
  }

  render(task) {
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditFormComponent(task);

    const editButtonClickHandler = () => {
      this._container.replaceChild(this._taskEditComponent.getElement(), this._taskComponent.getElement());
    };
    const formSubmitHandler = () => {
      this._container.replaceChild(this._taskComponent.getElement(), this._taskEditComponent.getElement());
    };

    this._taskComponent.setEditButtonClickHandler(editButtonClickHandler);
    this._taskEditComponent.setFormSubmitHandler(formSubmitHandler);

    renderElement(this._container, this._taskComponent, RenderPosition.BEFOREEND);
  }
}
