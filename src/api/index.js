import Film from '../models/film.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Status = {
  SUCCESS: 200,
  REDIRECTION: 300
};

const checkStatus = (response) => {
  if (response.status >= Status.SUCCESS && response.status < Status.REDIRECTION) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then((films) => Promise.all(films.map((film) => this._getComments(film))))
      .then(Film.parseFilms);
  }

  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(Film.toRAW(data)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then((film) => this._getComments(film))
      .then(Film.parseFilm);
  }

  createComment(film, comment) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then((data) => {
        const parsedFilm = Film.parseFilm(data.movie);
        parsedFilm.comments = data.comments;

        return parsedFilm;
      });
  }

  removeComment(commentId) {
    return this._load({url: `comments/${commentId}`, method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(({updated: films}) => {
        Promise.all(films.map((film) => this._getComments(film)));
      })
      .then(Film.parseMovies);
  }

  _getComments(film) {
    return this._load({url: `comments/${film.id}`})
      .then((response) => response.json())
      .then((loadedComments) => Object.assign({}, film, {comments: loadedComments}));
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
