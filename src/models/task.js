export default class TaskModel {
  constructor(data) {
    this.id = data[`id`];
    this.color = data[`color`];
    this.description = data[`description`];
    this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    this.tags = new Set(data[`tags`]);
    this.repeatingDays = data[`repeating_days`];
    this.isArchived = Boolean(data[`is_archived`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'color': this.color,
      'description': this.description,
      'due_date': this.dueDate ? this.dueDate.toISOString() : null,
      'tags': Array.from(this.tags),
      'repeating_days': this.repeatingDays,
      'is_archived': this.isArchived,
      'is_favorite': this.isFavorite,
    };
  }

  static parseTask(data) {
    return new TaskModel(data);
  }

  static parseTasks(data) {
    return data.map(TaskModel.parseTask);
  }

  static clone(data) {
    return new TaskModel(data.toRAW());
  }
}
