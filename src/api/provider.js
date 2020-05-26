import Film from '../models/film.js';

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films);

          this._store.setItems(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms);
  }

  updateFilm(id, data) {
    if (isOnline()) {
      return this._api.updateFilm(id, data)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm);

          return newFilm;
        });
    }

    this._store.setItem(id, data);

    return Promise.resolve(data);
  }

  createComment(film, comment) {
    if (isOnline()) {
      return this._api.createComment(film, comment)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm);

          return newFilm;
        });
    }

    return Promise.reject();
  }

  removeComment(data) {
    const {commentId, film} = data;
    const localFilm = Object.assign({}, film, {
      comments: film.comments.filter(({id}) => id !== commentId)
    });

    if (isOnline()) {
      return this._api.removeComment(commentId)
        .then(() => {
          this._store.setItem(film.id, localFilm);
        });
    }

    return Promise.reject();
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems()).map(Film.toRAW);

      return this._api.sync(storeFilms)
        .then((response) => {
          this._store.setItems(response);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
