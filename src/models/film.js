class Film {
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

  toRAW(clone = false) {
    return {
      "id": this.id,
      "comments": clone ? this.comments : this.comments.map(({id}) => id),
      "film_info": {
        "title": this.title,
        "alternative_title": this.originalTitle,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ageRate,
        "director": this.productionTeam.director,
        "writers": this.productionTeam.writers,
        "actors": this.productionTeam.actors,
        "release": {
          "date": this.release,
          "release_country": this.country
        },
        "runtime": this.runtime,
        "genre": this.genres,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.inWatchlist,
        "already_watched": this.isWatched,
        "watching_date": this.watchingDate,
        "favorite": this.isFavorite
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
    return new Film(data.toRAW(true));
  }
}

export default Film;

