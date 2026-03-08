# Database Design

| **Table**     | **Fungsi Utama**                   | **Key Performance Index (Index)** |
| ------------- | ---------------------------------- | --------------------------------- |
| `User`        | Auth & Referral (Points/Coupons)   | `email`, `referralCode`           |
| `Event`       | Detail Acara & Promosi             | `startDate`, `category`           |
| `TicketType`  | Stok & Harga Berjenjang            | `eventId`                         |
| `Transaction` | Logging & Status Pembayaran        | `status`, `userId`                |
| `PointLog`    | Tracking Masa Berlaku Poin (3 bln) | `userId`, `expiresAt`             |
