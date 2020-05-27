import AbstractComponent from './abstract-component.js';
import {Emojis} from '../const.js';
import {formatDate, formatTime, formatCommentDateTime} from '../utils/common.js';

import {encode} from 'he';

const TIME_FRAME = 5;
const EMOJI_BUTTON_TEG = `INPUT`;

const DeleteButtonProperties = {
  DISABLED: true,
  TEXT: `Deleting...`
};

const ButtonsProperties = {
  WATCHLIST: {
    NAME: `Add to watchlist`,
    CLASS_MODIFIER: `watchlist`
  },
  WATCHED: {
    NAME: `Mark as watched`,
    CLASS_MODIFIER: `watched`
  },
  FAVORITE: {
    NAME: `Mark as favorite`,
    CLASS_MODIFIER: `favorite`
  }
};

const parseFormData = (formData) => {
  return {
    comment: encode(formData.get(`comment`)),
    date: new Date().toISOString(),
    emotion: formData.get(`comment-emoji`)
  };
};

const createCommentTemplate = (commentData) => {
  const {id, emotion, comment, author, date} = commentData;

  const commentFormattedDateTime = formatCommentDateTime(date, TIME_FRAME);

  return (
    `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentFormattedDateTime}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

const createEmojiTemplate = (emojis) => {
  return emojis
    .map((emoji) => {
      return (
        `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
        <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>`
      );
    })
    .join(`\n`);
};

const createAddEmojiTemplate = (emoji) => {
  return emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``;
};

const createButtonsTemplate = (name, className, isChecked = true) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${className}" name="${className}" ${isChecked ? `` : `checked`}>
    <label for="${className}" class="film-details__control-label film-details__control-label--${className}">${name}</label>`
  );
};

const createGenresTemplate = (genres) => {
  return genres
    .map((it) => `<span class="film-details__genre">${it}</span>`)
    .join(`\n`);
};

const createFilmDetailsTemplate = (film) => {

  const {
    poster: poster,
    ageRate: ageRate,
    title: title,
    productionTeam: productionTeam,
    originalTitle: originalTitle,
    rating: rating,
    release: releaseDate,
    runtime: runtime,
    genres: genres,
    country: country,
    description: description,
    comments: comments
  } = film;

  const {
    director: director,
    writers: writers,
    actors: actors
  } = productionTeam;


  const formattedReleaseDate = formatDate(releaseDate);
  const formattedDuration = formatTime(runtime);

  const formattedWriters = writers.join(`, `);
  const formattedActors = actors.join(`, `);

  const addToWatchlistButton = createButtonsTemplate(
      ButtonsProperties.WATCHLIST.NAME,
      ButtonsProperties.WATCHLIST.CLASS_MODIFIER,
      !film.inWatchlist
  );

  const alreadyWatchedButton = createButtonsTemplate(
      ButtonsProperties.WATCHED.NAME,
      ButtonsProperties.WATCHED.CLASS_MODIFIER,
      !film.isWatched
  );

  const addToFavoritesButton = createButtonsTemplate(
      ButtonsProperties.FAVORITE.NAME,
      ButtonsProperties.FAVORITE.CLASS_MODIFIER,
      !film.isFavorite
  );

  const genreTitle = genres.length > 1 ? `Genres` : `Genre`;

  const commentItems = comments
    .map((it) => createCommentTemplate(it))
    .join(`\n`);

  const commentsCount = comments.length;
  const emojisTemplate = createEmojiTemplate(Emojis);

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img"  src=${poster} alt="">

            <p class="film-details__age">${ageRate}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${formattedWriters}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${formattedActors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formattedReleaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formattedDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genreTitle}</td>
                <td class="film-details__cell">
                  ${createGenresTemplate(genres)}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
        ${addToWatchlistButton}
        ${alreadyWatchedButton}
        ${addToFavoritesButton}
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

        <ul class="film-details__comments-list">
          ${commentItems}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojisTemplate}
          </div>
        </div>

        </section>
      </div>
    </form>
  </section>`
  );
};

export default class FilmDetails extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;

    this.getData = this.getData.bind(this);
    this.clearFormData = this.clearFormData.bind(this);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);
  }

  setAddToFavoritesClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
  }

  clearFormData() {
    const form = this.getElement().querySelector(`form`);
    const emoji = form.querySelector(`.film-details__add-emoji-label`);

    if (emoji.firstChild) {
      emoji.removeChild(emoji.firstChild);
    }

    form.reset();
  }

  emojiChange(handler) {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, (evt) => {

        if (evt.target.tagName !== EMOJI_BUTTON_TEG) {
          return;
        }

        handler();

        this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = createAddEmojiTemplate(evt.target.value);
      });
  }

  setOnDeleteButtonCLickHandler(handler) {
    const deleteButton = this.getElement().querySelectorAll(`.film-details__comment-delete`);

    deleteButton.forEach((button) => button.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      button.disabled = DeleteButtonProperties.DISABLED;
      button.textContent = DeleteButtonProperties.TEXT;

      const commentId = button.closest(`.film-details__comment`).id;

      handler(commentId, button);
    }));
  }

  setOnInputCommentHandler(handler) {
    const commentField = this.getElement().querySelector(`.film-details__comment-input`);
    commentField.addEventListener(`input`, handler);
  }

  getData() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    return {
      formElements: form.querySelectorAll(`input, textarea, button`),
      comment: parseFormData(formData),
      film: this._film
    };
  }
}
