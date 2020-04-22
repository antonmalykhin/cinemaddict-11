import AbstractComponent from './abstract-component';

const createFooterStatisticsTemplate = (films) => {

  let formattedFilms = new Intl.NumberFormat(`ru-RU`).format(films);
  return `<p>${formattedFilms} movies inside</p>`;
};

class FooterStatistics extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }
}

export default FooterStatistics;
