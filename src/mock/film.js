import {getRandomArrayItem, getRandomIntegerNumber} from '../utils/common.js';
import {generateComments} from './comments.js';

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const Genres = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`,
];

const Countries = [
  `USA`,
  `UK`,
  `Belgium`,
  `France`,
  `Germany`
];

const FilmImages = {
  'Made For Each Other': `./images/posters/made-for-each-other.png`,
  'Popeye Meets Sinbad': `./images/posters/popeye-meets-sinbad.png`,
  'Sagebrush Trail': `./images/posters/sagebrush-trail.jpg`,
  'Santa Claus Conquers The Martians': `./images/posters/santa-claus-conquers-the-martians.jpg`,
  'The Dance of Life': `./images/posters/the-dance-of-life.jpg`,
  'The Great Flamarion': `./images/posters/the-great-flamarion.jpg`,
  'The Man With The Golden Arm': `./images/posters/the-man-with-the-golden-arm.jpg`
};

const ProductionTeams = [{
  director: `Anthony Mann`,
  writers: `Anne Wigton, Heinz Herald, Richard Weil`,
  actors: `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`
}, {
  director: `Sam Esmail`,
  writers: `Sam Esmail, Randolph Leon, Adam Penn`,
  actors: `Rami Malek, Christian Slater, Carly Chaikin`
}, {
  director: `Francis Ford Coppola`,
  writers: `Mario Puzo, Francis Ford Coppola`,
  actors: `Marlon Brando, Al Pacino, James Caan`
}, {
  director: `Christopher Nolan`,
  writers: `Jonathan Nolan, Christopher Nolan`,
  actors: `Matthew McConaughey, Anne Hathaway, Jessica Chastain`
}];

const Dates = {
  START: new Date(`01.01.1920`),
  END: new Date(`01.01.1980`)
};

const Rating = {
  MAX: 10,
  FIXED: 1
};

const Comments = {
  MIN: 0,
  MAX: 10
};

const Description = {
  MIN: 1,
  MAX: 5
};

const Duration = {
  MIN: 10,
  MAX: 180
};

const getRandomDescription = (count) => {
  const filmDescriptions = DESCRIPTION.split(`.`).slice(0, -1);
  return new Array(count).fill(``).map(() => `${getRandomArrayItem(filmDescriptions)}.`).join(``);
};

const getGenres = (genres) => {
  const newGenres = [];
  genres.forEach((it) => {
    if (Math.random() > 0.5) {
      newGenres.push(it);
    }
  });
  return newGenres;
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateFilm = () => {
  const filmTitle = getRandomArrayItem(Object.keys(FilmImages));
  const filmDuration = getRandomIntegerNumber(Duration.MIN, Duration.MAX);
  const filmDescriptionLength = getRandomIntegerNumber(Description.MIN, Description.MAX);
  const filmReleaseRaw = getRandomDate(Dates.START, Dates.END);

  return {
    id: String(new Date() + Math.random()),
    poster: FilmImages[filmTitle],
    ageRate: getRandomIntegerNumber(0, 18),
    title: filmTitle,
    productionTeam: getRandomArrayItem(ProductionTeams),
    originalTitle: filmTitle,
    rating: (Math.random() * Rating.MAX).toFixed(Rating.FIXED),
    release: filmReleaseRaw,
    runtime: filmDuration,
    genres: getGenres(Genres),
    country: getRandomArrayItem(Countries),
    description: getRandomDescription(filmDescriptionLength),
    comments: generateComments(getRandomIntegerNumber(Comments.MIN, Comments.MAX)),
    inWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5
  };
};

const generateFilms = (count) => {
  return new Array(count).fill(``).map(generateFilm);
};

export {generateFilm, generateFilms};
