import {getRandomArrayItem} from '../utils/common.js';

const Users = [
  `Movie Buff`,
  `Tim Macoveev`,
  `John Doe`
];

const generateUser = () => {
  return {
    userName: getRandomArrayItem(Users),
    avatar: `images/bitmap@2x.png`
  };
};

export {generateUser};
