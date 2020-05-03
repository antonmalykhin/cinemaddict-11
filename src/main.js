import UserProfileComponent from './components/user-profile.js';
import SortingComponent from './components/sorting';
import FilmBoardComponent from './components/film-board.js';
import FooterStatisticsComponent from './components/footer-statistics.js';

import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';

import FilmsModel from './models/films.js';

import {generateFilms} from './mock/film.js';
import {generateUser} from './mock/user.js';
import {generateFilmsInside} from './mock/filmsInside.js';

import {render} from './utils/render.js';

const FILMS_COUNT = 10;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

const user = generateUser();

render(siteHeaderElement, new UserProfileComponent(user));

const sortingComponent = new SortingComponent();
const filmBoardComponent = new FilmBoardComponent();
const films = generateFilms(FILMS_COUNT);

render(siteMainElement, sortingComponent);
render(siteMainElement, filmBoardComponent);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterController = new FilterController(siteMainElement, filmsModel);
filterController.render();

const pageController = new PageController(filmBoardComponent, sortingComponent, filmsModel);
pageController.render();

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);
const filmsInside = generateFilmsInside();

render(footerStatisticsElement, new FooterStatisticsComponent(filmsInside));
