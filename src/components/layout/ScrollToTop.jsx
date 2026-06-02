import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * - Cuộn về đầu trang (top: 0) mỗi khi pathname hoặc search thay đổi.
 * - Đặt component này bên trong <Router> để hoạt động đúng.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Dùng 'instant' để tránh cảm giác giật khi chuyển trang.
    // Một số trình duyệt cũ không hỗ trợ 'instant' nên fallback về 'auto'.
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
