import FilmModel from '../models/film.js';
import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import {render, remove, replace} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
const TEXTFIELD_TAG = `TEXTAREA`;

const Key = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
  ENTER: `Enter`
};

const Warning = {
  ON: `0 0 0 3px crimson`,
  OFF: `none`
};

const FormElementClass = {
  TEXTAREA: `.film-details__comment-input`,
  EMOJI: `.film-details__add-emoji-label`
};

export default class FilmController {
  constructor(container, onFilmDetailsDataChange, onFilmDataChange, onViewChange) {
    this._container = container;
    this._onFilmDetailsDataChange = onFilmDetailsDataChange;
    this._onFilmDataChange = onFilmDataChange;
    this._onViewChange = onViewChange;

    this.id = null;
    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._popupContainer = document.querySelector(`body`);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onAddNewComment = this._onAddNewComment.bind(this);
  }

  render(film) {
    this.id = film.id;

    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._setFilmEvents(film);

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
      this._setFilmDetailsEvents(film);
    } else {
      render(this._container, this._filmComponent);
    }
  }

  setDefaultFilmView() {
    this._clearWarning();
    this._filmDetailsComponent.clearFormData();
    this._filmDetailsComponent.getElement().remove();
    remove(this._filmDetailsComponent);
  }

  destroyPopup() {
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onAddNewComment);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onAddNewComment);
  }

  shake() {
    this._filmComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._filmDetailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._filmComponent.getElement().style.animation = ``;
      this._filmDetailsComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  showWarning() {
    this._setStyle(FormElementClass.TEXTAREA, Warning.ON);
    this._setStyle(FormElementClass.EMOJI, Warning.ON);

    setTimeout(() => {
      this._clearWarning();
    }, 1000);
  }

  _clearWarning() {
    this._setStyle(FormElementClass.TEXTAREA, Warning.OFF);
    this._setStyle(FormElementClass.EMOJI, Warning.OFF);
  }

  _renderPopup(filmDetailsComponent, popupContainer) {
    render(popupContainer, filmDetailsComponent);
  }

  _setStyle(className, style) {
    const element = this._filmDetailsComponent.getElement().querySelector(className);
    element.style.boxShadow = style;
  }

  _setFilmEvents(film) {
    this._filmComponent.setClickHandler(() => {
      this._renderPopup(this._filmDetailsComponent, this._popupContainer);
      this._setFilmDetailsEvents(film);
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onAddNewComment);
    });

    this._filmComponent.setAddToWatchlistClickHandler(() => {
      this._onWatchlistChange(film, this._onFilmDataChange);
    });

    this._filmComponent.setMarkAsWatchedClickHandler(() => {
      this._onAlreadyWatchedChange(film, this._onFilmDataChange);
    });

    this._filmComponent.setMarkAsFavoriteClickHandler(() => {
      this._onFavoritesChange(film, this._onFilmDataChange);
    });
  }

  _setFilmDetailsEvents(film) {
    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this._onViewChange();
      this.setDefaultFilmView();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keydown`, this._onAddNewComment);
    });

    this._filmDetailsComponent.setAddToWatchlistClickHandler(() => {
      this._onWatchlistChange(film, this._onFilmDetailsDataChange);
    });

    this._filmDetailsComponent.setAlreadyWatchedClickHandler(() => {
      this._onAlreadyWatchedChange(film, this._onFilmDetailsDataChange);
    });

    this._filmDetailsComponent.setAddToFavoritesClickHandler(() => {
      this._onFavoritesChange(film, this._onFilmDetailsDataChange);
    });

    this._filmDetailsComponent.setOnDeleteButtonCLickHandler((commentId, button) => {
      this._onFilmDetailsDataChange(this, {film, commentId, button}, null);
    });

    this._filmDetailsComponent.setOnInputCommentHandler(() => {
      this._onInputCommentText();
    });

    this._filmDetailsComponent.emojiChange(() => {
      this._clearWarning();
    });
  }

  _onEscKeyDown(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      this.setDefaultFilmView();
      this._onViewChange();
    }
  }

  _onWatchlistChange(film, handler) {
    const newFilm = FilmModel.clone(film);

    newFilm.inWatchlist = !newFilm.inWatchlist;

    handler(this, film, newFilm);
  }

  _onAlreadyWatchedChange(film, handler) {
    const newFilm = FilmModel.clone(film);

    newFilm.isWatched = !newFilm.isWatched;
    newFilm.watchingDate = newFilm.isWatched ? new Date().toISOString() : null;

    handler(this, film, newFilm);

  }

  _onFavoritesChange(film, handler) {
    const newFilm = FilmModel.clone(film);

    newFilm.isFavorite = !film.isFavorite;

    handler(this, film, newFilm);
  }

  _onInputCommentText() {
    this._clearWarning();
  }

  _onAddNewComment(evt) {
    if (evt.key === Key.ENTER && (evt.ctrlKey || evt.metaKey)) {
      const data = this._filmDetailsComponent.getData();

      if (data.comment.emotion && !data.comment.comment) {
        this._setStyle(FormElementClass.TEXTAREA, Warning.ON);
        return;
      } else if (data.comment.comment && !data.comment.emotion) {
        this._setStyle(FormElementClass.EMOJI, Warning.ON);
        return;
      } else if (!data.comment.comment && !data.comment.emotion) {
        this._setStyle(FormElementClass.TEXTAREA, Warning.ON);
        this._setStyle(FormElementClass.EMOJI, Warning.ON);
        return;
      }

      data.formElements.forEach((element) => {
        element.disabled = true;

        if (element.tagName === TEXTFIELD_TAG) {
          element.style.boxShadow = null;
        }
      });

      document.removeEventListener(`keydown`, this._onAddNewComment);

      data.enableForm = this._onAddNewComment;
      this._onFilmDetailsDataChange(this, null, data);
    }
  }
}
