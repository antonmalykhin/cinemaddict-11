import {getRandomIntegerNumber} from '../utils.js';

const filmsInsideRange = {
  FROM: 1000,
  TO: 500000
};

const generateFilmsInside = () => {
  return getRandomIntegerNumber(filmsInsideRange.FROM, filmsInsideRange.TO);
};

export {generateFilmsInside};
