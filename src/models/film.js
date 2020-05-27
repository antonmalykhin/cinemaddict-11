export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.poster = data[`film_info`][`poster`];
    this.ageRate = data[`film_info`][`age_rating`];
    this.title = data[`film_info`][`title`];
    this.productionTeam = {
      director: data[`film_info`][`director`],
      writers: data[`film_info`][`writers`],
      actors: data[`film_info`][`actors`]
    };
    this.originalTitle = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.release = data[`film_info`][`release`][`date`];
    this.runtime = data[`film_info`][`runtime`];
    this.genres = data[`film_info`][`genre`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.description = data[`film_info`][`description`];
    this.comments = data[`comments`];
    this.inWatchlist = data[`user_details`][`watchlist`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.isFavorite = data[`user_details`][`favorite`];
    this.watchingDate = data[`user_details`][`watching_date`];
  }

  static toRAW(data, clone = false) {
    return {
      "id": data.id,
      "comments": clone ? data.comments : data.comments.map(({id}) => id),
      "film_info": {
        "title": data.title,
        "alternative_title": data.originalTitle,
        "total_rating": data.rating,
        "poster": data.poster,
        "age_rating": data.ageRate,
        "director": data.productionTeam.director,
        "writers": data.productionTeam.writers,
        "actors": data.productionTeam.actors,
        "release": {
          "date": data.release,
          "release_country": data.country
        },
        "runtime": data.runtime,
        "genre": data.genres,
        "description": data.description
      },
      "user_details": {
        "watchlist": data.inWatchlist,
        "already_watched": data.isWatched,
        "watching_date": data.watchingDate,
        "favorite": data.isFavorite
      }
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(this.toRAW(data, true));
  }
}
