import {Emojis} from '../const.js';
import AbstractComponent from './abstract-component';

const createEmojiTemplate = (emoji) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  );
};

const createCommentsTemplate = (comments) => {
  const commentsCount = comments.length;
  const emojisTemplate = Emojis.map((it) => createEmojiTemplate(it)).join(`\n`);

  return (
    `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

    <ul class="film-details__comments-list"></ul>

    <div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojisTemplate}
      </div>
    </div>
    </section>`
  );
};

class FilmComments extends AbstractComponent {
  constructor(comments) {
    super();

    this._comments = comments;
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }
}

export default FilmComments;
