(() => {
  const initializeProductFilters = (container = document) => {
    container.querySelectorAll('[data-home-product-filters]').forEach((filters) => {
      if (filters.dataset.filtersInitialized) return;

      const section = filters.closest('.nekova-home');
      const products = [...section.querySelectorAll('[data-home-product-category]')];
      const count = section.querySelector('[data-home-product-count]');
      const emptyMessage = section.querySelector('[data-home-filter-empty]');
      const buttons = [...filters.querySelectorAll('[data-home-product-filter]')];

      if (!products.length || !buttons.length || !count || !emptyMessage) return;

      filters.dataset.filtersInitialized = 'true';
      const setFilter = (category) => {
        let visibleCount = 0;

        products.forEach((product) => {
          const visible = category === 'all' || product.dataset.homeProductCategory === category;
          product.hidden = !visible;
          if (visible) visibleCount += 1;
        });

        count.textContent = `${visibleCount} ${visibleCount === 1 ? 'OBJETO' : 'OBJETOS'}`;
        emptyMessage.hidden = visibleCount > 0;
        buttons.forEach((button) => {
          button.setAttribute('aria-pressed', String(button.dataset.homeProductFilter === category));
        });
      };

      buttons.forEach((button) => {
        button.addEventListener('click', () => setFilter(button.dataset.homeProductFilter));
      });

      section.querySelectorAll('[data-home-category-link]').forEach((link) => {
        link.addEventListener('click', () => {
          const category = link.dataset.homeCategoryLink;
          const matchingButton = buttons.find((button) => button.dataset.homeProductFilter === category);
          if (matchingButton) setFilter(category);
        });
      });
    });
  };

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
      let swipeStart = null;
      let suppressImageClick = false;

      const showImage = (index) => {
        currentIndex = index;
        const selectedImage = images[currentIndex];
        image.src = selectedImage.dataset.carouselImage;
        image.alt = selectedImage.dataset.carouselAlt;
        previousButton.disabled = currentIndex === 0;
      };

      carousel.addEventListener('pointerdown', (event) => {
        if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)
          || event.target.closest('[data-carousel-previous], [data-carousel-next]')) {
          return;
        }

        swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      });

      carousel.addEventListener('pointerup', (event) => {
        if (!swipeStart || swipeStart.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - swipeStart.x;
        const deltaY = event.clientY - swipeStart.y;
        swipeStart = null;

        if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

        const nextIndex = currentIndex + (deltaX < 0 ? 1 : -1);
        if (nextIndex < 0) return;
        if (nextIndex >= images.length) {
          window.location.assign(carousel.querySelector('.nekova-home-product-image-link').href);
          return;
        }

        suppressImageClick = true;
        showImage(nextIndex);
        window.setTimeout(() => {
          suppressImageClick = false;
        }, 0);
      });

      carousel.addEventListener('pointercancel', () => {
        swipeStart = null;
      });

      carousel.addEventListener('click', (event) => {
        if (!suppressImageClick) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressImageClick = false;
      }, true);

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
    document.addEventListener('DOMContentLoaded', () => {
      initializeProductFilters();
      initializeImageCarousels();
    }, { once: true });
  } else {
    initializeProductFilters();
    initializeImageCarousels();
  }

  document.addEventListener('shopify:section:load', (event) => {
    initializeProductFilters(event.target);
    initializeImageCarousels(event.target);
  });
})();
