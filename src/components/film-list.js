import AbstractComponent from './abstract-component.js';

const createFilmListTemplate = (isExtra = false) => {
  return (
    `<section class="films-list${isExtra ? `--extra` : ``}">
        <div class="films-list__container"></div>
      </section>`
  );
};

class FilmList extends AbstractComponent {
  constructor(isExtra) {
    super();

    this._isExtra = isExtra;
  }

  getTemplate() {
    return createFilmListTemplate(this._isExtra);
  }
}

export default FilmList;
