import {createElement} from '../utils';

const createFilmListTitleTemplate = (title, isVisible = true) => {
  return `<h2 class="films-list__title ${isVisible ? `visually-hidden` : ``}">${title}</h2>
  `;
};

class FilmListTitle {
  constructor(title, isVisible) {
    this._isVisible = isVisible;
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createFilmListTitleTemplate(this._title, this._isVisible);
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

export default FilmListTitle;


