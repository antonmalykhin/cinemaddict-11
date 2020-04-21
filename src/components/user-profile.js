import AbstractComponent from './abstract-component';

const createUserProfileTemplate = (user) => {
  const {userName, avatar} = user;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userName}</p>
      <img class="profile__avatar" src=${avatar} alt="Avatar" width="35" height="35">
    </section>`
  );
};

class UserProfile extends AbstractComponent {
  constructor(user) {
    super();

    this._user = user;
  }

  getTemplate() {
    return createUserProfileTemplate(this._user);
  }
}

export default UserProfile;
