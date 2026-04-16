# 🎯 FitHire Frontend Guideline

## 1. Giới thiệu

Tài liệu này mô tả:

- Cách setup môi trường Frontend
- Cấu trúc thư mục chuẩn
- Quy tắc code cơ bản
- Cách làm việc cho team FE

Mục tiêu:

> Đảm bảo toàn bộ team code **đồng nhất – dễ maintain – dễ scale**

---

# 2. Tech Stack

## Core

- ReactJS
- Vite
- JavaScript

## UI

- Tailwind CSS

## (Sẽ thêm sau)

- shadcn/ui (component)
- React Hook Form (form)
- Zod (validation)
- Axios (API)

---

# 3. Setup Project

## 3.1. Cài đặt

```bash
npm install
```

## 3.2. Chạy project

```bash
npm run dev
```

## 3.3. Build production

```bash
npm run build
```

---

# 4. Cấu trúc thư mục

```bash
src/
├── assets/              # Ảnh, icon, logo
├── components/
│   ├── common/          # Component dùng chung (Button custom, Loading…)
│   ├── layout/          # Layout (Navbar, Sidebar…)
│   └── ui/              # (sau này) shadcn/ui
│
├── features/            # Chia theo nghiệp vụ
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── hooks/
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│
├── hooks/               # Hook dùng chung
├── lib/                 # Config, helper
├── routes/              # Routing
├── services/            # API global
├── store/               # State global (sau này)
├── utils/               # Hàm tiện ích
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 5. Nguyên tắc tổ chức code

## 5.1. Feature-based structure

- Mỗi module (auth, profile, cv…) là 1 folder riêng
- Không trộn code giữa các feature

## 5.2. Component chia 3 loại

- `common/` → dùng toàn app
- `layout/` → layout chính
- `features/.../components` → component riêng của module

---

# 6. Naming Convention

## Component

- PascalCase
  Ví dụ:

```bash
LoginForm.jsx
DashboardCard.jsx
```

## Hook

- Bắt đầu bằng `use`

```bash
useAuth.js
useDashboard.js
```

## Function

- camelCase

```js
handleSubmit();
fetchUserProfile();
```

## Folder

- lowercase

```bash
auth/
dashboard/
```

---

# 7. Cách làm việc trong team

## 7.1. Khi làm 1 feature mới

Ví dụ: Auth

```bash
features/auth/
├── components/
├── pages/
├── services/
├── schemas/
└── hooks/
```

## 7.2. Quy trình làm

1. Tạo folder feature
2. Tạo page
3. Tạo component
4. (sau này) thêm service + API

---

# 8. UI/UX Guideline

## 8.1. Nguyên tắc chung

- UI sạch, hiện đại
- Không nhồi quá nhiều thông tin
- Dễ đọc, dễ hiểu

## 8.2. Layout chuẩn

- Header (top)
- Content (center)
- Sidebar (sau này)

## 8.3. Spacing

- Dùng Tailwind spacing
- Không hard-code px lung tung

---

# 9. Responsive

## Breakpoints (Tailwind)

- sm
- md
- lg
- xl

## Nguyên tắc

- Mobile: 1 column
- Tablet: 2 column
- Desktop: nhiều column

---

# 10. State Management

## Hiện tại

- useState
- useEffect

## Sau này

- Context API
- Zustand

---

# 11. API

## Hiện tại

- chưa cần gọi API thật

## Sau này

- dùng Axios
- mỗi feature có service riêng

---

# 12. Quy tắc quan trọng

## ❌ Không làm

- Không đặt file lung tung
- Không viết CSS riêng nếu không cần
- Không duplicate component

## ✅ Nên làm

- Tách component nhỏ
- Code rõ ràng, dễ đọc
- Đặt tên có ý nghĩa

---

# 13. Lộ trình phát triển FE

## Giai đoạn 1

- Setup project
- Dựng layout
- Làm UI bằng Tailwind

## Giai đoạn 2

- Làm Auth
- Làm Dashboard

## Giai đoạn 3

- Thêm form (React Hook Form)
- Thêm validation (Zod)

## Giai đoạn 4

- Kết nối API (Axios)

## Giai đoạn 5

- Nâng cấp UI (shadcn/ui)

---

# 14. Kết luận

Frontend FitHire sẽ được xây dựng theo hướng:

- Clean structure
- Scalable
- Easy to maintain

Mọi thành viên cần tuân thủ cấu trúc và guideline này để đảm bảo codebase đồng nhất.

---

**Owner FE:** (điền tên bạn ở đây)
**Project:** FitHire
