import {createElement} from '../utils.js';

const createUserProfileTemplate = (user) => {
  const {userName, avatar} = user;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userName}</p>
      <img class="profile__avatar" src=${avatar} alt="Avatar" width="35" height="35">
    </section>`
  );
};

class UserProfile {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createUserProfileTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default UserProfile;
