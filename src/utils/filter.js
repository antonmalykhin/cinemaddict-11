import {FilterType} from '../const.js';

export const getInWhatchlistFilms = (films) => {
  return films.filter((film) => film.inWatchlist);
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

export const getFavoritesFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

export const getFilmsByFilter = (films, filterType) => {

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
