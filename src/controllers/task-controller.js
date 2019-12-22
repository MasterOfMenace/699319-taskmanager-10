import {renderElement, RenderPosition} from '../utils/render';
import TaskComponent from "../components/card";
import TaskEditFormComponent from "../components/editform";

export default class TaskController {
  constructor(container, onDataChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._taskComponent = null;
    this._taskEditComponent = null;
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
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

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    // if (oldTaskEditComponent && oldTaskComponent) {
    //   replace(this._taskComponent, oldTaskComponent);
    //   replace(this._taskEditComponent, oldTaskEditComponent);
    // } else {
    //   render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
    // }

    if (oldTaskEditComponent && oldTaskComponent) {
      // const parent = oldTaskComponent.getElement().parentElement;
      // console.log(parent);
      // parent.replaceChild(this._taskComponent.getElement(), oldTaskComponent.getElement());
      // parent.replaceChild(this._taskEditComponent.getElement(), oldTaskEditComponent.getElement());
      oldTaskComponent.getElement().replaceWith(this._taskComponent.getElement());
      oldTaskEditComponent.getElement().replaceWith(this._taskEditComponent.getElement());
    } else {
      renderElement(this._container, this._taskComponent, RenderPosition.BEFOREEND);
    }
  }
}
