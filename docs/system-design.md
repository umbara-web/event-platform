``markdown

# Detailed System Design Decisions

Dokumen ini mencatat trade-off teknis dan alasan pengambilan keputusan arsitektur.

## 1. Monorepo vs Polyrepo

- **Keputusan:** Monorepo.
- **Alasan:** Kami memiliki 2 frontend dan 1 backend yang berbagi kontrak data (Types) yang sama. Monorepo memudahkan refactoring lintas aplikasi.
- **Trade-off:** Setup awal (tooling seperti Turbo/Nx) lebih kompleks, tetapi maintenance jangka panjang lebih mudah.

## 2. Database: Relational (SQL) vs NoSQL

- **Keputusan:** PostgreSQL (Relational).
- **Alasan:** Data event dan transaksi sangat terstruktur dan membutuhkan integritas relasi yang kuat (Foreign Keys). Fitur ACID sangat krusial untuk transaksi keuangan.
- **Trade-off:** Scaling write lebih sulit daripada NoSQL, tetapi bisa dimitigasi dengan sharding (masa depan) dan hardware vertical scaling.

## 3. Authorization: RBAC (Role-Based)

- **Keputusan:** Custom Middleware RBAC.
- **Alasan:** Kebutuhan saat ini sederhana (Customer vs Organizer).
- **Future Proof:** Jika kebutuhan menjadi kompleks (misal: "Admin Keuangan", "Admin Support"), kita bisa migrasi ke library seperti CASL atau service seperti Auth0/Clerk.

## 4. Payment & Order Flow (Handling Failures)

Sistem menggunakan pola **State Machine** untuk status transaksi.

- **Masalah:** Bagaimana jika user bayar tapi callback webhook dari Payment Gateway gagal?
- **Solusi:**
  1. Webhook (Metode utama).
  2. Polling (Cron job mengecek status transaksi yang 'gantung' ke Payment Gateway setiap 15 menit sebagai fail-safe).

## 5. Dependency Management

- **Dependency Injection:** Kode menggunakan pola Service-based yang memudahkan mocking saat Unit Test.
- **Risk:** Ketergantungan pada Cloudinary.
- **Mitigasi:** Buat `ImageUploadInterface` (Abstract). Saat ini implementasinya CloudinaryService. Jika harga naik, kita bisa buat `S3Service` yang mengimplementasikan interface yang sama tanpa mengubah Controller.

## 6. Scalability dan Maintainability

- **Modular Monolith:** Memudahkan pengembangan cepat di awal, namun siap untuk dipecah menjadi microservices jika trafik meningkat.
- **Containerization:** Memastikan konsistensi lingkungan antara development dan production, serta memudahkan deployment dan scaling dengan Docker/Kubernetes di masa depan.
