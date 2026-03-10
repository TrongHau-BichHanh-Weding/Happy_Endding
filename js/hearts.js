/* ============================================
   hearts.js - Module trái tim rơi
   Chức năng: Tạo hiệu ứng trái tim bay lên
   liên tục theo nhịp lãng mạn trên toàn trang
   ============================================ */

const HeartsEffect = (() => {
  // ---- Danh sách emoji trái tim và biến thể ----
  const HEARTS = ['❤️', '🩷', '💗', '💖', '💕', '💓', '♡', '❣️'];

  let intervalId = null;
  let active = true;

  // ---- Tạo một trái tim bay lên ----
  function spawnHeart() {
    if (!active) return;

    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

    // Vị trí ngang ngẫu nhiên trên toàn màn hình
    const x = Math.random() * 95; // 0vw → 95vw
    // Kích thước ngẫu nhiên 0.8rem → 2rem
    const size = (Math.random() * 1.2 + 0.8).toFixed(2);
    // Thời gian bay ngẫu nhiên 5s → 9s
    const dur = (Math.random() * 4 + 5).toFixed(1);
    // Góc xoay ban đầu ngẫu nhiên -30° → +30°
    const rot = (Math.random() * 60 - 30).toFixed(0);
    // Độ lắc ngang -40px → +40px
    const drift = (Math.random() * 80 - 40).toFixed(0);

    el.style.cssText = `
      left: ${x}vw;
      --heart-size: ${size}rem;
      --heart-dur: ${dur}s;
      --heart-rot: ${rot}deg;
      --heart-drift: ${drift}px;
    `;

    document.body.appendChild(el);

    // Xóa phần tử sau khi animation kết thúc
    setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 300);
  }

  // ---- Bắt đầu tạo trái tim theo interval ----
  function start() {
    // Tạo lác đác ngay từ đầu để trang không trống
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnHeart, i * 500);
    }
    // Cứ mỗi 1.6 giây tạo 1 trái tim mới
    intervalId = setInterval(spawnHeart, 1600);
  }

  // ---- Dừng hiệu ứng ----
  function stop() {
    active = false;
    if (intervalId) clearInterval(intervalId);
  }

  // ---- Khởi động ----
  function init() {
    active = true;
    start();
  }

  return { init, stop };
})();
