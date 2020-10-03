import scrollToggler from './scrollToggler';

const mobileMenu = (
  menuSelector = 'navigation',
  btnSelector = 'mobile-menu-toggler',
  menuContainer = 'header'
) => {
  const menu = document.querySelector(`.${menuSelector}`);
  const btn = document.querySelector(`.${btnSelector}`);
  const paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';

  const toggleMenu = () => {
    menu.style.transition = 'all 0.3s ease 0s';
    menu.classList.toggle('active');
    btn.classList.toggle('active');
    scrollToggler(menu);
    setTimeout(() => {
      menu.style.transition = '';
    }, 350);
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  window.addEventListener('click', (e) => {
    if (
      menu.classList.contains('active') &&
      !e.target.closest(`.${menuContainer}`)
    ) {
      toggleMenu();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (menu.classList.contains('active') && e.code === 'Escape') {
      toggleMenu();
    }
  });
};

export default mobileMenu;
