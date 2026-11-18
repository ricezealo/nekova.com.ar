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

  // Arrows react on touch release (when the finger did not move) so a tap right after a swipe
  // is never swallowed by the browser's gesture handling; mouse and keyboard keep using click.
  const onTap = (button, action) => {
    let touchStart = null;
    let handledByTouch = false;
    button.addEventListener('pointerdown', (event) => {
      touchStart = event.pointerType === 'touch' ? { x: event.clientX, y: event.clientY } : null;
    });
    button.addEventListener('pointerup', (event) => {
      if (!touchStart || event.pointerType !== 'touch') return;
      const moved = Math.abs(event.clientX - touchStart.x) > 10 || Math.abs(event.clientY - touchStart.y) > 10;
      touchStart = null;
      if (moved) return;
      handledByTouch = true;
      action();
      window.setTimeout(() => {
        handledByTouch = false;
      }, 500);
    });
    button.addEventListener('click', () => {
      if (handledByTouch) {
        handledByTouch = false;
        return;
      }
      action();
    });
  };

  onTap(previousButton, () => moveBy(-1));
  onTap(nextButton, () => moveBy(1));
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
  onTap(gallery.querySelector('[data-lightbox-previous]'), () => moveBy(-1));
  onTap(gallery.querySelector('[data-lightbox-next]'), () => moveBy(1));
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

  gallery.addEventListener('premium:show-image', (event) => {
    const target = new URL(event.detail.src, document.baseURI).href;
    const index = thumbnails.findIndex((thumbnail) => new URL(thumbnail.dataset.premiumImage, document.baseURI).href === target);
    if (index >= 0) setActiveImage(index);
  });

  if (thumbnails.length < 2) {
    previousButton.hidden = true;
    nextButton.hidden = true;
    gallery.querySelector('[data-lightbox-previous]').hidden = true;
    gallery.querySelector('[data-lightbox-next]').hidden = true;
  }

  setActiveImage(activeIndex);
});

document.querySelectorAll('[data-premium-variant-picker]').forEach((picker) => {
  if (picker.dataset.pickerInitialized === 'true') return;
  picker.dataset.pickerInitialized = 'true';

  const gallery = picker.closest('[data-premium-product], .premium-landing')?.querySelector('[data-premium-gallery]');
  const label = picker.querySelector('[data-premium-variant-label]');
  const preview = picker.querySelector('[data-premium-variant-preview]');

  const showVariant = (input, updateUrl) => {
    if (label) label.textContent = input.dataset.variantTitle;
    if (preview && input.dataset.variantImage) {
      const previewImage = preview.querySelector('img');
      previewImage.src = input.dataset.variantImage;
      previewImage.alt = `Color elegido: ${input.dataset.variantTitle}`;
      preview.hidden = false;
    }
    if (gallery && input.dataset.variantImage) {
      gallery.dispatchEvent(new CustomEvent('premium:show-image', { detail: { src: input.dataset.variantImage } }));
    }
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', input.value);
      window.history.replaceState(window.history.state, '', url);
    }
  };

  picker.addEventListener('change', (event) => {
    if (event.target.matches('input[name="id"]')) showVariant(event.target, true);
  });

  const checked = picker.querySelector('input[name="id"]:checked');
  if (checked) showVariant(checked, false);
});

document.querySelectorAll('[data-nk-qty]').forEach((stepper) => {
  if (stepper.dataset.qtyInitialized === 'true') return;
  stepper.dataset.qtyInitialized = 'true';

  const input = stepper.querySelector('input[name="quantity"]');
  const min = Number(input.min) || 1;
  const max = Number(input.max) || 99;
  const clamp = (value) => Math.min(max, Math.max(min, Number.isFinite(value) ? Math.round(value) : min));

  stepper.querySelectorAll('[data-nk-qty-step]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = clamp(Number(input.value) + Number(button.dataset.nkQtyStep));
    });
  });
  input.addEventListener('change', () => {
    input.value = clamp(Number(input.value));
  });
});

