import moment from 'moment';
import {ProfileRank} from '../const.js';

export const getRandomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const toTitleCase = (word) => {
  return word[0].toUpperCase() + word.slice(1);
};

export const getRandomDateTime = () => {
  const targetDateTime = new Date();
  targetDateTime.setDate(targetDateTime.getDate() - getRandomIntegerNumber(0, 10));
  targetDateTime.setHours(targetDateTime.getHours() - getRandomIntegerNumber(0, 24));
  targetDateTime.setMinutes(targetDateTime.getMinutes() - getRandomIntegerNumber(0, 60));
  return targetDateTime;
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatTime = (time) => {
  const duration = moment.duration(time, `minutes`);
  const hours = duration.hours();
  const minutes = duration.minutes();

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const getFormattedTime = (time) => {
  const duration = moment.duration(time, `minutes`);

  return {hours: Math.floor(duration.asHours()), minutes: duration.minutes()};
};

export const formatCommentDateTime = (date, timeFrame) => {
  return moment().diff(moment(date), `days`) < timeFrame ? moment(date).fromNow() : moment(date).format(`YYYY/MM/DD hh:mm`);
};

export const sortMinToMax = (a, b) => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
};

export const getUserRank = (watchedFilmsCount) => {
  if (watchedFilmsCount > 0 && watchedFilmsCount <= 10) {
    return ProfileRank.NOVICE;
  } else if (watchedFilmsCount > 10 && watchedFilmsCount <= 20) {
    return ProfileRank.FAN;
  } else if (watchedFilmsCount > 20) {
    return ProfileRank.MOVIE_BUFF;
  } else {
    return ``;
  }
};
