import FilmBoardComponent from '../components/film-board.js';
import FilmListComponent from '../components/film-list.js';
import FilmListTitleComponent from '../components/film-list-title.js';
import ShowMoreButtonComponent from '../components/show-more-btn.js';
import FilmController from './film.js';

import {ExtraFilmListTitles, MAIN_FILM_LIST_TITLE, NO_FILM_LIST_TITLE, SortingType} from '../const.js';
import {remove, render, RenderPosition} from '../utils/render.js';

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_NUM = 2;

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
      sortedFilms = showingFilms.sort((a, b) => a.release - b.release);
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

const getSorterExtraFilms = (films, title, from, to) => {
  let sortedFilms = [];
  const comingFilms = films.slice();

  switch (title) {
    case ExtraFilmListTitles.TOP_RATED:
      sortedFilms = comingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case ExtraFilmListTitles.MOST_COMMENTED:
      sortedFilms = comingFilms.sort((a, b) => b.comments.length - a.comments.length);
      break;
  }

  return sortedFilms.slice(from, to);
};

class PageController {
  constructor(container, sorting, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._showedFilmControllers = [];

    this._filmListComponent = new FilmListComponent();
    this._extraFilmListComponentRated = new FilmListComponent(true);
    this._extraFilmListComponentCommented = new FilmListComponent(true);
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

    this._body = document.querySelector(`body`);
  }

  render() {
    const container = this._container.getElement();
    const films = this._filmsModel.getFilms();
    const filmsCount = films.length;

    render(container, this._filmListComponent);

    if (filmsCount === 0) {
      const filmListTitle = new FilmListTitleComponent(NO_FILM_LIST_TITLE, false);

      render(this._filmListComponent.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

      return;
    }

    const filmListTitle = new FilmListTitleComponent(MAIN_FILM_LIST_TITLE);

    render(this._filmListComponent.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

    this._renderExtraLists();

    this._renderFilms(films);

    this._renderShowMoreButton();

  }

  _renderExtraLists() {
    render(this._container.getElement(), this._extraFilmListComponentRated);
    render(this._container.getElement(), this._extraFilmListComponentCommented);

    render(this._extraFilmListComponentRated.getElement(), this._extraFilmListTitleRated, RenderPosition.AFTERBEGIN);
    render(this._extraFilmListComponentCommented.getElement(), this._extraFilmListTitleCommented, RenderPosition.AFTERBEGIN);

    this._renderExtraFilms(ExtraFilmListTitles.TOP_RATED, this._extraFilmListComponentRated);
    this._renderExtraFilms(ExtraFilmListTitles.MOST_COMMENTED, this._extraFilmListComponentCommented);
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

  _renderExtraFilms(title, container) {
    const sortedFilms = getSorterExtraFilms(this._filmsModel.getFilmsAll(), title, 0, EXTRA_FILMS_NUM);

    renderFilms(sortedFilms, container, this._body, this._onDataChange, this._onViewChange);
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
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortingType, 0, this._showingFilmsCount);

    this._removeFilms();

    this._renderFilms(sortedFilms);

    this._renderShowMoreButton();
  }

  _onDataChange(filmController, oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      filmController.render(newData);
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onFilterChange() {
    this._updateFilms(SHOWING_FILMS_COUNT_ON_START);
  }
}

export default PageController;
