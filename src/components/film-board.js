import AbstractComponent from './abstract-component.js';

const createFilmBoardTemplate = () => {
  return `<section class="films"></section>`;
};

export default class FilmBoard extends AbstractComponent {
  getTemplate() {
    return createFilmBoardTemplate();
  }
}
