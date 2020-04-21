import FilmListComponent from '../components/film-list.js';
import FilmListTitleComponent from '../components/film-list-title.js';
import FilmCardComponent from '../components/film-card.js';
import ShowMoreButtonComponent from '../components/show-more-btn.js';
import FilmDetailsComponent from '../components/film-details.js';
import FilmCommentComponent from '../components/film-comment.js';
import FilmCommentsComponent from '../components/film-comments.js';

import {ExtraFilmListTitles, MAIN_FILM_LIST_TITLE, NO_FILM_LIST_TITLE} from '../const.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {generateComments} from '../mock/comments.js';

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_NUM = 2;

const renderComments = (film) => {
  const comments = film.comments;
  const generatedComments = generateComments(comments.length);
  const commentContainer = document.querySelector(`.form-details__bottom-container`);
  const filmCommentComponent = new FilmCommentsComponent(generatedComments);

  render(commentContainer, filmCommentComponent);

  const commentsListElement = filmCommentComponent.getElement().querySelector(`.film-details__comments-list`);

  for (let i = 0; i < comments.length; i++) {
    render(commentsListElement, new FilmCommentComponent(comments[i]));
  }
};

const renderFilm = (filmsContainer, popupContainer, film) => {
  const filmCardComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  render(filmsContainer, filmCardComponent);

  const onEscKeyPress = (evt) => {
    if (evt.key === `Escape` || evt.key === `Ecs`) {
      closePopup();
    }
  };

  const clearPopup = () => {
    const filmDetails = document.querySelector(`.film-details`);
    if (filmDetails) {
      filmDetails.remove();
    }
  };

  const openPopup = () => {
    clearPopup();
    render(popupContainer, filmDetailsComponent);
    renderComments(film);
    filmDetailsComponent.setClickHandler(closePopup);
    document.addEventListener(`keydown`, onEscKeyPress);
  };

  const closePopup = () => {
    filmDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, onEscKeyPress);
  };

  filmCardComponent.setClickHandler(openPopup);
};

class PageController {
  constructor(container) {
    this._container = container;

    this._filmListElement = new FilmListComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    const renderExtraFilmList = (title, sortedFilms) => {
      const filmList = new FilmListComponent(true);
      render(this._container.getElement(), filmList);

      const extraFilmListTitle = new FilmListTitleComponent(title, false);
      render(filmList.getElement(), extraFilmListTitle, RenderPosition.AFTERBEGIN);

      const extraFilmListContainer = filmList.getElement().querySelector(`.films-list__container`);

      for (let i = 0; i < EXTRA_FILMS_NUM; i++) {
        renderFilm(extraFilmListContainer, document.querySelector(`body`), sortedFilms[i]);
      }
    };

    const filmsCount = films.length;

    render(this._container.getElement(), this._filmListElement);

    if (filmsCount === 0) {
      const filmListTitle = new FilmListTitleComponent(NO_FILM_LIST_TITLE, false);

      render(this._filmListElement.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

      return;
    }

    const filmListTitle = new FilmListTitleComponent(MAIN_FILM_LIST_TITLE);
    render(this._filmListElement.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

    const mainFilmsListContainer = this._filmListElement.getElement().querySelector(`.films-list__container`);

    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    films.slice(0, showingFilmsCount).forEach((film) => renderFilm(mainFilmsListContainer, document.querySelector(`body`), film));

    const filmsByRating = films.slice().sort((a, b) => b.rating - a.rating);
    const filmsByComments = films.slice().sort((a, b) => b.comments - a.comments);

    renderExtraFilmList(ExtraFilmListTitles.TOP_RATED, filmsByRating);
    renderExtraFilmList(ExtraFilmListTitles.MOST_COMMENTED, filmsByComments);

    render(this._filmListElement.getElement(), this._showMoreButtonComponent);

    const onShowMoreButtonClick = () => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      films.slice(prevFilmsCount, showingFilmsCount)
        .forEach((film) => renderFilm(mainFilmsListContainer, document.querySelector(`body`), film));

      if (showingFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    };

    this._showMoreButtonComponent.setClickHandler(onShowMoreButtonClick);
  }
}

export default PageController;
