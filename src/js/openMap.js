const openMap = () => {
  const mapContainer = document.querySelector('.map');
  const windowHeight = document.documentElement.clientHeight;

  const mapCreate = () => {
    const width = mapContainer.offsetWidth;
    const height = mapContainer.offsetHeight;

    const iframe = document.createElement('iframe');

    iframe.width = width;
    iframe.height = height;
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';
    iframe.id = 'iframeMap';
    iframe.src =
      'https://www.openstreetmap.org/export/embed.html?bbox=-111.90673828125001%2C34.80802473859517%2C-111.6200637817383%2C34.93632635451757&amp;layer=mapnik';

    mapContainer.append(iframe);
  };

  const mapUpdate = () => {
    const width = mapContainer.offsetWidth;
    const height = mapContainer.offsetHeight;
    const map = mapContainer.querySelector('#iframeMap');

    map.width = width;
    map.height = height;
  };

  const mapInitializer = () => {
    const mapCoord = mapContainer.getBoundingClientRect().top;

    if (mapCoord <= windowHeight * 2) {
      mapCreate();

      window.removeEventListener('scroll', mapInitializer);
      window.addEventListener('resize', mapUpdate);
    }
  };

  window.addEventListener('scroll', mapInitializer);
};

export default openMap;
