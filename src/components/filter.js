import AbstractComponent from './abstract-component.js';
import {toTitleCase} from '../utils/common.js';

const FILTER_BUTTON_TAG = `A`;
const SLICE_FROM = 1;

const createFilterItem = ({name, count, isActive}) => {
  return (
    `<a href="#${name.toLowerCase()}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${name === `All` ? `${name} movies` : `${name} <span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createFiltersTemplate = (filters) => {
  const filterItems = filters
    .map((filter) => createFilterItem(filter))
    .join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItems}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  _removeStatisticActiveClass() {
    const statisticButton = this.getElement().querySelector(`.main-navigation__additional`);

    if (!statisticButton.classList.contains(`main-navigation__additional--active`)) {
      return;
    }

    statisticButton.classList.remove(`main-navigation__additional--active`);
  }

  _removeFilterActiveClass() {

    const activeFilterButton = this.getElement().querySelector(`.main-navigation__item--active`);

    if (!activeFilterButton) {
      return;
    }

    activeFilterButton.classList.remove(`main-navigation__item--active`);
  }

  _getFilterName(evt) {
    const filterType = `${evt.target.hash}`.slice(SLICE_FROM, evt.target.hash.length);

    return toTitleCase(filterType);
  }

  setFilterClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__items`)
      .addEventListener(`click`, (evt) => {

        if (evt.target.tagName !== FILTER_BUTTON_TAG) {
          return;
        }

        this._removeStatisticActiveClass();

        const filterType = this._getFilterName(evt);

        handler(filterType);
      });
  }

  setStatisticClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        this._removeFilterActiveClass();

        evt.target.classList.add(`main-navigation__item--active`);

        handler();
      });
  }
}
