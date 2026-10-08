document.querySelectorAll('[data-premium-gallery]').forEach((gallery) => {
  if (gallery.dataset.galleryInitialized === 'true') return;
  gallery.dataset.galleryInitialized = 'true';

  const mainImage = gallery.querySelector('[data-premium-main-image]');
  const thumbnails = [...gallery.querySelectorAll('[data-premium-image]')];
  const previousButton = gallery.querySelector('[data-gallery-previous]');
  const nextButton = gallery.querySelector('[data-gallery-next]');
  const openButton = gallery.querySelector('[data-gallery-open]');
  const lightbox = gallery.querySelector('[data-premium-lightbox]');
  const lightboxImage = gallery.querySelector('[data-lightbox-image]');
  const lightboxCaption = gallery.querySelector('[data-lightbox-caption]');
  let activeIndex = Math.max(0, thumbnails.findIndex((thumbnail) => thumbnail.classList.contains('is-active')));

  const setActiveImage = (index) => {
    if (!thumbnails.length) return;
    activeIndex = (index + thumbnails.length) % thumbnails.length;
    const thumbnail = thumbnails[activeIndex];
    mainImage.src = thumbnail.dataset.premiumImage;
    mainImage.alt = thumbnail.dataset.premiumAlt;
    openButton.setAttribute('aria-label', `Ampliar imagen: ${thumbnail.dataset.premiumAlt}`);
    thumbnails.forEach((item, itemIndex) => {
      const isActive = itemIndex === activeIndex;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    if (lightbox.open) {
      lightboxImage.src = thumbnail.dataset.premiumImage;
      lightboxImage.alt = thumbnail.dataset.premiumAlt;
      lightboxCaption.textContent = thumbnail.dataset.premiumAlt;
    }
  };

  const moveBy = (step) => setActiveImage(activeIndex + step);

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      setActiveImage(index);
    });
  });

  previousButton.addEventListener('click', () => moveBy(-1));
  nextButton.addEventListener('click', () => moveBy(1));
  openButton.addEventListener('click', () => {
    setActiveImage(activeIndex);
    lightbox.showModal();
    gallery.querySelector('[data-lightbox-close]').focus();
  });
  gallery.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
  gallery.querySelector('[data-lightbox-previous]').addEventListener('click', () => moveBy(-1));
  gallery.querySelector('[data-lightbox-next]').addEventListener('click', () => moveBy(1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveBy(1);
    }
  });

  if (thumbnails.length < 2) {
    previousButton.hidden = true;
    nextButton.hidden = true;
    gallery.querySelector('[data-lightbox-previous]').hidden = true;
    gallery.querySelector('[data-lightbox-next]').hidden = true;
  }

  setActiveImage(activeIndex);
});
