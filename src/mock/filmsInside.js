import {getRandomIntegerNumber} from '../utils/common.js';

const filmsInsideRange = {
  FROM: 1000,
  TO: 500000
};

const generateFilmsInside = () => {
  return getRandomIntegerNumber(filmsInsideRange.FROM, filmsInsideRange.TO);
};

export {generateFilmsInside};
