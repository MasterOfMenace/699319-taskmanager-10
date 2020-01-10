import {FilterType} from '../constants';

export const getNotArchivedTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

export const getArchivedTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getFavoritesTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return dueDate.getDate() < date.getDate();
  });
};

export const getTodayTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return dueDate.getDate() === date.getDate();
  });
};

export const getTasksWithTags = (tasks) => {
  return tasks.filter((task) => task.tags.size);
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => Object.values(task.repeatingDays).some(Boolean));
};

export const getTasksByFilter = (tasks, filterType) => {
  const now = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchivedTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchivedTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoritesTasks(getNotArchivedTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchivedTasks(tasks), now);
    case FilterType.TODAY:
      return getTodayTasks(getNotArchivedTasks(tasks), now);
    case FilterType.TAGS:
      return getTasksWithTags(getNotArchivedTasks(tasks));
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchivedTasks(tasks));
  }

  return tasks;
};
