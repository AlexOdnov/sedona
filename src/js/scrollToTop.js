const scrollToTop = () => {
  const windowHeight = document.documentElement.clientHeight;
  const scrollButton = document.querySelector('.scroll-to-top');

  window.addEventListener('scroll', (e) => {
    if (window.pageYOffset > windowHeight) {
      scrollButton.classList.add('active');
    } else {
      scrollButton.classList.remove('active');
    }
  });

  scrollButton.addEventListener('click', (e) => {
    e.preventDefault;
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  });
};

export default scrollToTop;
