import UserProfileComponent from './components/user-profile.js';
import FiltersComponent from './components/filter.js';
import SortingComponent from './components/sorting.js';
import FilmBoardComponent from './components/film-board.js';
import FilmListComponent from './components/film-list.js';
import FilmListTitleComponent from './components/film-list-title.js';
import FilmCardComponent from './components/film-card.js';
import ShowMoreButtonComponent from './components/show-more-btn.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import FilmDetailsComponent from './components/film-details.js';
import FilmCommentsComponent from './components/film-comments.js';
import FilmCommentComponent from './components/film-comment.js';

import {generateFilms} from './mock/film.js';
import {generateComments} from './mock/comments.js';
import {generateUser} from './mock/user.js';
import {generateFilters} from './mock/filter.js';
import {generateFilmsInside} from './mock/filmsInside.js';


import {ExtraFilmListTitles, MAIN_FILM_LIST_TITLE, NO_FILM_LIST_TITLE} from './const.js';
import {remove, render, RenderPosition} from './utils/render.js';

const FILMS_COUNT = 25;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_NUM = 2;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

const user = generateUser();
const filters = generateFilters();

const renderComments = (film) => {
  const comments = generateComments(film.comments);
  const commentContainer = siteBodyElement.querySelector(`.film-details__comments-wrap`);
  render(commentContainer, new FilmCommentsComponent(comments));
  const commentsListElement = commentContainer.querySelector(`.film-details__comments-list`);

  for (let i = 0; i < comments.length; i++) {
    render(commentsListElement, new FilmCommentComponent(comments[i]));
  }
};

const renderFilm = (filmsContainer, popupContainer, film) => {
  const filmCardComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  render(filmsContainer, filmCardComponent);
  const poster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const title = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const comments = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  const popupCloseBtn = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  const onEscKeyPress = (evt) => {
    if (evt.key === `Escape` || evt.key === `Ecs`) {
      closePopup();
    }
  };

  const clearPopup = () => {
    const filmDetails = siteBodyElement.querySelector(`.film-details`);
    if (filmDetails) {
      filmDetails.remove();
    }
  };

  const openPopup = () => {
    clearPopup();
    render(popupContainer, filmDetailsComponent);
    renderComments(film);
    popupCloseBtn.addEventListener(`click`, closePopup);
    document.addEventListener(`keydown`, onEscKeyPress);
  };

  const closePopup = () => {
    filmDetailsComponent.getElement().remove();
    popupCloseBtn.removeEventListener(`click`, closePopup);
    document.removeEventListener(`keydown`, onEscKeyPress);
  };

  poster.addEventListener(`click`, openPopup);
  title.addEventListener(`click`, openPopup);
  comments.addEventListener(`click`, openPopup);
};

const renderExtraFilmList = (title, filmsBoardElement, films) => {
  const filmList = new FilmListComponent(true);
  render(filmsBoardElement, filmList);

  const extraFilmListTitle = new FilmListTitleComponent(title, false);
  render(filmList.getElement(), extraFilmListTitle, RenderPosition.AFTERBEGIN);

  const extraFilmListContainer = filmList.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_FILMS_NUM; i++) {
    renderFilm(extraFilmListContainer, siteBodyElement, films[i]);
  }
};

const renderFilms = (filmBoardElement, films) => {
  const filmsCount = films.length;

  const filmListElement = new FilmListComponent();
  render(siteMainElement, filmBoardElement);
  render(filmBoardElement.getElement(), filmListElement);

  if (filmsCount === 0) {
    const filmListTitle = new FilmListTitleComponent(NO_FILM_LIST_TITLE, false);
    render(filmListElement.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);
    return;
  }

  const filmListTitle = new FilmListTitleComponent(MAIN_FILM_LIST_TITLE);
  render(filmListElement.getElement(), filmListTitle, RenderPosition.AFTERBEGIN);

  const mainFilmsListContainer = filmListElement.getElement().querySelector(`.films-list__container`);

  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

  films.slice(0, showingFilmsCount).forEach((film) => renderFilm(mainFilmsListContainer, siteBodyElement, film));

  const filmsByRating = films.slice().sort((a, b) => b.rating - a.rating);
  const filmsByComments = films.slice().sort((a, b) => b.comments - a.comments);
  renderExtraFilmList(ExtraFilmListTitles.TOP_RATED, filmBoardElement.getElement(), filmsByRating);
  renderExtraFilmList(ExtraFilmListTitles.MOST_COMMENTED, filmBoardElement.getElement(), filmsByComments);

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  const showMoreButton = showMoreButtonComponent.getElement();
  render(filmListElement.getElement(), showMoreButtonComponent);

  const onShowMoreButtonClick = () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    films.slice(prevFilmsCount, showingFilmsCount)
      .forEach((film) => renderFilm(mainFilmsListContainer, siteBodyElement, film));

    if (showingFilmsCount >= films.length) {
      showMoreButton.removeEventListener(`click`, onShowMoreButtonClick);
      remove(showMoreButtonComponent);
    }
  };

  showMoreButton.addEventListener(`click`, onShowMoreButtonClick);
};

render(siteHeaderElement, new UserProfileComponent(user));
render(siteMainElement, new FiltersComponent(filters));
render(siteMainElement, new SortingComponent());

const filmBoardElement = new FilmBoardComponent();
const films = generateFilms(FILMS_COUNT);

renderFilms(filmBoardElement, films);

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);
const filmsInside = generateFilmsInside();
render(footerStatisticsElement, new FooterStatisticsComponent(filmsInside));
