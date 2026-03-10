/* ============================================
   app.js - File khởi động chính (Entry Point)
   Chức năng: Khởi tạo tất cả các module
   sau khi DOM đã sẵn sàng
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. Khởi động hoa rơi trên Hero ---- */
  PetalsFall.init();

  /* ---- 1b. Khởi động trái tim rơi toàn trang ---- */
  HeartsEffect.init();

  /* ---- 2. Khởi động đếm ngược ngày cưới ---- */
  Countdown.init();

  /* ---- 3. Khởi động nhạc nền ---- */
  // Đặt file MP3 vào thư mục assets/ rồi sửa tên file ở đây
  MusicPlayer.init('assets/beautiful-in-white.mp3');

  /* ---- 4. Khởi động hộp quà ---- */
  GiftBox.init();

  /* ---- 5. Khởi động nút scroll to top ---- */
  ScrollTop.init();

  /* ---- 6. Khởi động lời chúc mừng ---- */
  Wishes.init();

  /* ---- 7. Khởi động xác nhận tham dự ---- */
  RSVP.init();

  /* ---- 8. Khởi động scroll reveal animation ---- */
  ScrollReveal.init();

  /* ---- 9. Gắn sự kiện nút nhạc ---- */
  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => MusicPlayer.toggle());
  }

});
