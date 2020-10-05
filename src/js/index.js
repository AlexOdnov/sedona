import mobileMenu from './mobileMenu';
import openMap from './openMap';
import mockVideo from './mockVideo';

mobileMenu();
if (document.querySelector('.map')) {
  openMap();
}
if (document.querySelector('.video')) {
  mockVideo();
}
