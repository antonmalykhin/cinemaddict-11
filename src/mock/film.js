import {getRandomArrayItem, getRandomIntegerNumber} from '../utils.js';

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const Genres = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`,
];

const FilmImages = {
  'Made For Each Other': `/images/posters/made-for-each-other.png`,
  'Popeye Meets Sinbad': `/images/posters/popeye-meets-sinbad.png`,
  'Sagebrush Trail': `/images/posters/sagebrush-trail.jpg`,
  'Santa Claus Conquers The Martians': `/images/posters/santa-claus-conquers-the-martians.jpg`,
  'The Dance of Life': `/images/posters/the-dance-of-life.jpg`,
  'The Great Flamarion': `/images/posters/the-great-flamarion.jpg`,
  'The Man With The Golden Arm': `/images/posters/the-man-with-the-golden-arm.jpg`
};

const Year = {
  FROM: 1920,
  TO: 1980
};

const Rating = {
  MAX: 10,
  FIXED: 1
};

const Comments = {
  MIN: 0,
  MAX: 5
};

const Description = {
  MIN: 1,
  MAX: 5
};

const Duration = {
  MIN: 10,
  MAX: 180
};

const formatTime = (minutes) => {
  return minutes <= 60 ? `${minutes}m` : `${Math.trunc(minutes / 60)}h ${minutes % 60}m`;
};

const getRandomDescription = (count) => {
  const filmDescriptions = DESCRIPTION.split(`.`).slice(0, -1);
  return new Array(count).fill(``).map(() => `${getRandomArrayItem(filmDescriptions)}.`).join(``);
};

const generateFilm = () => {
  const filmTitle = getRandomArrayItem(Object.keys(FilmImages));
  const filmDuration = getRandomIntegerNumber(Duration.MIN, Duration.MAX);
  const filmDescriptionLength = getRandomIntegerNumber(Description.MIN, Description.MAX);

  return {
    poster: FilmImages[filmTitle],
    title: filmTitle,
    rating: (Math.random() * Rating.MAX).toFixed(Rating.FIXED),
    year: getRandomIntegerNumber(Year.FROM, Year.TO),
    duration: formatTime(filmDuration),
    genre: getRandomArrayItem(Genres),
    description: getRandomDescription(filmDescriptionLength),
    comments: getRandomIntegerNumber(Comments.MIN, Comments.MAX)
  };
};

const generateFilms = (count) => {
  return new Array(count).fill(``).map(generateFilm);
};

export {generateFilm, generateFilms};
