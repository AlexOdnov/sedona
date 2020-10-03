import scrollToggler from './scrollToggler';

const modal = (modalSelector) => {
  const modalOpener = document.querySelectorAll(`.${modalSelector}-opener`);
  const modalOverlay = document.querySelector(`.modal-${modalSelector}`);
  const paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';

  const modalOpen = () => {
    modalOverlay.classList.add('active');
    scrollToggler(modalOverlay);
  };

  const modalClose = () => {
    modalOverlay.classList.remove('active');
    scrollToggler(modalOverlay);
  };

  modalOpener.forEach((element) => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      modalOpen();
    });
  });

  modalOverlay.addEventListener('click', (e) => {
    if (
      modalOverlay.classList.contains('active') &&
      !e.target.closest('.modal__content')
    ) {
      modalClose();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (modalOverlay.classList.contains('active') && e.code === 'Escape') {
      modalClose();
    }
  });
};

export default modal;
