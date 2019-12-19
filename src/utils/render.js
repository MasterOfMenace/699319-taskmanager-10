const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

// const renderElement = (container, element, place) => {
//   switch (place) {
//     case RenderPosition.AFTERBEGIN:
//       container.prepend(element);
//       break;
//     case RenderPosition.BEFOREEND:
//       container.append(element);
//   }
// };

const renderElement = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
  }
};

const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};

export {RenderPosition, renderElement, createElement};