// Horizontal card rows that auto-advance while they actually scroll (mobile), are visible and untouched.
document.querySelectorAll('[data-nk-autoplay]').forEach((track) => {
  if (track.dataset.autoplayInitialized === 'true') return;
  track.dataset.autoplayInitialized = 'true';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const interval = Number(track.dataset.nkAutoplay) || 3000;
  const items = [...track.children];
  let visible = false;
  let pausedUntil = 0;

  const pause = () => {
    pausedUntil = Date.now() + 8000;
  };
  ['pointerdown', 'touchstart', 'wheel', 'focusin'].forEach((type) => track.addEventListener(type, pause, { passive: true }));

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0.5 }).observe(track);

  window.setInterval(() => {
    if (!visible || document.hidden || Date.now() < pausedUntil) return;
    if (track.scrollWidth <= track.clientWidth + 4) return;
    const start = items[0].offsetLeft;
    const current = items.reduce((best, item, index) => (
      Math.abs(item.offsetLeft - start - track.scrollLeft) < Math.abs(items[best].offsetLeft - start - track.scrollLeft) ? index : best
    ), 0);
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const next = atEnd ? 0 : (current + 1) % items.length;
    track.scrollTo({ left: items[next].offsetLeft - start, behavior: 'smooth' });
  }, interval);
});

