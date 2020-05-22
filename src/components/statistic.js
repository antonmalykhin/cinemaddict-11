import AbstractSmartComponent from './abstract-smart-component.js';
import {getFormattedTime, getUserRank} from '../utils/common.js';
import {StatisticFilters} from '../const.js';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const BAR_HEIGHT = 50;
const DEFAULT_FILTER = `all-time`;

const getAllGenre = (films) => {
  const genres = [];

  films.forEach((film) => genres.push(...film.genres));

  return genres;
};

const getGenresStatistic = (films) => {
  let genresStat;
  const genres = getAllGenre(films);

  if (genres.length) {
    genresStat = genres.reduce((acc, it) => {
      acc[it] = (acc[it] || 0) + 1;
      return acc;
    }, {});
  } else {
    genresStat = null;
  }


  return genresStat;
};

const getMostWatchedGenre = (statistic) => {
  return Object.entries(statistic).slice().sort((a, b) => a - b)[0][0];
};

const renderChart = (statisticCtx, films) => {

  const genresStatistic = getGenresStatistic(films);
  const genreLabels = Object.keys(genresStatistic);
  const genreValues = Object.values(genresStatistic);
  const genresStatisticLength = genreLabels.length;

  statisticCtx.height = BAR_HEIGHT * genresStatisticLength;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genreLabels,
      datasets: [{
        data: genreValues,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getPastDate = (filter) => {
  let pastDate;
  const currentDate = new Date();

  switch (filter) {
    case `today`:
      pastDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
      break;
    case `week`:
      pastDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
      break;
    case `month`:
      pastDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      break;
    case `year`:
      pastDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
      break;
    default:
      pastDate = null;
  }

  return pastDate;
};

const getFilmsByFilter = (filter, films) => {
  const pastDate = getPastDate(filter);

  return films.filter((film) => {
    const watchingDate = film.watchingDate;
    return pastDate ? watchingDate >= pastDate && watchingDate <= new Date() : film;
  });
};

const getSpendTime = (films) => {
  return films.reduce((acc, film) => acc + film.runtime, 0);
};

const createStatisticButtonTemplate = (attribute, filterName, isChecked) => {
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${attribute}" value="${attribute}" ${isChecked ? `checked` : ``}>
    <label for="statistic-${attribute}" class="statistic__filters-label">${filterName}</label>`
  );
};

const createStatisticFilterTemplate = (filter) => {
  return StatisticFilters.map((filterName) => {
    const attribute = filterName.toLowerCase().replace(` `, `-`);
    const isChecked = (filter === attribute);

    return createStatisticButtonTemplate(attribute, filterName, isChecked);
  }).join(`\n`);
};

const createStatisticTemplate = (films, filter, userRank) => {

  const filmStatistic = getGenresStatistic(films);
  const genre = filmStatistic ? getMostWatchedGenre(filmStatistic) : ``;

  const watchedFilmsCount = films.length;

  const spendTime = getSpendTime(films);

  const fullTime = getFormattedTime(spendTime);


  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${createStatisticFilterTemplate(filter)}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">${watchedFilmsCount < 10 ? `movie` : `movies`}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${fullTime.hours} <span class="statistic__item-description">h</span> ${fullTime.minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${genre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

class Statistic extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._filter = DEFAULT_FILTER;
    this._films = null;

    this._chart = null;

    this._getWatchedFilms();
    this._renderChart();
  }

  setDefaultFilter() {
    this._filter = DEFAULT_FILTER;
  }

  _getWatchedFilms() {
    return this._filmsModel.getFilmsAll().filter((film) => film.isWatched);
  }

  _getFilteredFilms() {
    return getFilmsByFilter(this._filter, this._getWatchedFilms());
  }

  _getUserRank() {
    const watchedFilms = this._getWatchedFilms();
    return getUserRank(watchedFilms.length);
  }

  getTemplate() {
    return createStatisticTemplate(this._getFilteredFilms(), this._filter, this._getUserRank());
  }

  recoveryListeners() {
    this._onFilterChange();
  }

  rerender() {
    super.rerender();

    this._films = this._getWatchedFilms();

    this._renderChart();
  }

  _renderChart() {
    const films = this._getFilteredFilms();
    const element = this.getElement();
    const ctx = element.querySelector(`.statistic__chart`);

    if (!films.length) {
      return;
    }

    this._chart = renderChart(ctx, films);
  }

  _onFilterChange() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        this._filter = evt.target.value;
        this.rerender();
      });
  }
}

export default Statistic;
