import AbstractComponent from './abstract-component';
import {getUserRank} from '../utils/common.js';

const DEFAULT_AVATAR = `bitmap@2x.png`;

const createUserProfileTemplate = (films) => {
  const userRank = getUserRank(films);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/${DEFAULT_AVATAR}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

class UserProfile extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createUserProfileTemplate(this._films);
  }
}

export default UserProfile;
