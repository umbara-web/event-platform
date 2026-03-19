````markdown
# Scaling Strategy

Dokumen ini menjelaskan strategi teknis untuk menangani lonjakan trafik (10x hingga 100x).

## 1. Handling "The Thundering Herd" (Traffic 100x)

Skenario: Penjualan tiket konser artis ternama dibuka jam 10:00.

### A. Database Bottleneck

- **Connection Pooling:** Gunakan PgBouncer di depan PostgreSQL untuk mengelola ribuan koneksi konkuren dari API instances.
- **Read Replicas:** Pisahkan query `GET /events` (Read Heavy) ke database Replica, sedangkan `POST /transaction` (Write) ke Primary.
- **Indexing:** Pastikan kolom yang sering difilter (`startDate`, `categoryId`, `organizerId`) ter-index dengan benar.

### B. Caching Strategy (Redis)

Jangan hit database untuk data yang jarang berubah.

- **Event Details:** Cache respon `GET /events/:id` di Redis dengan TTL 60 detik.
- **Config/Categories:** Cache data statis (Kategori, Lokasi) dengan TTL panjang (1 jam+).

### C. Concurrency Control (Inventory)

Masalah: Overselling tiket (Jual 105 tiket padahal kuota 100).

- **Solusi:** Gunakan `Atomic Update` di SQL:
  ```sql
  UPDATE "TicketTier"
  SET sold_count = sold_count + 1
  WHERE id = '...' AND sold_count < quota;
  ```
- Jika `affected_rows == 0`, berarti tiket habis. Jangan melakukan _read-modify-write_ di level aplikasi.

## 2. Asynchronous Processing

Memindahkan proses berat keluar dari siklus Request-Response HTTP.

- **Email Notifications:** Jangan kirim email saat user klik "Bayar". Masukkan ke antrian (BullMQ). Worker akan mengirimnya. Jika gagal, worker akan melakukan _retry_ otomatis (Exponential Backoff).
- **Image Processing:** Resize gambar dilakukan oleh Cloudinary atau Worker terpisah, bukan API utama.

## 3. Cron Jobs Scalability

Masalah: `node-cron` berjalan di setiap instance API.

- **Solusi:** Pisahkan service khusus bernama `scheduler` atau gunakan Kubernetes CronJob yang memanggil endpoint API khusus yang diamankan internal.
````
