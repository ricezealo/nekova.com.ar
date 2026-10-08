(() => {
  const initializeImageCarousels = (container = document) => {
    container.querySelectorAll('[data-home-image-carousel]').forEach((carousel) => {
      if (carousel.dataset.carouselInitialized) return;

      const image = carousel.querySelector('.nekova-home-product-image-link img');
      const images = [...carousel.querySelectorAll('[data-carousel-image]')];
      const previousButton = carousel.querySelector('[data-carousel-previous]');
      const nextButton = carousel.querySelector('[data-carousel-next]');

      if (!image || images.length === 0 || !previousButton || !nextButton) {
        carousel.querySelector('.nekova-home-image-controls')?.setAttribute('hidden', '');
        return;
      }

      carousel.dataset.carouselInitialized = 'true';
      let currentIndex = images.findIndex((item) => new URL(item.dataset.carouselImage, document.baseURI).pathname === new URL(image.src).pathname);
      if (currentIndex < 0) currentIndex = 0;

      const showImage = (index) => {
        currentIndex = index;
        const selectedImage = images[currentIndex];
        image.src = selectedImage.dataset.carouselImage;
        image.alt = selectedImage.dataset.carouselAlt;
        previousButton.disabled = currentIndex === 0;
      };

      previousButton.addEventListener('click', () => {
        if (currentIndex > 0) showImage(currentIndex - 1);
      });

      nextButton.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
          showImage(currentIndex + 1);
          return;
        }

        window.location.assign(carousel.querySelector('.nekova-home-product-image-link').href);
      });

      showImage(currentIndex);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeImageCarousels(), { once: true });
  } else {
    initializeImageCarousels();
  }

  document.addEventListener('shopify:section:load', (event) => {
    initializeImageCarousels(event.target);
  });
})();