// Combo: adds the selected variant (with its quantity) plus the complementary product, then opens the cart.
document.querySelectorAll('[data-nk-combo]').forEach((combo) => {
  if (combo.dataset.comboInitialized === 'true') return;
  combo.dataset.comboInitialized = 'true';
  const button = combo.querySelector('[data-nk-combo-add]');
  const error = combo.querySelector('[data-nk-combo-error]');
  const form = combo.parentElement.querySelector('form.nk-buy-form');
  if (!button || !form) return;
  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  button.addEventListener('click', async () => {
    const selected = form.querySelector('input[name="id"]:checked') || form.querySelector('input[name="id"]');
    const quantity = Number(form.querySelector('input[name="quantity"]')?.value) || 1;
    if (!selected) return;
    button.setAttribute('aria-busy', 'true');
    error.hidden = true;
    try {
      const response = await fetch(`${root}cart/add.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [
          { id: Number(selected.value), quantity },
          { id: Number(button.dataset.comboVariant), quantity: 1 },
        ] }),
      });
      if (!response.ok) throw new Error(String(response.status));
      window.location.href = `${root}cart`;
    } catch {
      error.hidden = false;
      button.removeAttribute('aria-busy');
    }
  });
});

// Multi-option picker (e.g. Color + Talle): resolves the variant from the selected values.
document.querySelectorAll('[data-nk-multi-picker]').forEach((picker) => {
  if (picker.dataset.multiInitialized === 'true') return;
  picker.dataset.multiInitialized = 'true';
  const variants = JSON.parse(picker.querySelector('[data-nk-variants]').textContent);
  const idInput = picker.querySelector('input[name="id"]');
  const status = picker.querySelector('[data-nk-multi-status]');
  const form = picker.closest('form');
  const submit = form?.querySelector('button[name="add"]');
  const submitLabel = submit?.querySelector('span');
  const submitText = submitLabel?.textContent;
  const gallery = picker.closest('[data-premium-product]')?.querySelector('[data-premium-gallery]');
  const groups = [...picker.querySelectorAll('[data-nk-option]')];

  const update = (updateUrl) => {
    const selected = groups.map((group) => group.querySelector('input:checked')?.value);
    groups.forEach((group, index) => {
      const label = group.querySelector('[data-nk-option-label]');
      if (label) label.textContent = selected[index] || '';
    });
    const variant = variants.find((item) => item.options.every((value, index) => value === selected[index]));
    const available = Boolean(variant && variant.available);
    if (variant) idInput.value = variant.id;
    if (status) status.hidden = available;
    if (submit) {
      submit.disabled = !available;
      if (submitLabel) submitLabel.textContent = available ? submitText : 'Sin stock';
    }
    if (variant && variant.image && gallery && updateUrl) {
      gallery.dispatchEvent(new CustomEvent('premium:show-image', { detail: { src: variant.image } }));
    }
    if (variant && updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState(window.history.state, '', url);
    }
  };
  picker.addEventListener('change', () => update(true));
  update(false);
});

// Quantity tiers: choosing a tier sets the quantity; the highlighted tier follows the quantity.
document.querySelectorAll('[data-nk-tiers]').forEach((tiers) => {
  if (tiers.dataset.tiersInitialized === 'true') return;
  tiers.dataset.tiersInitialized = 'true';
  const buttons = [...tiers.querySelectorAll('[data-nk-tier]')];
  const qty = tiers.closest('[data-premium-product]')?.querySelector('[data-nk-qty] input');
  const highlight = () => {
    const value = Number(qty?.value) || 1;
    const active = buttons.filter((button) => Number(button.dataset.nkTier) <= value).pop();
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));
  };
  buttons.forEach((button) => button.addEventListener('click', () => {
    if (!qty) return;
    qty.value = button.dataset.nkTier;
    qty.dispatchEvent(new Event('change', { bubbles: true }));
    highlight();
  }));
  qty?.addEventListener('change', highlight);
  qty?.closest('[data-nk-qty]')?.addEventListener('click', () => setTimeout(highlight));
  highlight();
});

// Pack builder (multi-option products with quantity tiers): from 2 units on, one row per unit with its own
// options, so colors and sizes can be mixed; all rows go to the cart together and the tier discount applies there.
document.querySelectorAll('[data-nk-pack]').forEach((pack) => {
  if (pack.dataset.packInitialized === 'true') return;
  pack.dataset.packInitialized = 'true';
  const form = pack.closest('form');
  const product = pack.closest('[data-premium-product]');
  const picker = form?.querySelector('[data-nk-multi-picker]');
  const tiers = product?.querySelector('[data-nk-tiers]');
  if (!form || !picker || !tiers) return;
  const variants = JSON.parse(picker.querySelector('[data-nk-variants]').textContent);
  const groups = [...picker.querySelectorAll('[data-nk-option]')];
  const options = groups.map((group) => ({
    name: group.dataset.nkOptionName || '',
    values: [...group.querySelectorAll('input[type="radio"]')].map((input) => input.value),
  }));
  const tierButtons = [...tiers.querySelectorAll('[data-nk-tier]')];
  const tierList = tierButtons.map((button) => ({ qty: Number(button.dataset.nkTier), price: Number(button.dataset.nkTierPrice) }));
  const rowsList = pack.querySelector('[data-nk-pack-rows]');
  const countLabel = pack.querySelector('[data-nk-pack-count]');
  const totalLabel = pack.querySelector('[data-nk-pack-total]');
  const more = pack.querySelector('[data-nk-pack-more]');
  const error = pack.querySelector('[data-nk-pack-error]');
  const icon = pack.querySelector('[data-nk-pack-icon]')?.innerHTML || '×';
  const qtyBox = form.querySelector('[data-nk-qty]');
  const submit = form.querySelector('button[name="add"]');
  const submitLabel = submit?.querySelector('span');
  const submitText = submitLabel?.textContent;
  const gallery = product.querySelector('[data-premium-gallery]');
  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  const MIN = 2;
  const MAX = 10;
  const money = (cents) => `$${Math.round(cents / 100).toLocaleString('es-AR')}`;
  let active = false;

  const rows = () => [...rowsList.children];
  const rowValues = (row) => [...row.querySelectorAll('select')].map((select) => select.value);
  const rowVariant = (row) => {
    const values = rowValues(row);
    return variants.find((item) => item.options.every((value, index) => value === values[index]));
  };
  const current = () => groups.map((group) => group.querySelector('input:checked')?.value);

  const refresh = () => {
    const list = rows();
    const count = list.length;
    let ok = true;
    list.forEach((row, index) => {
      row.querySelector('strong').textContent = `Par ${index + 1}`;
      const variant = rowVariant(row);
      const available = Boolean(variant && variant.available);
      row.classList.toggle('is-unavailable', !available);
      row.querySelector('.nk-pack-row-status').hidden = available;
      row.querySelector('.nk-pack-remove').hidden = count <= MIN;
      if (!available) ok = false;
    });
    const tier = tierList.filter((item) => item.qty <= count).pop() || tierList[0];
    countLabel.textContent = `${count} pares`;
    totalLabel.textContent = tier ? `${money(tier.price * count)} (${money(tier.price)} c/u)` : '';
    tierButtons.forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.nkTier) === tier?.qty)));
    more.hidden = count >= MAX;
    if (submit) {
      submit.disabled = !ok;
      if (submitLabel) submitLabel.textContent = ok ? `Agregar ${count} pares al carrito` : 'Revisá los pares sin stock';
    }
  };

  const addRow = (values) => {
    const row = document.createElement('li');
    row.className = 'nk-pack-row';
    row.innerHTML = '<strong></strong>';
    options.forEach((option, index) => {
      const select = document.createElement('select');
      select.setAttribute('aria-label', option.name);
      option.values.forEach((value) => select.add(new Option(value, value, false, value === values[index])));
      row.append(select);
    });
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'nk-pack-remove';
    removeButton.setAttribute('aria-label', 'Quitar este par');
    removeButton.innerHTML = icon;
    removeButton.addEventListener('click', () => {
      rowsList.removeChild(row);
      error.hidden = true;
      refresh();
    });
    const status = document.createElement('p');
    status.className = 'nk-pack-row-status';
    status.textContent = 'Esta combinación no tiene stock.';
    status.hidden = true;
    row.append(removeButton, status);
    row.addEventListener('change', () => {
      error.hidden = true;
      const variant = rowVariant(row);
      if (variant && variant.image && gallery) gallery.dispatchEvent(new CustomEvent('premium:show-image', { detail: { src: variant.image } }));
      refresh();
    });
    rowsList.append(row);
  };

  const setCount = (count) => {
    if (count < MIN) {
      active = false;
      pack.hidden = true;
      picker.hidden = false;
      if (qtyBox) qtyBox.hidden = false;
      const qty = qtyBox?.querySelector('input');
      if (qty) qty.value = 1;
      tierButtons.forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.nkTier) === 1)));
      if (submitLabel) submitLabel.textContent = submitText;
      picker.dispatchEvent(new Event('change'));
      return;
    }
    const base = current();
    if (!active) rowsList.replaceChildren();
    active = true;
    pack.hidden = false;
    picker.hidden = true;
    if (qtyBox) qtyBox.hidden = true;
    while (rows().length < count) addRow(rows().length ? rowValues(rows().at(-1)) : base);
    while (rows().length > count) rowsList.removeChild(rows().at(-1));
    error.hidden = true;
    refresh();
  };

  // Capture phase: runs before the tiers handler, which would only change the quantity.
  tierButtons.forEach((button) => button.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    setCount(Number(button.dataset.nkTier));
  }, true));
  more.addEventListener('click', () => {
    addRow(rowValues(rows().at(-1)));
    refresh();
  });

  form.addEventListener('submit', async (event) => {
    if (!active) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const items = [];
    rows().forEach((row) => {
      const variant = rowVariant(row);
      if (!variant) return;
      const item = items.find((entry) => entry.id === variant.id);
      if (item) item.quantity += 1;
      else items.push({ id: variant.id, quantity: 1 });
    });
    if (!items.length) return;
    submit?.setAttribute('aria-busy', 'true');
    error.hidden = true;
    try {
      const response = await fetch(`${root}cart/add.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) throw new Error(String(response.status));
      window.location.href = `${root}cart`;
    } catch {
      error.hidden = false;
      submit?.removeAttribute('aria-busy');
    }
  }, true);
});

