import AbstractComponent from './abstract-component';

const createFooterStatisticsTemplate = (films) => {
  let formattedFilms = new Intl.NumberFormat(`ru-RU`).format(films);
  return `<p>${formattedFilms} movies inside</p>`;
};

class FooterStatistics extends AbstractComponent {
  constructor(filmsModel) {
    super();

    this._films = filmsModel.getFilmsAll().length;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }
}

export default FooterStatistics;
