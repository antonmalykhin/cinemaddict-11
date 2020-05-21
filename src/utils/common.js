import moment from 'moment';
import {ProfileRank} from '../const.js';

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

const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

const getYear = (date) => {
  return moment(date).format(`YYYY`);
};

const formatTime = (time) => {
  const duration = moment.duration(time, `minutes`);
  const hours = duration.hours();
  const minutes = duration.minutes();

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getFormattedTime = (time) => {
  const duration = moment.duration(time, `minutes`);

  return {hours: Math.floor(duration.asHours()), minutes: duration.minutes()};
};

const formatCommentDateTime = (date, timeFrame) => {
  return moment().diff(moment(date), `days`) < timeFrame ? moment(date).fromNow() : moment(date).format(`YYYY/MM/DD hh:mm`);
};

const sortMinToMax = (a, b) => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
};

const getUserRank = (watchedFilmsCount) => {
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


export {formatDate, formatTime, getFormattedTime, formatCommentDateTime, getYear, getRandomArrayItem, getRandomDateTime, getRandomIntegerNumber, sortMinToMax, getUserRank};
