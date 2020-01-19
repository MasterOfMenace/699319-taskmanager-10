import moment from 'moment';

export const getBoolean = () => {
  return Math.random() > 0.5;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomDate = () => {
  const date = new Date();
  const sign = getBoolean() ? 1 : -1;
  const diff = sign * getRandomNumber(0, 7);

  date.setDate(date.getDate() + diff);

  return date;
};

export const getRandomValue = (array) => {
  return array[getRandomNumber(0, array.length - 1)];
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};
