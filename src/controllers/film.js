import FilmModel from '../models/film.js';
import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import {render, remove, replace} from '../utils/render.js';

class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this.id = null;
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._popupContainer = document.querySelector(`body`);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onAddNewComment = this._onAddNewComment.bind(this);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Ecs`) {
      this.setDefaultFilmView();
    }
  }

  _renderPopup(filmDetailsComponent, popupContainer) {
    this._onViewChange();
    render(popupContainer, filmDetailsComponent);
  }

  setDefaultFilmView() {
    this._filmDetailsComponent.clearFormData();
    this._filmDetailsComponent.getElement().remove();
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onAddNewComment);
  }

  _setFilmEvents(film) {
    this._filmComponent.setClickHandler(() => {
      this._renderPopup(this._filmDetailsComponent, this._popupContainer);
      this._setFilmDetailsEvents(film);
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onAddNewComment);
    });

    this._filmComponent.setAddToWatchlistClickHandler(() => {
      this._onWatchlistChange(film);
    });

    this._filmComponent.setMarkAsWatchedClickHandler(() => {
      this._onAlreadyWatchedChange(film);
    });

    this._filmComponent.setMarkAsFavoriteClickHandler(() => {
      this._onFavoritesChange(film);
    });
  }

  _setFilmDetailsEvents(film) {
    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this.setDefaultFilmView();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keydown`, this._onAddNewComment);
    });

    this._filmDetailsComponent.setAddToWatchlistClickHandler(() => {
      this._onWatchlistChange(film);
    });

    this._filmDetailsComponent.setAlreadyWatchedClickHandler(() => {
      this._onAlreadyWatchedChange(film);
    });

    this._filmDetailsComponent.setAddToFavoritesClickHandler(() => {
      this._onFavoritesChange(film);
    });

    this._filmDetailsComponent.setOnDeleteButtonCLickHandler((commentId) => {
      this._onDataChange(this, {film, commentId}, null);
    });

    this._filmDetailsComponent.emojiChange();
  }

  _onWatchlistChange(film) {
    const newFilm = FilmModel.clone(film);

    newFilm.inWatchlist = !newFilm.inWatchlist;

    this._onDataChange(this, film, newFilm);
  }

  _onAlreadyWatchedChange(film) {
    const newFilm = FilmModel.clone(film);

    newFilm.isWatched = !newFilm.isWatched;
    newFilm.watchingDate = newFilm.isWatched ? new Date().toISOString() : null;

    this._onDataChange(this, film, newFilm);
  }

  _onFavoritesChange(film) {
    const newFilm = FilmModel.clone(film);

    newFilm.isFavorite = !film.isFavorite;

    this._onDataChange(this, film, newFilm);
  }

  _onAddNewComment(evt) {
    if (evt.key === `Enter` && (evt.ctrlKey || evt.metaKey)) {
      const data = this._filmDetailsComponent.getData();
      const invalidData = Object.values(data.comment).some((value) => !value);

      if (invalidData) {
        return;
      }

      this._onDataChange(this, null, data);
    }
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
}

export default FilmController;
