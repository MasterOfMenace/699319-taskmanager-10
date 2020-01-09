const getBoolean = () => {
  return Math.random() > 0.5;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = () => {
  const date = new Date();
  const sign = getBoolean() ? 1 : -1;
  const diff = sign * getRandomNumber(0, 7);

  date.setDate(date.getDate() + diff);

  return date;
};

const getRandomValue = (array) => {
  return array[getRandomNumber(0, array.length - 1)];
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  const interval = date.getHours() > 11 ? `pm` : `am`;

  return `${hours}:${minutes} ${interval}`;
};

export {getBoolean, getRandomValue, getRandomDate, formatTime};