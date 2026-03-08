API Flow

- **Pengecekan Poin:** `GET /users/me` mengembalikan saldo poin dan daftar kupon aktif.
- **Upload Bukti:** `POST /transactions/:id/payment` (Hanya bisa jika status `WAITING_FOR_PAYMENT` dan belum lewat 2 jam).
- **Approval:** `PATCH /organizer/transactions/:id/confirm`.
  - Jika `ACCEPT`: Status jadi `DONE`, kirim email.
  - Jika `REJECT`: Status jadi `REJECTED`, kembalikan poin/kupon & kuota tiket (Seat Recovery).