// Own-footage loops: play muted only while visible; with reduced motion they stay still and show controls.
document.querySelectorAll('[data-nk-loop]').forEach((video) => {
  if (video.dataset.loopInitialized === 'true') return;
  video.dataset.loopInitialized = 'true';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.controls = true;
    return;
  }
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (video.preload === 'none') video.preload = 'auto';
      video.play().catch(() => { video.controls = true; });
    } else {
      video.pause();
    }
  }, { threshold: 0.4 }).observe(video);
});

// Dispatch and delivery estimate in Argentina time (business days, skipping the holidays set in the theme).
document.querySelectorAll('[data-nk-dispatch]').forEach((el) => {
  if (el.dataset.dispatchInitialized === 'true') return;
  el.dataset.dispatchInitialized = 'true';
  const zone = 'America/Argentina/Buenos_Aires';
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  const today = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const cutoff = (Number(el.dataset.cutoff) || 13) * 60;
  const holidays = new Set((el.dataset.holidays || '').split(',').map((value) => {
    const [d, m, y] = value.trim().split('/').map(Number);
    return d && m && y ? Date.UTC(y, m - 1, d) : null;
  }).filter(Boolean));
  const isBusiness = (date) => date.getUTCDay() !== 0 && date.getUTCDay() !== 6 && !holidays.has(date.getTime());
  const addBusiness = (date, count) => {
    const next = new Date(date);
    let left = count;
    while (left > 0) {
      next.setUTCDate(next.getUTCDate() + 1);
      if (isBusiness(next)) left -= 1;
    }
    return next;
  };
  const sameDay = isBusiness(today) && minutes < cutoff;
  const dispatch = sameDay ? today : addBusiness(today, 1);
  const first = addBusiness(dispatch, Number(el.dataset.min) || 1);
  const last = addBusiness(dispatch, Number(el.dataset.max) || 3);
  const format = (date) => `${new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC', weekday: 'long' }).format(date)} ${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  let when;
  if (sameDay) {
    const left = cutoff - minutes;
    const hours = Math.floor(left / 60);
    const mins = left % 60;
    when = `Pedilo en los próximos <b>${hours ? `${hours} h ` : ''}${mins} min</b> y sale hoy.`;
  } else if (dispatch.getTime() === tomorrow.getTime()) {
    when = 'Pedilo hoy y sale <b>mañana</b>.';
  } else {
    when = `Pedilo hoy y sale el <b>${format(dispatch)}</b>.`;
  }
  el.innerHTML = `${when} Llega aprox. entre el ${format(first)} y el ${format(last)}.`;
  el.hidden = false;
});
