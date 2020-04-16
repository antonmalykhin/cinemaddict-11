import UserProfileComponent from './components/user-profile.js';
import FiltersComponent from './components/filter.js';
import SortingComponent from './components/sorting.js';
import FilmListComponent from './components/film-list.js';
import FilmListExtraComponent from './components/film-list-extra.js';
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


import {ExtraListNames} from './const.js';
import {render} from './utils.js';

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
  render(commentContainer, new FilmCommentsComponent(comments).getElement());
  const commentsListElement = commentContainer.querySelector(`.film-details__comments-list`);

  for (let i = 0; i < comments.length; i++) {
    render(commentsListElement, new FilmCommentComponent(comments[i]).getElement());
  }
};

const renderFilm = (filmsContainer, popupContainer, film) => {
  const filmCardComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  render(filmsContainer, filmCardComponent.getElement());
  const poster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const title = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const comments = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  const popupCloseBtn = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  const onEscKeyPress = (evt) => {
    if (evt.key === `Escape` || evt.key === `Ecs`) {
      closePopup();
    }
  };

  const openPopup = () => {
    render(popupContainer, filmDetailsComponent.getElement());
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

const renderExtraFilms = (filmsBoardElement, films) => {

  const filmsByRating = films.slice().sort((a, b) => b.rating - a.rating);
  const filmsByComments = films.slice().sort((a, b) => b.comments - a.comments);

  render(filmsBoardElement, new FilmListExtraComponent(ExtraListNames.RATED).getElement());
  render(filmsBoardElement, new FilmListExtraComponent(ExtraListNames.COMMENTED).getElement());

  const extraFilmLists = filmsBoardElement.querySelectorAll(`.films-list--extra`);

  const [topRated, mostCommented] = extraFilmLists;
  const topRatedFilmsListContainer = topRated.querySelector(`.films-list__container`);
  const mostCommentedFilmsListContainer = mostCommented.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_FILMS_NUM; i++) {
    renderFilm(topRatedFilmsListContainer, siteBodyElement, filmsByRating[i]);
    renderFilm(mostCommentedFilmsListContainer, siteBodyElement, filmsByComments[i]);
  }
};

const renderFilmsList = (mainFilmsListContainer, films) => {
  let ShowingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

  films.slice(0, ShowingFilmsCount).forEach((film) => renderFilm(mainFilmsListContainer, siteBodyElement, film));

  const filmsBoardElement = siteMainElement.querySelector(`.films`);
  const filmsListElement = filmsBoardElement.querySelector(`.films-list`);

  renderExtraFilms(filmsBoardElement, films);

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  const showMoreButton = showMoreButtonComponent.getElement();
  render(filmsListElement, showMoreButton);

  const onShowMoreButtonClick = () => {
    const prevFilmsCount = ShowingFilmsCount;
    ShowingFilmsCount = ShowingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    films.slice(prevFilmsCount, ShowingFilmsCount)
      .forEach((film) => renderFilm(mainFilmsListContainer, siteBodyElement, film));

    if (ShowingFilmsCount >= films.length) {
      showMoreButton.remove();
      showMoreButton.removeEventListener(`click`, onShowMoreButtonClick);
      showMoreButtonComponent.removeElement();
    }
  };

  showMoreButton.addEventListener(`click`, onShowMoreButtonClick);
};

render(siteHeaderElement, new UserProfileComponent(user).getElement());
render(siteMainElement, new FiltersComponent(filters).getElement());
render(siteMainElement, new SortingComponent().getElement());
render(siteMainElement, new FilmListComponent().getElement());

const mainFilmsListContainer = siteMainElement.querySelector(`.films-list__container`);

const films = generateFilms(FILMS_COUNT);

renderFilmsList(mainFilmsListContainer, films);

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

const filmsInside = generateFilmsInside();
render(footerStatisticsElement, new FooterStatisticsComponent(filmsInside).getElement());
