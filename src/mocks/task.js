import {Hashtags, Colors} from '../constants.js';
import {getBoolean} from '../utils.js';
import {getRandomValue} from '../utils.js';
import {getRandomDate} from '../utils.js';


const DescriptionItems = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];

const generateHashtags = (hashtags) => {
  return hashtags.filter(() => getBoolean()).slice(0, 3);
};

function RepeatingDays() {
  this.mo = getBoolean();
  this.tu = getBoolean();
  this.we = getBoolean();
  this.th = getBoolean();
  this.fr = getBoolean();
  this.sa = getBoolean();
  this.su = getBoolean();
}

const createTask = () => {
  const dueDate = getBoolean() ? null : getRandomDate();

  return {
    description: getRandomValue(DescriptionItems),
    dueDate,
    repeatingDays: new RepeatingDays(),
    tags: new Set(generateHashtags(Hashtags)),
    color: getRandomValue(Colors),
    isFavorite: getBoolean(),
    isArchive: getBoolean()
  };
};

const generateTasks = (count) => {
  return new Array(count).fill(``).map(createTask);
};

export {generateTasks};
