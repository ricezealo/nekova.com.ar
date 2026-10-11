document.querySelectorAll('[data-premium-gallery]').forEach((gallery) => {
  if (gallery.dataset.galleryInitialized === 'true') return;
  gallery.dataset.galleryInitialized = 'true';

  const mainImage = gallery.querySelector('[data-premium-main-image]');
  const thumbnails = [...gallery.querySelectorAll('[data-premium-image]')];
  const previousButton = gallery.querySelector('[data-gallery-previous]');
  const nextButton = gallery.querySelector('[data-gallery-next]');
  const openButton = gallery.querySelector('[data-gallery-open]');
  const mainGalleryImage = gallery.querySelector('.premium-gallery-main');
  const lightbox = gallery.querySelector('[data-premium-lightbox]');
  const lightboxImage = gallery.querySelector('[data-lightbox-image]');
  const lightboxCaption = gallery.querySelector('[data-lightbox-caption]');
  let activeIndex = Math.max(0, thumbnails.findIndex((thumbnail) => thumbnail.classList.contains('is-active')));
  let swipeStart = null;
  let suppressImageClick = false;
  let lightboxSwipeStart = null;

  const setActiveImage = (index) => {
    if (!thumbnails.length) return;
    activeIndex = (index + thumbnails.length) % thumbnails.length;
    const thumbnail = thumbnails[activeIndex];
    mainImage.src = thumbnail.dataset.premiumImage;
    mainImage.alt = thumbnail.dataset.premiumAlt;
    lightboxImage.src = thumbnail.dataset.premiumImage;
    lightboxImage.alt = thumbnail.dataset.premiumAlt;
    lightboxCaption.textContent = thumbnail.dataset.premiumAlt;
    openButton.setAttribute('aria-label', `Ampliar imagen: ${thumbnail.dataset.premiumAlt}`);
    thumbnails.forEach((item, itemIndex) => {
      const isActive = itemIndex === activeIndex;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
  };

  const moveBy = (step) => setActiveImage(activeIndex + step);

  mainGalleryImage.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)
      || event.target.closest('[data-gallery-previous], [data-gallery-next]')) {
      return;
    }

    swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  });

  mainGalleryImage.addEventListener('pointerup', (event) => {
    if (!swipeStart || swipeStart.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;
    swipeStart = null;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

    suppressImageClick = true;
    moveBy(deltaX < 0 ? 1 : -1);
    window.setTimeout(() => {
      suppressImageClick = false;
    }, 0);
  });

  mainGalleryImage.addEventListener('pointercancel', () => {
    swipeStart = null;
  });

  const lightboxContent = lightbox.querySelector('.premium-lightbox-content');
  lightboxContent.addEventListener('pointerdown', (event) => {
    if (!lightbox.open || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)
      || event.target.closest('button')) {
      return;
    }

    lightboxSwipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  });

  lightboxContent.addEventListener('pointerup', (event) => {
    if (!lightboxSwipeStart || lightboxSwipeStart.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - lightboxSwipeStart.x;
    const deltaY = event.clientY - lightboxSwipeStart.y;
    lightboxSwipeStart = null;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    moveBy(deltaX < 0 ? 1 : -1);
  });

  lightboxContent.addEventListener('pointercancel', () => {
    lightboxSwipeStart = null;
  });

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      setActiveImage(index);
    });
  });

  previousButton.addEventListener('click', () => moveBy(-1));
  nextButton.addEventListener('click', () => moveBy(1));
  openButton.addEventListener('click', (event) => {
    if (suppressImageClick) {
      event.preventDefault();
      suppressImageClick = false;
      return;
    }

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
