import {getFilmsByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

const EXTRA_FILMS_NUM = 2;

class Films {
  constructor() {
    this._films = [];
    this._activeFilter = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilter);
  }

  getFilmsAll() {
    return this._films;
  }

  getCommentedFilms() {
    const films = this.getFilmsAll();
    return films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, EXTRA_FILMS_NUM);
  }

  getRatedFilms() {
    const films = this.getFilmsAll();
    return films.slice().sort((a, b) => b.rating - a.rating).slice(0, EXTRA_FILMS_NUM);
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilter = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateFilm(id, newFilm) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeComment(commentId, film) {
    const index = film.comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      return false;
    }

    film.comments = [].concat(film.comments.slice(0, index), film.comments.slice(index + 1));

    return this.updateFilm(film.id, film);
  }

  addComment(comment, film) {
    film.comments = [].concat(film.comments, comment);

    return this.updateFilm(film.id, film);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

export default Films;
