import Film from './models/film.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

class API {
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
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then((film) => this._getComments(film))
      .then(Film.parseFilm);
  }

  createComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
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

export default API;
