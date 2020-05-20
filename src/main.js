import UserProfileComponent from './components/user-profile.js';
import SortingComponent from './components/sorting.js';
import FilmBoardComponent from './components/film-board.js';
import StatisticComponent from './components/statistic.js';
import FooterStatisticsComponent from './components/footer-statistics.js';

import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';

import FilmsModel from './models/films.js';

import {generateFilms} from './mock/film.js';
import {generateFilmsInside} from './mock/filmsInside.js';

import {render} from './utils/render.js';

const FILMS_COUNT = 50;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

const sortingComponent = new SortingComponent();
const filmBoardComponent = new FilmBoardComponent();
const films = generateFilms(FILMS_COUNT);

render(siteHeaderElement, new UserProfileComponent(films));
render(siteMainElement, sortingComponent);
render(siteMainElement, filmBoardComponent);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterController = new FilterController(siteMainElement, filmsModel, () => {
  pageController.show();
  sortingComponent.show();
});
filterController.render();

const pageController = new PageController(filmBoardComponent, sortingComponent, filmsModel);
pageController.render();

const statisticComponent = new StatisticComponent();
render(siteMainElement, statisticComponent);

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);
const filmsInside = generateFilmsInside();

render(footerStatisticsElement, new FooterStatisticsComponent(filmsInside));

filterController.setOnStatisticClick(() => {
  pageController.hide();
  statisticComponent.show();
});
