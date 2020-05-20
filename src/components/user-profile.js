import AbstractComponent from './abstract-component';
import {ProfileRating} from '../const.js';

const DEFAULT_AVATAR = `bitmap@2x.png`;

const setUserRating = (watchedFilmsCount) => {
  let ratingValue;

  if (watchedFilmsCount > 0 && watchedFilmsCount <= 10) {
    ratingValue = ProfileRating.NOVICE;
  } else if (watchedFilmsCount > 10 && watchedFilmsCount <= 20) {
    ratingValue = ProfileRating.FAN;
  } else if (watchedFilmsCount > 20) {
    ratingValue = ProfileRating.MOVIE_BUFF;
  } else {
    ratingValue = ``;
  }

  return ratingValue;
};

const getWatchedFilms = (films) => {
  const initialValue = 0;

  return films.reduce((acc, film) => {
    return acc + film.isWatched;
  }, initialValue);
};

const createUserProfileTemplate = (films) => {
  const watchedFilms = getWatchedFilms(films);
  const userRating = setUserRating(watchedFilms);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRating}</p>
      <img class="profile__avatar" src="images/${DEFAULT_AVATAR}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

class UserProfile extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createUserProfileTemplate(this._films);
  }
}

export default UserProfile;
