/* ============================================
   music.js - Nhạc nền dùng file MP3 local
   Cách dùng: Đặt file MP3 vào thư mục assets/
   rồi đổi tên file trong app.js
   ============================================ */

const MusicPlayer = (() => {
  let audio = null;
  let isPlaying = false;
  let hasInteracted = false;

  // ---- Khởi tạo với đường dẫn file MP3 ----
  function init(src) {
    audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;

    // Trình duyệt yêu cầu người dùng tương tác trước
    // nên lắng nghe click/touch đầu tiên rồi mới phát
    const startOnInteract = () => {
      if (hasInteracted) return;
      hasInteracted = true;

      audio.play()
        .then(() => {
          isPlaying = true;
          updateUI(true);
        })
        .catch(err => {
          console.warn('Không thể phát nhạc:', err);
        });

      document.removeEventListener('click', startOnInteract);
      document.removeEventListener('touchstart', startOnInteract);
    };

    document.addEventListener('click', startOnInteract);
    document.addEventListener('touchstart', startOnInteract, { passive: true });
  }

  // ---- Bật nhạc ----
  function play() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      updateUI(true);
    }).catch(() => {});
  }

  // ---- Tắt nhạc ----
  function pause() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    updateUI(false);
  }

  // ---- Toggle bật / tắt ----
  function toggle() {
    if (isPlaying) pause();
    else play();
  }

  // ---- Cập nhật icon nút nhạc ----
  function updateUI(playing) {
    const btn = document.getElementById('music-btn');
    if (!btn) return;
    const icon = btn.querySelector('.music-icon');
    if (icon) icon.textContent = playing ? '♪' : '♩';
    btn.classList.toggle('playing', playing);
    btn.title = playing ? 'Tắt nhạc' : 'Bật nhạc';
  }

  return { init, toggle, play, pause };
})();
