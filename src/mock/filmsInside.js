import {getRandomArrayItem} from '../utils.js';

const filmsInsideRange = {
  FROM: 1000,
  TO: 500000
};

const generateFilmsInside = () => {
  return getRandomArrayItem(filmsInsideRange);
};

export {generateFilmsInside};
