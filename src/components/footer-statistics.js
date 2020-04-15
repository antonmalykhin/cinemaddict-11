import {createElement} from '../utils.js';

const createFooterStatisticsTemplate = (movies) => {

  let formattedMovies = new Intl.NumberFormat(`ru-RU`).format(movies);
  return `<p>${formattedMovies} movies inside</p>`;
};

class FooterStatistics {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate();
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
