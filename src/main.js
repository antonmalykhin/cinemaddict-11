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
import {getRandomArrayItem, getRandomIntegerNumber, render} from './utils.js';

const FILMS_COUNT = 25;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_NUM = 2;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

const user = generateUser();
const filters = generateFilters();

render(siteHeaderElement, new UserProfileComponent(user).getElement());
render(siteMainElement, new FiltersComponent(filters).getElement());
render(siteMainElement, new SortingComponent().getElement());
render(siteMainElement, new FilmListComponent().getElement());

const mainFilmsListContainer = siteMainElement.querySelector(`.films-list__container`);

const films = generateFilms(FILMS_COUNT);
let ShowingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

films.slice(0, ShowingFilmsCount).forEach((film) => render(mainFilmsListContainer, new FilmCardComponent(film).getElement()));

const filmsBoardElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsBoardElement.querySelector(`.films-list`);

render(filmsListElement, new ShowMoreButtonComponent().getElement());
const loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = ShowingFilmsCount;
  ShowingFilmsCount = ShowingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  films.slice(prevFilmsCount, ShowingFilmsCount)
    .forEach((film) => render(mainFilmsListContainer, new FilmCardComponent(film).getElement()));

  if (ShowingFilmsCount >= films.length) {
    loadMoreButton.remove();
  }
});

render(filmsBoardElement, new FilmListExtraComponent(ExtraListNames.RATED).getElement());
render(filmsBoardElement, new FilmListExtraComponent(ExtraListNames.COMMENTED).getElement());

const extraFilmLists = filmsBoardElement.querySelectorAll(`.films-list--extra`);

const [topRated, mostCommented] = extraFilmLists;
const topRatedFilmsListContainer = topRated.querySelector(`.films-list__container`);
const mostCommentedFilmsListContainer = mostCommented.querySelector(`.films-list__container`);

for (let i = 0; i < EXTRA_FILMS_NUM; i++) {
  render(topRatedFilmsListContainer, new FilmCardComponent(getRandomArrayItem(films)).getElement());
  render(mostCommentedFilmsListContainer, new FilmCardComponent(getRandomArrayItem(films)).getElement());
}

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

const filmsInside = generateFilmsInside();
render(footerStatisticsElement, new FooterStatisticsComponent(filmsInside).getElement());

const randomFilmForPopup = getRandomArrayItem(films);
render(siteBodyElement, new FilmDetailsComponent(randomFilmForPopup).getElement());

const commentsCount = getRandomIntegerNumber(1, 8);
const comments = generateComments(commentsCount);

const commentContainer = siteBodyElement.querySelector(`.film-details__comments-wrap`);
render(commentContainer, new FilmCommentsComponent(comments).getElement());

const commentsListElement = commentContainer.querySelector(`.film-details__comments-list`);

for (let i = 0; i < commentsCount; i++) {
  render(commentsListElement, new FilmCommentComponent(comments[i]).getElement());
}
