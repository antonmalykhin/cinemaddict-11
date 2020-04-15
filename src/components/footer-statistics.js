import {createElement} from '../utils.js';

const createFooterStatisticsTemplate = (films) => {

  let formattedFilms = new Intl.NumberFormat(`ru-RU`).format(films);
  return `<p>${formattedFilms} movies inside</p>`;
};

class FooterStatistics {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
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

export default FooterStatistics;
