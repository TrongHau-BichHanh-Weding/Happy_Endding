/* ============================================
   utils.js - Các tiện ích & module phụ
   Bao gồm: Scroll to top, Hoa rơi (canvas),
   Lời chúc mừng, Xác nhận tham dự
   ============================================ */

/* ============ MODULE: SCROLL TO TOP ============ */
const ScrollTop = (() => {
  function init() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    // Hiện nút khi cuộn xuống 300px
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    // Cuộn lên đầu khi bấm
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  return { init };
})();


/* ============ MODULE: HOA RƠI (CANVAS PETALS) ============ */
const PetalsFall = (() => {
  const petals = [];
  let canvas, ctx, animId;
  const PETAL_COUNT = 18;

  // ---- Tạo một cánh hoa ----
  function createPetal(w, h) {
    return {
      x: Math.random() * w,
      y: Math.random() * h - h,
      size: Math.random() * 12 + 6,
      speedY: Math.random() * 1.2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.8,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.04,
      opacity: Math.random() * 0.5 + 0.3,
      color: Math.random() > 0.5 ? '#f5c0b8' : '#e8d5b0',
    };
  }

  // ---- Vẽ cánh hoa dạng ellipse ----
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ---- Vòng lặp animation ----
  function animate() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    petals.forEach((p, i) => {
      drawPetal(p);
      p.y += p.speedY;
      p.x += p.speedX;
      p.angle += p.spinSpeed;

      // Reset về đầu khi ra khỏi màn hình
      if (p.y > h + 20) {
        petals[i] = createPetal(w, h);
        petals[i].y = -20;
      }
    });

    animId = requestAnimationFrame(animate);
  }

  // ---- Khởi tạo canvas ----
  function init() {
    canvas = document.getElementById('petals-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Tạo các cánh hoa ban đầu
    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = createPetal(canvas.width, canvas.height);
      p.y = Math.random() * canvas.height; // Phân bố đều khi khởi động
      petals.push(p);
    }

    animate();
  }

  function stop() {
    if (animId) cancelAnimationFrame(animId);
  }

  return { init, stop };
})();


/* ============ MODULE: LỜI CHÚC MỪNG ============ */
const Wishes = (() => {
  const stored = [];

  // ---- Tạo HTML cho một lời chúc ----
  function createWishHTML(name, text) {
    return `
      <div class="wish-item">
        <div class="wish-author">${escapeHtml(name)}</div>
        <div class="wish-text">${escapeHtml(text)}</div>
      </div>`;
  }

  // ---- Escape HTML để tránh XSS ----
  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ---- Thêm lời chúc mới ----
  function addWish(name, text) {
    if (!name.trim() || !text.trim()) return false;
    stored.unshift({ name, text });
    renderAll();
    return true;
  }

  // ---- Render toàn bộ danh sách ----
  function renderAll() {
    const list = document.getElementById('wishes-list');
    if (!list) return;
    list.innerHTML = stored.map(w => createWishHTML(w.name, w.text)).join('');
  }

  // ---- Gắn sự kiện form ----
  function init() {
    const form   = document.getElementById('wish-form');
    const nameIn = document.getElementById('wish-name');
    const textIn = document.getElementById('wish-text');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = addWish(nameIn.value, textIn.value);
      if (ok) {
        nameIn.value = '';
        textIn.value = '';
        nameIn.focus();
      }
    });

    // Seed một số lời chúc mẫu
    addWish('Gia phả họ Lê', 'Chúc đôi bạn trăm năm hạnh phúc, mãi mãi yêu thương nhau! 🌸');
    addWish('Nhóm bạn thân', 'Chúc mừng Hậu và Hạnh! Mong hai bạn luôn vui vẻ bên nhau! 💑');
  }

  return { init, addWish };
})();


/* ============ MODULE: XÁC NHẬN THAM DỰ ============ */
const RSVP = (() => {
  function confirm(type) {
    // type: 'groom' | 'bride'
    const eventName = type === 'groom' ? 'Lễ Thành Hôn (Nhà Trai)' : 'Lễ Vu Quy (Nhà Gái)';

    // Trong thực tế: gửi đến API / Google Sheets
    alert(`✅ Cảm ơn bạn đã xác nhận tham dự\n📅 ${eventName}\n\nChúng tôi rất mong được gặp bạn!`);
  }

  function init() {
    document.querySelectorAll('[data-rsvp]').forEach(btn => {
      btn.addEventListener('click', () => confirm(btn.dataset.rsvp));
    });
  }

  return { init };
})();


/* ============ MODULE: SCROLL REVEAL ANIMATION ============ */
const ScrollReveal = (() => {
  function init() {
    // Quan sát các section để thêm class 'revealed' khi vào viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  return { init };
})();


/* ============ MODULE: MỞ THIỆP KÉO RÈM (DOORS OPEN) ============ */
const Envelope = (() => {
  function init() {
    const overlay = document.getElementById('envelope-overlay');
    const wrapper = document.getElementById('envelope-wrapper');
    const lockBtn = document.getElementById('door-lock');

    if (!overlay || !wrapper || !lockBtn) return;

    // Vô hiệu hóa lướt trang khi overlay còn hiện
    document.body.style.overflow = 'hidden';

    // Xử lý khi click vào nút "Mở Thiệp"
    lockBtn.addEventListener('click', () => {
      // 1. Chạy CSS animation kéo rèm sang 2 bên
      wrapper.classList.add('open');

      // 2. Chờ 1.8s để xem hết animation cửa mở, sau đó fade out overlay
      setTimeout(() => {
        overlay.classList.add('hidden');
        document.body.style.overflow = ''; // Cho phép cuộn lại

        // 3. Tự động bật nhạc
        if (typeof MusicPlayer !== 'undefined') {
          MusicPlayer.play();
        }

        // 4. Khởi chạy 1 đợt Confetti (Hoa giấy) để ăn mừng
        if (typeof GiftBox !== 'undefined' && GiftBox.fireConfetti) {
           GiftBox.fireConfetti();
        }
      }, 1800);
    });
  }

  return { init };
})();
