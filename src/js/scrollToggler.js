const scrollToggler = (targetElement, activeClass = 'active') => {
  //targetElement элемент у которого проверяется наличие класса
  //activeClass класс при наличии которого отключается скролл

  const scrollWidth = window.innerWidth - document.body.offsetWidth + 'px';

  const fixedElements = document.querySelectorAll('[data-fixed]');

  if (targetElement.classList.contains(activeClass)) {
    document.body.style.overflowY = 'hidden';
    document.body.style.paddingRight = scrollWidth;
    fixedElements.forEach((el) => {
      if (el.dataset.fixed === 'outer') {
        el.style.marginRight = scrollWidth;
      } else if (el.dataset.fixed === 'inner') {
        el.style.paddingRight = scrollWidth;
      }
    });
  } else {
    document.body.style.overflowY = '';
    document.body.style.paddingRight = '';
    fixedElements.forEach((el) => {
      if (el.dataset.fixed === 'outer') {
        el.style.marginRight = '';
      } else if (el.dataset.fixed === 'inner') {
        el.style.paddingRight = '';
      }
    });
  }
};

export default scrollToggler;
