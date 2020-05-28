import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {FilterType} from '../const.js';
import {getFilmsByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, filmsModel, onContentChange) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._onContentChange = onContentChange;

    this._filterComponent = null;
    this._currentFilter = FilterType.ALL;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setOnStatisticClick = this.setOnStatisticClick.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allFilms = this._filmsModel.getFilmsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      const filter = {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        isActive: filterType === this._currentFilter
      };

      return filter;
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterClickHandler(this._onFilterChange);

    if (this._onStatisticClickHandler) {
      this._filterComponent.setStatisticClickHandler(this._onStatisticClickHandler);
    }

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._currentFilter = filterType;
    this._onContentChange();
    this.render();
  }

  _onDataChange() {
    this.render();
  }

  setOnStatisticClick(handler) {
    this._filterComponent.setStatisticClickHandler(handler);

    this._onStatisticClickHandler = handler;
  }
}
