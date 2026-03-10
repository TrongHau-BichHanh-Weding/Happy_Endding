/* ============================================
   giftbox.js - Module hộp quà mã QR
   Chức năng: Xử lý animation mở hộp quà,
   hiển thị mã QR chuyển khoản, bắn confetti
   ============================================ */

const GiftBox = (() => {
  let opened = false;

  // ---- Bắn confetti khi mở hộp ----
  function launchConfetti() {
    const colors = ['#c9a96e', '#e8d5b0', '#f5ebe8', '#a8d8c8', '#e06b6b', '#ffffff'];
    const count = 60;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';

      // Vị trí bắt đầu ngẫu nhiên từ trung tâm màn hình
      const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
      const startY = window.innerHeight / 2;

      piece.style.cssText = `
        left: ${startX}px;
        top: ${startY}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 10 + 6}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        --dur: ${Math.random() * 1 + 1.2}s;
        transform: translateX(${(Math.random() - 0.5) * 400}px);
        transition: transform ${Math.random() * 0.5 + 0.8}s ease;
      `;

      document.body.appendChild(piece);

      // Xóa sau khi animation kết thúc
      setTimeout(() => piece.remove(), 2500);
    }
  }

  // ---- Mở hộp quà ----
  function open() {
    if (opened) return;
    opened = true;

    const box = document.getElementById('giftbox');
    const content = document.getElementById('gift-content');
    const hint = document.getElementById('gift-hint');

    if (box) box.classList.add('opened');
    if (hint) hint.style.display = 'none';

    // Hiện QR sau khi animation nắp mở xong
    setTimeout(() => {
      if (content) content.classList.add('show');
      launchConfetti();
    }, 900);
  }

  // ---- Đóng / reset hộp ----
  function close() {
    opened = false;
    const box = document.getElementById('giftbox');
    const content = document.getElementById('gift-content');
    const hint = document.getElementById('gift-hint');

    if (box) box.classList.remove('opened');
    if (content) content.classList.remove('show');
    if (hint) hint.style.display = 'block';
  }

  // ---- Gắn sự kiện ----
  function init() {
    const box = document.getElementById('giftbox');
    if (box) {
      box.addEventListener('click', open);
    }

    const closeBtn = document.getElementById('gift-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
      });
    }
  }

  return { init, open, close };
})();
