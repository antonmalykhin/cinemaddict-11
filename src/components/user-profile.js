const createUserProfileTemplate = (user) => {
  const {userName, avatar} = user;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userName}</p>
      <img class="profile__avatar" src=${avatar} alt="Avatar" width="35" height="35">
    </section>`
  );
};

export {createUserProfileTemplate};
