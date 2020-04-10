const createFilmCardTemplate = (film) => {
  const {poster, title, rating, year, duration, genre, description, comments} = film;

  const filmDescription = description.length > 140 ? description.slice(0, 139).concat(`...`) : description;
  const filmCommentsCount = comments === 1 ? `${comments} comment` : `${comments} comments`;


  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${filmDescription}</p>
      <a class="film-card__comments">${filmCommentsCount}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button  film-card__controls-item--add-to-watchlist">Add   to watchlist</button>
        <button class="film-card__controls-item button  film-card__controls-item--mark-as-watched">Mark   as watched</button>
        <button class="film-card__controls-item button  film-card__controls-item--favorite">Mark as  favorite</button>
      </form>
    </article>`
  );
};

export {createFilmCardTemplate};
