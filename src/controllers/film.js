import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';

import {render, remove, replace} from '../utils/render.js';


class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._popupContainer = document.querySelector(`body`);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Ecs`) {
      this.setDefaultView();
    }
  }

  _renderPopup(filmDetailsComponent, popupContainer) {
    this._onViewChange();
    render(popupContainer, filmDetailsComponent);
  }

  setDefaultView() {
    this._filmDetailsComponent.getElement().remove();
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._filmComponent.setClickHandler(() => {
      this._renderPopup(this._filmDetailsComponent, this._popupContainer);

      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this.setDefaultView();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
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

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmComponent);
    }
  }
}

export default FilmController;
