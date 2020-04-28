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

class PageController {
  constructor(container, sorting) {
    this._container = container;

    this._films = [];
    this._showedFilmControllers = [];

    this._filmListComponent = new FilmListComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortingComponent = sorting;
    this._filmBoardComponent = new FilmBoardComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortingTypeChange = this._onSortingTypeChange.bind(this);

    this._sortingComponent.setSortingTypeChangeHandler(this._onSortingTypeChange);

    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._body = document.querySelector(`body`);
  }

  _renderExtraFilmList(title, films) {
    let sortedFilms = [];

    switch (title) {
      case ExtraFilmListTitles.TOP_RATED:
        sortedFilms = films.slice().sort((a, b) => b.rating - a.rating);
        break;
      case ExtraFilmListTitles.MOST_COMMENTED:
        sortedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length);
        break;
    }

    const filmList = new FilmListComponent(true);
    render(this._container.getElement(), filmList);

    const extraFilmListTitle = new FilmListTitleComponent(title, false);
    render(filmList.getElement(), extraFilmListTitle, RenderPosition.AFTERBEGIN);

    const extraFilms = renderFilms(sortedFilms.slice(0, EXTRA_FILMS_NUM), filmList, this._body, this._onDataChange, this._onViewChange);

    this._showedFilmControllers = this._showedFilmControllers.concat(extraFilms);
  }

  _renderShowMoreButton() {
    if (this._showingFilmsCount >= this._films.length) {
      return;
    }

    render(this._filmListComponent.getElement(), this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortingComponent.getSortingType(), prevFilmsCount, this._showingFilmsCount);
      const newFilms = renderFilms(sortedFilms, this._container, this._body, this._onDataChange, this._onViewChange);

      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortingTypeChange(sortingType) {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    const sortedFilms = getSortedFilms(this._films, sortingType, 0, this._showingFilmsCount);

    this._filmListComponent.getElement().querySelector(`.films-list__container`).innerHTML = ``;

    const newFilms = renderFilms(sortedFilms, this._container, this._body, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;
  }

  _onDataChange(filmController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    filmController.render(this._films[index]);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  render(films) {

    this._films = films;

    const filmsCount = films.length;

    render(this._container.getElement(), this._filmListComponent);

    if (filmsCount === 0) {
      const filmListTitle = new FilmListTitleComponent(NO_FILM_LIST_TITLE, false);

      render(this._filmListComponent.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

      return;
    }

    const filmListTitle = new FilmListTitleComponent(MAIN_FILM_LIST_TITLE);
    render(this._filmListComponent.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

    const newFilms = renderFilms(this._films.slice(0, this._showingFilmsCount), this._container, this._body, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._renderExtraFilmList(ExtraFilmListTitles.TOP_RATED, this._films);
    this._renderExtraFilmList(ExtraFilmListTitles.MOST_COMMENTED, this._films);

    this._renderShowMoreButton();
  }
}

export default PageController;
