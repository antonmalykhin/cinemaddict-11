import {FilterNames} from '../const.js';

const generateFilters = () => {
  return FilterNames.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * 10)
    };
  });
};

export {generateFilters};
