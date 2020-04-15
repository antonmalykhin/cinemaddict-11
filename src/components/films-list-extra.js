import {createElement} from '../utils.js';

const createFilmListExtraTemplate = (extraListTitle) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${extraListTitle}</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

class FilmsListExtra {
  constructor(title) {
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._title);
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

export default FilmsListExtra;
