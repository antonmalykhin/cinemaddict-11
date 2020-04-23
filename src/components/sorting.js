import AbstractComponent from './abstract-component';
import {SortingType} from '../const.js';

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortingType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortingType.BY_DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortingType.BY_RATING}">Sort by rating</a></li>
    </ul>`
  );
};

class Sorting extends AbstractComponent {
  constructor() {
    super();

    this._currentSortingType = SortingType.DEFAULT;
  }
  getTemplate() {
    return createSortTemplate();
  }

  getSortingType() {
    return this._currentSortingType;
  }

  _setActive(target) {
    const sortButtons = this.getElement().querySelectorAll(`.sort__button`);

    sortButtons.forEach((it) => {
      if (it === target) {
        it.classList.add(`sort__button--active`);
      } else if (it.classList.contains(`sort__button--active`)) {
        it.classList.remove(`sort__button--active`);
      }
    });
  }

  setSortingTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortingType = evt.target.dataset.sortType;

      if (this._currentSortingType === sortingType) {
        return;
      }

      this._setActive(evt.target);

      this._currentSortingType = sortingType;

      handler(this._currentSortingType);
    });
  }
}

export default Sorting;

