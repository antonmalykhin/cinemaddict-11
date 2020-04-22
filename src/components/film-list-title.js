import AbstractComponent from './abstract-component';

const createFilmListTitleTemplate = (title, isVisible = true) => {
  return `<h2 class="films-list__title ${isVisible ? `visually-hidden` : ``}">${title}</h2>
  `;
};

class FilmListTitle extends AbstractComponent {
  constructor(title, isVisible) {
    super();

    this._isVisible = isVisible;
    this._title = title;
  }

  getTemplate() {
    return createFilmListTitleTemplate(this._title, this._isVisible);
  }
}

export default FilmListTitle;


