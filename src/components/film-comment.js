import {formatDate, formatTime} from '../utils/common.js';
import {DAY_IN_MILLISECONDS} from '../const.js';
import AbstractComponent from './abstract-component';


const createCommentTemplate = (comment) => {
  const {emoji, commentText, commentAuthor, date} = comment;

  const currentDate = new Date();

  let commentDateTime = `${formatDate(date)} ${formatTime(date)}`;

  if (currentDate - date <= DAY_IN_MILLISECONDS) {
    commentDateTime = `Today`;
  } else if (currentDate - date <= DAY_IN_MILLISECONDS * 2) {
    commentDateTime = `2 days ago`;
  }

  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${commentText}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${commentAuthor}</span>
        <span class="film-details__comment-day">${commentDateTime}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

class FilmComment extends AbstractComponent {
  constructor(comment) {
    super();

    this._comment = comment;
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }
}

export default FilmComment;

