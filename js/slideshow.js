/* ============================================
   slideshow.js - Module xem toàn bộ ảnh
   Chức năng: Slideshow fullscreen có nút mũi
   tên, dots, thumbnail, swipe trên mobile
   ============================================ */

const Slideshow = (() => {
  // ---- Danh sách toàn bộ ảnh album ----
  // Thay các URL này bằng đường dẫn ảnh thực trong assets/
  const ALL_PHOTOS = [
    { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80', alt: 'Ảnh cưới 1' },
    { src: 'https://images.unsplash.com/photo-1583939411023-14783179e581?w=800&q=80', alt: 'Ảnh cưới 2' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', alt: 'Ảnh cưới 3' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', alt: 'Ảnh cưới 4' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', alt: 'Ảnh cưới 5' },
    { src: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800&q=80', alt: 'Ảnh cưới 6' },
    { src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80', alt: 'Ảnh cưới 7' },
    { src: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80', alt: 'Ảnh cưới 8' },
    { src: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=800&q=80', alt: 'Ảnh cưới 9' },
  ];

  let currentIndex = 0;
  let overlayEl = null;
  let touchStartX = 0;
  let autoPlayId = null;

  // ---- Tạo HTML cho toàn bộ slideshow overlay ----
  function buildOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'slideshow-overlay';
    overlay.id = 'slideshow-overlay';

    // Nút đóng
    overlay.innerHTML = `
      <button class="slideshow-close" id="ss-close" aria-label="Đóng">✕</button>

      <!-- Vùng ảnh chính -->
      <div class="slideshow-main" id="ss-main">
        ${ALL_PHOTOS.map((p, i) => `
          <img class="slide-img${i === 0 ? ' active' : ''}"
               src="${p.src}" alt="${p.alt}" loading="lazy" />
        `).join('')}

        <!-- Nút điều hướng trái phải -->
        <button class="slide-btn prev" id="ss-prev" aria-label="Ảnh trước">&#8592;</button>
        <button class="slide-btn next" id="ss-next" aria-label="Ảnh tiếp">&#8594;</button>
      </div>

      <!-- Đếm ảnh -->
      <div class="slide-counter" id="ss-counter">1 / ${ALL_PHOTOS.length}</div>

      <!-- Dots -->
      <div class="slide-dots" id="ss-dots">
        ${ALL_PHOTOS.map((_, i) => `
          <button class="slide-dot${i === 0 ? ' active' : ''}" data-idx="${i}" aria-label="Ảnh ${i+1}"></button>
        `).join('')}
      </div>

      <!-- Thumbnail strip -->
      <div class="slide-thumbs" id="ss-thumbs">
        ${ALL_PHOTOS.map((p, i) => `
          <div class="slide-thumb${i === 0 ? ' active' : ''}" data-idx="${i}">
            <img src="${p.src}" alt="${p.alt}" loading="lazy" />
          </div>
        `).join('')}
      </div>

      <!-- Gợi ý swipe trên mobile -->
      <div class="slide-swipe-hint">← Vuốt để chuyển ảnh →</div>
    `;

    document.body.appendChild(overlay);
    overlayEl = overlay;

    // ---- Gắn các sự kiện ----
    overlay.querySelector('#ss-close').addEventListener('click', close);
    overlay.querySelector('#ss-prev').addEventListener('click', prev);
    overlay.querySelector('#ss-next').addEventListener('click', next);

    // Dots click
    overlay.querySelectorAll('.slide-dot').forEach(dot => {
      dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx)));
    });

    // Thumbnails click
    overlay.querySelectorAll('.slide-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => goTo(parseInt(thumb.dataset.idx)));
    });

    // Click ngoài vùng ảnh để đóng
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // ---- Touch swipe trên mobile ----
    const mainEl = overlay.querySelector('#ss-main');
    mainEl.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    mainEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { // Ngưỡng swipe 50px
        diff > 0 ? next() : prev();
      }
    }, { passive: true });

    // ---- Phím bàn phím ----
    document.addEventListener('keydown', handleKey);
  }

  // ---- Xử lý phím keyboard ----
  function handleKey(e) {
    if (!overlayEl || !overlayEl.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape')     close();
  }

  // ---- Chuyển đến ảnh theo index ----
  function goTo(index) {
    const total = ALL_PHOTOS.length;
    currentIndex = (index + total) % total; // Vòng lặp

    // Cập nhật ảnh active
    overlayEl.querySelectorAll('.slide-img').forEach((img, i) => {
      img.classList.toggle('active', i === currentIndex);
    });

    // Cập nhật dots
    overlayEl.querySelectorAll('.slide-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    // Cập nhật thumbnails và scroll vào view
    overlayEl.querySelectorAll('.slide-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentIndex);
      if (i === currentIndex) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Cập nhật counter
    const counter = overlayEl.querySelector('#ss-counter');
    if (counter) counter.textContent = `${currentIndex + 1} / ${total}`;
  }

  // ---- Ảnh tiếp theo ----
  function next() { goTo(currentIndex + 1); }

  // ---- Ảnh trước ----
  function prev() { goTo(currentIndex - 1); }

  // ---- Mở slideshow từ ảnh index ----
  function open(startIndex = 0) {
    if (!overlayEl) buildOverlay();
    currentIndex = startIndex;
    goTo(startIndex);
    overlayEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ---- Đóng slideshow ----
  function close() {
    if (!overlayEl) return;
    overlayEl.classList.remove('active');
    document.body.style.overflow = '';
    stopAutoPlay();
  }

  // ---- Auto play (tùy chọn) ----
  function startAutoPlay(interval = 4000) {
    autoPlayId = setInterval(next, interval);
  }
  function stopAutoPlay() {
    if (autoPlayId) clearInterval(autoPlayId);
  }

  // ---- Lấy danh sách ảnh (cho gallery preview) ----
  function getPhotos() { return ALL_PHOTOS; }

  return { open, close, next, prev, getPhotos };
})();
