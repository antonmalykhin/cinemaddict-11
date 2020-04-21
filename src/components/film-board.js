import AbstractComponent from './abstract-component.js';

const createFilmBoardTemplate = () => {
  return `<section class="films"></section>`;
};

class FilmBoard extends AbstractComponent {
  getTemplate() {
    return createFilmBoardTemplate();
  }
}

export default FilmBoard;
