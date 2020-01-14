import AbstractComponent from "./abstract-component";

const createNoTasKsTemplate = () => {
  return (
    `<section class="board container">
    <p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>
  </section>`
  );
};

export default class NoTasksComponent extends AbstractComponent {
  getTemplate() {
    return createNoTasKsTemplate();
  }
}
