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
      this._onDataChange(this, film, Object.assign({}, film, {
        inWatchlist: !film.inWatchlist,
      }));
    });

    this._filmComponent.setMarkAsWatchedClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched
      }));
    });

    this._filmComponent.setMarkAsFavoriteClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite
      }));
    });
  }

  _setFilmDetailsEvents(film) {
    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this.setDefaultFilmView();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keydown`, this._onAddNewComment);
    });

    this._filmDetailsComponent.setAddToWatchlistClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        inWatchlist: !film.inWatchlist,
      }));
    });

    this._filmDetailsComponent.setAlreadyWatchedClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched
      }));
    });

    this._filmDetailsComponent.setAddToFavoritesClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite
      }));
    });

    this._filmDetailsComponent.setOnDeleteButtonCLickHandler((commentId) => {
      this._onDataChange(this, {film, commentId}, null);
    });

    this._filmDetailsComponent.emojiChange();
  }

  _onAddNewComment(evt) {
    if (evt.key === `Enter` && (evt.ctrlKey || evt.metaKey)) {
      const data = this._filmDetailsComponent.getData();

      if (!data) {
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
