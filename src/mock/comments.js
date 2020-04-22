import {Emojis} from '../const.js';
import {getRandomArrayItem, getRandomDateTime, sortMinToMax} from '../utils/common.js';

const Comments = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];

const Names = [
  `Lars Horntveth`,
  `Martin Horntveth`,
  `Chris Illingworth`,
  `Nick Blacka`,
  `Rob Turner`,
  `Grant Russell`
];

const generateComment = () => {
  return {
    emoji: getRandomArrayItem(Emojis),
    commentText: getRandomArrayItem(Comments),
    commentAuthor: getRandomArrayItem(Names),
    date: getRandomDateTime()
  };
};

const generateComments = (count) => {
  return new Array(count).fill(``).map(generateComment).sort((a, b) => sortMinToMax(a.date, b.date));
};

export {generateComment, generateComments};
