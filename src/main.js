import {createUserProfileTemplate} from './components/user-profile.js';
import {createFiltersTemplate} from './components/filter.js';
import {createSortTemplate} from './components/sorting.js';
import {createFilmListTemplate} from './components/films-list.js';
import {createFilmListExtraTemplate} from './components/films-list-extra.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-btn.js';
import {createFooterStatisticsTemplate} from './components/footer-statistics.js';
import {createFilmDetailsTemplate} from './components/film-details.js';
import {createCommentsTemplate} from './components/film-comments.js';
import {createCommentTemplate} from './components/film-comment.js';

import {generateFilms} from './mock/film.js';
import {generateComments} from './mock/comments.js';
import {generateUser} from './mock/user.js';
import {generateFilters} from './mock/filter.js';


import {ExtraListNames} from './const.js';
import {getRandomArrayItem, getRandomIntegerNumber} from './utils.js';

const FILMS_COUNT = 25;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_NUM = 2;

const moviesInsideRange = {
  FROM: 1000,
  TO: 500000
};

const render = (container, element, place = `beforeend`) => {
  container.insertAdjacentHTML(place, element);
};
const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

const user = generateUser();
const filters = generateFilters();

render(siteHeaderElement, createUserProfileTemplate(user));
render(siteMainElement, createFiltersTemplate(filters));
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmListTemplate());

const mainFilmsListContainer = siteMainElement.querySelector(`.films-list__container`);

const films = generateFilms(FILMS_COUNT);
let ShowingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

films.slice(0, ShowingFilmsCount).forEach((film) => render(mainFilmsListContainer, createFilmCardTemplate(film)));

const filmsBoardElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsBoardElement.querySelector(`.films-list`);

render(filmsListElement, createShowMoreButtonTemplate());
const loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = ShowingFilmsCount;
  ShowingFilmsCount = ShowingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  films.slice(prevFilmsCount, ShowingFilmsCount)
    .forEach((film) => render(mainFilmsListContainer, createFilmCardTemplate(film)));

  if (ShowingFilmsCount >= films.length) {
    loadMoreButton.remove();
  }
});

render(filmsBoardElement, createFilmListExtraTemplate(ExtraListNames.RATED));
render(filmsBoardElement, createFilmListExtraTemplate(ExtraListNames.COMMENTED));

const extraFilmLists = filmsBoardElement.querySelectorAll(`.films-list--extra`);

const [topRated, mostCommented] = extraFilmLists;
const topRatedFilmsListContainer = topRated.querySelector(`.films-list__container`);
const mostCommentedFilmsListContainer = mostCommented.querySelector(`.films-list__container`);

for (let i = 0; i < EXTRA_FILMS_NUM; i++) {
  render(topRatedFilmsListContainer, createFilmCardTemplate(getRandomArrayItem(films)));
  render(mostCommentedFilmsListContainer, createFilmCardTemplate(getRandomArrayItem(films)));
}

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

const filmsInside = getRandomIntegerNumber(moviesInsideRange.FROM, moviesInsideRange.TO);
render(footerStatisticsElement, createFooterStatisticsTemplate(filmsInside));

const randomFilmForPopup = getRandomArrayItem(films);
render(siteBodyElement, createFilmDetailsTemplate(randomFilmForPopup));

const commentsCount = getRandomIntegerNumber(1, 8);
const comments = generateComments(commentsCount);

const commentContainer = siteBodyElement.querySelector(`.film-details__comments-wrap`);
render(commentContainer, createCommentsTemplate(comments));

const commentsListElement = commentContainer.querySelector(`.film-details__comments-list`);

for (let i = 0; i < commentsCount; i++) {
  render(commentsListElement, createCommentTemplate(comments[i]));
}
