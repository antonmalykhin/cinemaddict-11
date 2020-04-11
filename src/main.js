import {createUserProfileTemplate} from './components/user-profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sorting.js';
import {createFilmListTemplate} from './components/films-list.js';
import {createFilmListExtraTemplate} from './components/films-list-extra.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-btn.js';
import {createFooterStatisticsTemplate} from './components/footer-statistics.js';
import {createFilmDetailsTemplate} from './components/film-details.js';
import {createCommentsTemplate} from './components/film-comments.js';
import {createCommentTemplate} from './components/film-comment.js';

import {generateFilm} from './mock/film.js';
import {generateComments} from './mock/comments.js';

const FILMS_COUNT = 5;
const EXTRA_FILMS_NUM = 2;
const COMMENTS_COUNT = 4;

const render = (container, element, place = `beforeend`) => {
  container.insertAdjacentHTML(place, element);
};
const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

render(siteHeaderElement, createUserProfileTemplate());
render(siteMainElement, createMenuTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmListTemplate());

const mainFilmsListContainer = siteMainElement.querySelector(`.films-list__container`);

const film = generateFilm();

for (let i = 0; i < FILMS_COUNT; i++) {
  render(mainFilmsListContainer, createFilmCardTemplate(film));
}

const filmsBoardElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsBoardElement.querySelector(`.films-list`);

render(filmsListElement, createShowMoreButtonTemplate());
render(filmsBoardElement, createFilmListExtraTemplate(`Top rated`));
render(filmsBoardElement, createFilmListExtraTemplate(`Most commented`));

const extraFilmLists = filmsBoardElement.querySelectorAll(`.films-list--extra`);

const [topRated, mostCommented] = extraFilmLists;
const topRatedFilmsListContainer = topRated.querySelector(`.films-list__container`);
const mostCommentedFilmsListContainer = mostCommented.querySelector(`.films-list__container`);

for (let i = 0; i < EXTRA_FILMS_NUM; i++) {
  render(topRatedFilmsListContainer, createFilmCardTemplate(film));
  render(mostCommentedFilmsListContainer, createFilmCardTemplate(film));
}

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, createFooterStatisticsTemplate());
render(siteBodyElement, createFilmDetailsTemplate(film));


const comments = generateComments(COMMENTS_COUNT);

const commentContainer = siteBodyElement.querySelector(`.film-details__comments-wrap`);
render(commentContainer, createCommentsTemplate(comments));

const commentsListElement = commentContainer.querySelector(`.film-details__comments-list`);

for (let i = 0; i < COMMENTS_COUNT; i++) {
  render(commentsListElement, createCommentTemplate(comments[i]));
}
