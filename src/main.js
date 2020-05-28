import API from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import FilmBoardComponent from './components/film-board.js';
import FilterController from './controllers/filter.js';
import FilmsModel from './models/films.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import LoadingComponent from './components/loading.js';
import PageController from './controllers/page.js';
import SortingComponent from './components/sorting.js';
import StatisticComponent from './components/statistic.js';
import UserProfileComponent from './components/user-profile.js';
import {render, remove} from './utils/render.js';

const AUTHORIZATION = `Basic wnbu509u29385r2895629idfusafr43856ruya38456idyuwyi4394sfdlkh`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const TITLE_STATUS_TEXT = `offline`;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

const loadingComponent = new LoadingComponent();
const sortingComponent = new SortingComponent();
const filmBoardComponent = new FilmBoardComponent();
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new FilmsModel();

render(siteMainElement, loadingComponent);

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);

    remove(loadingComponent);
    render(siteHeaderElement, new UserProfileComponent(films));
    render(siteMainElement, sortingComponent);
    render(siteMainElement, filmBoardComponent);

    const filterController = new FilterController(siteMainElement, filmsModel, () => {
      pageController.show();
      sortingComponent.show();
      statisticComponent.hide();
      statisticComponent.setDefaultFilter();
    });

    filterController.render();

    const pageController = new PageController(filmBoardComponent, sortingComponent, filmsModel, apiWithProvider);
    pageController.render();

    const statisticComponent = new StatisticComponent(filmsModel);
    render(siteMainElement, statisticComponent);
    statisticComponent.hide();

    const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

    render(footerStatisticsElement, new FooterStatisticsComponent(filmsModel));

    filterController.setOnStatisticClick(() => {
      statisticComponent.rerender();
      pageController.hide();
      statisticComponent.show();
    });
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [${TITLE_STATUS_TEXT}]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [${TITLE_STATUS_TEXT}]`;
});
