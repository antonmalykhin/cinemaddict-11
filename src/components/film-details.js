import AbstractSmartComponent from './abstract-smart-component';
import {Emojis} from '../const.js';
import {formatDate, formatTime, formatCommentDateTime} from '../utils/common.js';

const TIME_FRAME = 5;

const createCommentTemplate = (comment) => {
  const {emoji, commentText, commentAuthor, date} = comment;

  const commentFormattedDateTime = formatCommentDateTime(date, TIME_FRAME);

  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${commentText}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${commentAuthor}</span>
        <span class="film-details__comment-day">${commentFormattedDateTime}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

const createEmojiTemplate = (emojis, isChecked) => {
  return emojis
    .map((emoji, index) => {
      return (
        `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked[index] ? `checked` : ``}>
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
  return genres.map((it) => `<span class="film-details__genre">${it}</span>`).join(`\n`);
};

const createFilmDetailsTemplate = (film, options = {}) => {

  const {poster: poster, ageRate: ageRate, title: title, productionTeam: productionTeam, originalTitle: originalTitle, rating: rating, release: releaseDate, runtime: runtime, genres: genres, country: country, description: description, comments: comments} = film;

  const formattedReleaseDate = formatDate(releaseDate);
  const formattedDuration = formatTime(runtime);

  const {director: director, writers: writers, actors: actors} = productionTeam;

  const {emoji, isChecked} = options;

  const addToWatchlistButton = createButtonsTemplate(`Add to watchlist`, `watchlist`, !film.inWatchlist);
  const alreadyWatchedButton = createButtonsTemplate(`Already watched`, `watched`, !film.isWatched);
  const addToFavoritesButton = createButtonsTemplate(`Add to favorites`, `favorite`, !film.isFavorite);

  const commentItems = comments.map((it) => createCommentTemplate(it)).join(`\n`);

  const commentsCount = comments.length;
  const emojisTemplate = createEmojiTemplate(Emojis, isChecked);

  const emojiImage = createAddEmojiTemplate(emoji);

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
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
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
                <td class="film-details__term">Genres</td>
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
          <div for="add-emoji" class="film-details__add-emoji-label">
            ${emojiImage}
          </div>

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

class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();

    this._film = film;
    this._emoji = null;
    this._clickHandler = null;
    this._isChecked = [];
    this._setEmoji();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, {
      emoji: this._emoji,
      isChecked: this._isChecked
    });
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._clickHandler);
    this._setEmoji();
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._clickHandler = handler;
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

  _setEmoji() {
    const element = this.getElement();
    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, (evt) => {

        if (evt.target.tagName !== `INPUT`) {
          return;
        }

        this._isChecked = [];

        evt.currentTarget.childNodes.forEach((it) => it.type === `radio` ? this._isChecked.push(it.checked) : ``);

        this._emoji = evt.target.value;

        this.rerender();
      });
  }

}

export default FilmDetails;
