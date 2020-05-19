import AbstractComponent from './abstract-component';

const createFilterItem = (filter) => {
  const {name, count, isActive} = filter;
  return (
    `<a href="#${name.toLowerCase()}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${name === `All` ? `${name} movies` : `${name} <span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createFiltersTemplate = (filters) => {
  const filterItems = filters.map((it) => createFilterItem(it)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItems}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

class Filters extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__items`)
      .addEventListener(`click`, (evt) => {

        if (evt.target.tagName !== `A`) {
          return;
        }

        let filterType = `${evt.target.hash}`.slice(1, evt.target.hash.length);
        handler(filterType[0].toUpperCase() + filterType.slice(1));
      });
  }
}

export default Filters;
