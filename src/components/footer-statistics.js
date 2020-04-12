const createFooterStatisticsTemplate = (movies) => {

  let formattedMovies = new Intl.NumberFormat(`ru-RU`).format(movies);
  return `<p>${formattedMovies} movies inside</p>`;
};

export {createFooterStatisticsTemplate};
