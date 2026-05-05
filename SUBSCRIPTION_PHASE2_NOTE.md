# Ghi chú Subscription Phase 2 (Frontend)

## 1) Mục tiêu frontend

- Trang pricing lấy dữ liệu gói từ backend thay vì hardcode.
- Test subscription trực tiếp trên web, không phụ thuộc Swagger.
- Hiển thị trạng thái gói đang active của user.

## 2) Những gì đã triển khai

### 2.1 API service cho pricing/subscription

Đã thêm file:

- `src/features/pricing/services/subscriptionApi.js`

Các hàm chính:

- `fetchPricingPlans()`
- `checkoutSubscription(subscriptionCode, autoRenew)`
- `simulatePaymentSuccess(paymentId)`
- `simulatePaymentFailed(paymentId)`
- `fetchMySubscriptions()`

Đặc điểm:

- Dùng `getAuthSession()` để lấy access token.
- Gửi header `Authorization` cho endpoint cần xác thực.
- Chuẩn hóa parse lỗi backend qua `message`.

### 2.2 Pricing cards dùng dữ liệu thật từ backend

Đã sửa:

- `src/features/pricing/components/PricingCards.jsx`

Các thay đổi chính:

- Gọi `GET /api/subscriptions/plans` để render card.
- Theme card theo `code` plan (`FREE`, `LUOT_LE`, `PLUS`, `PRO`).
- Build danh sách tính năng từ `SubscriptionFeature`.
- CTA gọi checkout thật.
- Khi payment `PENDING`, hiển thị action mô phỏng:
  - `Mô phỏng SUCCESS`
  - `Mô phỏng FAILED`
- Refresh snapshot user sau mỗi action.
- Disable CTA nếu gói đang active (`Đang sử dụng`).

### 2.3 Hero + comparison table pricing

Đã sửa:

- `src/features/pricing/components/PricingHero.jsx`
- `src/features/pricing/components/ComparisonTable.jsx`

Mục đích:

- Đồng bộ nội dung với flow phase 2.
- Giữ layout rõ ràng để test nghiệp vụ trên UI.

## 3) Flow người dùng trên trang pricing

1. Vào `/pricing` -> FE load plans từ backend.
2. Chưa đăng nhập bấm mua gói -> redirect `/login`.
3. Đã đăng nhập bấm CTA:
   - FE gọi `checkout`.
   - Nếu FREE: có thể active ngay.
   - Nếu non-FREE: sinh payment `PENDING`.
4. User bấm mô phỏng:
   - SUCCESS -> gói chuyển active.
   - FAILED -> payment fail, có thể checkout lại.
5. FE refresh `GET /api/subscriptions/me` để cập nhật trạng thái card.

## 4) File FE đã thay đổi

- `src/features/pricing/components/PricingCards.jsx`
- `src/features/pricing/components/PricingHero.jsx`
- `src/features/pricing/components/ComparisonTable.jsx`
- `src/features/pricing/services/subscriptionApi.js`

## 5) Lưu ý môi trường

- Nếu backend down hoặc proxy lỗi, pricing sẽ hiển thị alert (ví dụ HTTP 502).
- FE hiện phụ thuộc endpoint `GET /api/subscriptions/plans` để render cards.
