/* ============================================
   countdown.js - Module đếm ngược ngày cưới
   Chức năng: Tính và hiển thị thời gian còn
   lại đến ngày cưới, cập nhật mỗi giây
   ============================================ */

const Countdown = (() => {
  // ---- Ngày cưới: 28/12/2025 lúc 10:00 sáng ----
  const WEDDING_DATE = new Date('2026-03-29T10:00:00');

  let intervalId = null;

  // ---- Tính khoảng cách đến ngày cưới ----
  function getTimeLeft() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) return null; // Đã qua ngày cưới

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  // ---- Cập nhật DOM và thêm hiệu ứng flip ----
  function updateDisplay(time) {
    const ids = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];
    const values = [time.days, time.hours, time.minutes, time.seconds];

    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const newVal = String(values[i]).padStart(2, '0');
      if (el.textContent !== newVal) {
        // Chỉ animate khi số thay đổi
        el.classList.remove('flip');
        void el.offsetWidth; // force reflow
        el.classList.add('flip');
        el.textContent = newVal;
      }
    });
  }

  // ---- Hiển thị thông báo đã là ngày cưới ----
  function showWeddingDay() {
    const wrap = document.getElementById('countdown-wrap');
    if (wrap) {
      wrap.innerHTML = `
        <div style="text-align:center; font-family:var(--font-script); font-size:1.6rem; color:var(--gold); font-style:italic;">
          🎊 Hôm nay là ngày trọng đại! 🎊
        </div>`;
    }
  }

  // ---- Khởi động countdown ----
  function init() {
    const time = getTimeLeft();
    if (!time) { showWeddingDay(); return; }

    updateDisplay(time);

    // Cập nhật mỗi giây
    intervalId = setInterval(() => {
      const t = getTimeLeft();
      if (!t) { clearInterval(intervalId); showWeddingDay(); return; }
      updateDisplay(t);
    }, 1000);
  }

  return { init };
})();
