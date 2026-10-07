document.querySelectorAll('[data-premium-gallery]').forEach((gallery) => {
  const mainImage = gallery.querySelector('[data-premium-main-image]');
  const thumbnails = gallery.querySelectorAll('[data-premium-image]');

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
      mainImage.src = thumbnail.dataset.premiumImage;
      mainImage.alt = thumbnail.dataset.premiumAlt;
      thumbnails.forEach((item) => {
        const isActive = item === thumbnail;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
    });
  });
});
