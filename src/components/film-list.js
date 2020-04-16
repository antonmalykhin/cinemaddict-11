import {createElement} from '../utils.js';

const createFilmListTemplate = (isExtra = false) => {
  return (
    `<section class="films-list${isExtra ? `--extra` : ``}">
        <div class="films-list__container"></div>
      </section>`
  );
};

class FilmList {
  constructor(isExtra) {
    this._isExtra = isExtra;
    this._element = null;
  }

  getTemplate() {
    return createFilmListTemplate(this._isExtra);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default FilmList;
