import AbstractComponent from './abstract-component.js';
import {MonthNames} from '../const.js';

const DescriptionSettings = {
  MAX_LENGTH: 140,
  SPLIT_LENGTH: 139
};

const createButtonTemplate = (name, className, isActive = true) => {
  return `<button class="film-card__controls-item button film-card__controls-item--${className} ${isActive ? `` : `film-card__controls-item--active`}">${name}</button>`;
};

const createFilmCardTemplate = (film) => {
  const {poster: poster, title: title, rating: rating, release: date, runtime: duration, genres: genres, description: description, comments: comments} = film;

  const filmDescription = description.length > DescriptionSettings.MAX_LENGTH ? description.slice(0, DescriptionSettings.SPLIT_LENGTH).concat(`...`) : description;

  const filmCommentsCount = comments.length === 1 ? `${comments.length} comment` : `${comments.length} comments`;

  const formattedDate = `${date.getDate()} ${MonthNames[date.getMonth()]} ${date.getFullYear()}`;

  const addToWatchButton = createButtonTemplate(`Add to watchlist`, `add-to-watchlist`, !film.inWatchlist);
  const markAsWachedButton = createButtonTemplate(`Mark as watched`, `mark-as-watched`, !film.isWatched);
  const markAsFavoriteButton = createButtonTemplate(`Mark as favorite`, `favorite`, !film.isFavorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formattedDate}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${filmDescription}</p>
      <a class="film-card__comments">${filmCommentsCount}</a>
      <form class="film-card__controls">
        ${addToWatchButton}
        ${markAsWachedButton}
        ${markAsFavoriteButton}
      </form>
    </article>`
  );
};

class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }

  setMarkAsWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }
  setMarkAsFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }
}

export default FilmCard;
