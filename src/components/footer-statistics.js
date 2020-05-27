import AbstractComponent from './abstract-component';

const LOCALE = `ru-RU`;

const createFooterStatisticsTemplate = (films) => {
  const formattedFilms = new Intl.NumberFormat(LOCALE).format(films);
  return `<p>${formattedFilms} movies inside</p>`;
};

export default class FooterStatistics extends AbstractComponent {
  constructor(filmsModel) {
    super();

    this._films = filmsModel.getFilmsAll().length;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }
}
