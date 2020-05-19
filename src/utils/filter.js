import {FilterType} from '../const.js';

const getInWhatchlistFilms = (films) => {
  return films.filter((film) => film.inWatchlist);
};

const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

const getFavoritesFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

const getFilmsByFilter = (films, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getInWhatchlistFilms(films);
    case FilterType.WATCHED:
      return getWatchedFilms(films);
    case FilterType.FAVORITE:
      return getFavoritesFilms(films);
  }

  return films;
};

export {getInWhatchlistFilms, getWatchedFilms, getFavoritesFilms, getFilmsByFilter};
