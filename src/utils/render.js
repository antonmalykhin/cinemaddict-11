const RenderPosition = {
  AFTERBEGIN: `afterbefin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstChild;
};

const render = (container, component, position = RenderPosition.BEFOREEND) => {
  switch (position) {
    case `afterbefin`:
      container.prepend(component.getElement());
      break;
    case `beforeend`:
      container.append(component.getElement());
      break;
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {createElement, remove, render, RenderPosition};
