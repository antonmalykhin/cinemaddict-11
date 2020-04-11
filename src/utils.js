const getRandomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDateTime = () => {
  const targetDateTime = new Date();
  targetDateTime.setDate(targetDateTime.getDate() - getRandomIntegerNumber(0, 10));
  targetDateTime.setHours(targetDateTime.getHours() - getRandomIntegerNumber(0, 24));
  targetDateTime.setMinutes(targetDateTime.getMinutes() - getRandomIntegerNumber(0, 60));
  return targetDateTime;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatDate = (date) => {
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const sortMinToMax = (a, b) => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
};

export {formatDate, formatTime, getRandomArrayItem, getRandomDateTime, getRandomIntegerNumber, sortMinToMax};
