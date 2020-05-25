import FilmBoardComponent from '../components/film-board.js';
import FilmListComponent from '../components/film-list.js';
import FilmListTitleComponent from '../components/film-list-title.js';
import ShowMoreButtonComponent from '../components/show-more-btn.js';
import FilmController from './film.js';

import {ExtraFilmListTitles, MAIN_FILM_LIST_TITLE, NO_FILM_LIST_TITLE, SortingType} from '../const.js';
import {remove, render, RenderPosition} from '../utils/render.js';

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const renderFilms = (films, filmListComponent, popupContainer, onDataChange, onViewChange) => {
  const filmContainer = filmListComponent.getElement().querySelector(`.films-list__container`);

  return films.map((film) => {
    const filmController = new FilmController(filmContainer, onDataChange, onViewChange);
    filmController.render(film, popupContainer);

    return filmController;
  });
};

const getSortedFilms = (films, sortingType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortingType) {
    case SortingType.BY_DATE:
      sortedFilms = showingFilms.sort((a, b) => new Date(a.release) - new Date(b.release));
      break;
    case SortingType.BY_RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortingType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

class PageController {
  constructor(container, sorting, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;

    this._showedFilmControllers = [];
    this._showedExtraFilmsControllers = [];

    this._filmListComponent = new FilmListComponent();
    this._extraFilmListComponentRated = null;
    this._extraFilmListComponentCommented = null;
    this._extraFilmListTitleRated = new FilmListTitleComponent(ExtraFilmListTitles.TOP_RATED, false);
    this._extraFilmListTitleCommented = new FilmListTitleComponent(ExtraFilmListTitles.MOST_COMMENTED, false);
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortingComponent = sorting;
    this._filmBoardComponent = new FilmBoardComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortingTypeChange = this._onSortingTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._sortingComponent.setSortingTypeChangeHandler(this._onSortingTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);

    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this.sortingType = SortingType.DEFAULT;
    this._body = document.querySelector(`body`);

    this._header = document.queryCommandEnabled(`header`);
  }

  render() {
    const container = this._container.getElement();
    const films = this._filmsModel.getFilmsAll();
    const filmsCount = films.length;

    render(container, this._filmListComponent);

    if (filmsCount === 0) {
      const filmListTitle = new FilmListTitleComponent(NO_FILM_LIST_TITLE, false);

      render(this._filmListComponent.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

      return;
    }

    const filmListTitle = new FilmListTitleComponent(MAIN_FILM_LIST_TITLE);

    render(this._filmListComponent.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

    this._renderFilms(films.slice(0, this._showingFilmsCount));

    this._renderTopRatedFilms();

    this._renderMostCommentedFilms();

    this._renderShowMoreButton();

  }

  hide() {
    this._container.hide();
    this._sortingComponent.hide();
  }

  show() {
    this._container.show();
    this._sortingComponent.show();
  }

  _renderFilms(films) {
    const newFilms = renderFilms(films, this._container, this._body, this._onDataChange, this._onViewChange);

    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._showingFilmsCount = this._showedFilmControllers.length;
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmsController) => filmsController.destroy());
    this._showedFilmControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }

  _removeExtraLists() {
    remove(this._extraFilmListComponentCommented);
    remove(this._extraFilmListComponentRated);
  }

  _renderTopRatedFilms() {
    this._extraFilmListComponentRated = new FilmListComponent(true);

    render(this._container.getElement(), this._extraFilmListComponentRated);
    render(this._extraFilmListComponentRated.getElement(), this._extraFilmListTitleRated, RenderPosition.AFTERBEGIN);

    const newFilms = renderFilms(this._filmsModel.getRatedFilms(), this._extraFilmListComponentRated, this._body, this._onDataChange, this._onViewChange);

    this._showedExtraFilmsControllers = this._showedExtraFilmsControllers.concat(newFilms);
  }

  _renderMostCommentedFilms() {

    this._extraFilmListComponentCommented = new FilmListComponent(true);

    render(this._container.getElement(), this._extraFilmListComponentCommented);
    render(this._extraFilmListComponentCommented.getElement(), this._extraFilmListTitleCommented, RenderPosition.AFTERBEGIN);

    const newFilms = renderFilms(this._filmsModel.getCommentedFilms(), this._extraFilmListComponentCommented, this._body, this._onDataChange, this._onViewChange);

    this._showedExtraFilmsControllers = this._showedExtraFilmsControllers.concat(newFilms);
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(this._filmListComponent.getElement(), this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    const prevFilmsCount = this._showingFilmsCount;
    const films = this._filmsModel.getFilms();

    this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    const sortedFilms = getSortedFilms(films, this._sortingComponent.getSortingType(), prevFilmsCount, this._showingFilmsCount);

    this._renderFilms(sortedFilms);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onSortingTypeChange(sortingType) {
    this.sortingType = sortingType;

    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortingType, 0, this._showingFilmsCount);

    this._removeFilms();

    this._renderFilms(sortedFilms);

    this._renderShowMoreButton();
  }

  _updateFilmControllers(data) {
    this._showedFilmControllers.concat(this._showedExtraFilmsControllers)
      .filter((controller) => controller.id === data.film.id)
      .forEach((controller) => controller.render(this._filmsModel.getFilmsAll().find((it) => it.id === data.film.id)));

    this._removeExtraLists();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }

  _shakeFilmCards(id) {
    this._showedFilmControllers.concat(this._showedExtraFilmsControllers)
    .filter((controller) => controller.id === id)
    .forEach((controller) => controller.shake());
  }

  _onDataChange(filmController, oldData, newData) {
    if (newData === null) {
      this._api.removeComment(oldData.commentId)
        .then(() => {
          const isSuccess = this._filmsModel.removeComment(oldData.commentId, oldData.film);

          if (isSuccess) {
            this._updateFilmControllers(oldData);
          }
        })
        .catch(() => {
          oldData.button.disabled = false;
          oldData.button.textContent = `Delete`;
          this._showedFilmControllers.concat(this._showedExtraFilmsControllers)
            .filter((controller) => controller.id === oldData.film.id)
            .forEach((controller) => controller.shake());

        });
    } else if (oldData === null) {
      this._api.createComment(newData.film.id, newData.comment)
        .then((film) => {
          const isSuccess = this._filmsModel.addComment(film.comments.pop(), film);

          if (isSuccess) {
            this._updateFilmControllers(newData);
          }
        })
        .catch(() => {
          document.querySelectorAll(`[disabled]`).forEach((element) => {
            element.disabled = false;

            if (element.tagName === `TEXTAREA`) {
              element.style.boxShadow = `0 0 0 2px tomato`;
            }
          });

          this._showedFilmControllers.concat(this._showedExtraFilmsControllers)
      .filter((controller) => controller.id === oldData.film.id)
      .forEach((controller) => controller.shake());
        });
    } else {
      this._api.updateFilm(oldData.id, newData)
        .then((filmModel) => {
          const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);

          if (isSuccess) {
            filmController.render(filmModel);

            this._showedFilmControllers.concat(this._showedExtraFilmsControllers)
              .filter((controller) => controller.id === oldData.id)
              .forEach((controller) => controller.render(newData));
          }
        })
        .catch(() => {
          this._showedFilmControllers.concat(this._showedExtraFilmsControllers)
            .filter((controller) => controller.id === oldData.id)
            .forEach((controller) => controller.shake());
        });
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => {
      it.setDefaultFilmView();
    });
  }

  _onFilterChange() {
    this._updateFilms(SHOWING_FILMS_COUNT_ON_START);
    this._sortingComponent.resetSortingType();
  }
}

export default PageController;
