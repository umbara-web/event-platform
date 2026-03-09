export const MESSAGES = {
  // Auth
  AUTH: {
    REGISTER_SUCCESS: 'Registrasi berhasil',
    LOGIN_SUCCESS: 'Login berhasil',
    LOGOUT_SUCCESS: 'Logout berhasil',
    TOKEN_REFRESHED: 'Token berhasil diperbarui',
    PASSWORD_RESET_SENT: 'Link reset password telah dikirim ke email',
    PASSWORD_RESET_SUCCESS: 'Password berhasil direset',
    PASSWORD_CHANGED: 'Password berhasil diubah',
    EMAIL_VERIFIED: 'Email berhasil diverifikasi',
    INVALID_CREDENTIALS: 'Email atau password salah',
    INVALID_TOKEN: 'Token tidak valid atau sudah kadaluarsa',
    UNAUTHORIZED: 'Anda harus login terlebih dahulu',
    FORBIDDEN: 'Anda tidak memiliki akses ke resource ini',
    EMAIL_EXISTS: 'Email sudah terdaftar',
    REFERRAL_NOT_FOUND: 'Kode referral tidak ditemukan',
  },

  // User
  USER: {
    PROFILE_FETCHED: 'Profil berhasil diambil',
    PROFILE_UPDATED: 'Profil berhasil diperbarui',
    NOT_FOUND: 'User tidak ditemukan',
    POINTS_FETCHED: 'Poin berhasil diambil',
    COUPONS_FETCHED: 'Kupon berhasil diambil',
  },

  // Event
  EVENT: {
    CREATED: 'Event berhasil dibuat',
    UPDATED: 'Event berhasil diperbarui',
    DELETED: 'Event berhasil dihapus',
    FETCHED: 'Event berhasil diambil',
    LIST_FETCHED: 'Daftar event berhasil diambil',
    NOT_FOUND: 'Event tidak ditemukan',
    ALREADY_STARTED: 'Event sudah dimulai',
    ALREADY_ENDED: 'Event sudah berakhir',
    NOT_PUBLISHED: 'Event belum dipublikasikan',
  },

  // Transaction
  TRANSACTION: {
    CREATED: 'Transaksi berhasil dibuat',
    PAYMENT_UPLOADED: 'Bukti pembayaran berhasil diunggah',
    CONFIRMED: 'Transaksi berhasil dikonfirmasi',
    REJECTED: 'Transaksi ditolak',
    CANCELLED: 'Transaksi dibatalkan',
    EXPIRED: 'Transaksi kadaluarsa',
    FETCHED: 'Transaksi berhasil diambil',
    LIST_FETCHED: 'Daftar transaksi berhasil diambil',
    NOT_FOUND: 'Transaksi tidak ditemukan',
    ALREADY_PAID: 'Transaksi sudah dibayar',
    PAYMENT_DEADLINE_PASSED: 'Batas waktu pembayaran telah lewat',
    INVALID_STATUS: 'Status transaksi tidak valid',
    INSUFFICIENT_SEATS: 'Kursi tidak mencukupi',
    INSUFFICIENT_POINTS: 'Poin tidak mencukupi',
  },

  // Review
  REVIEW: {
    CREATED: 'Review berhasil dibuat',
    UPDATED: 'Review berhasil diperbarui',
    DELETED: 'Review berhasil dihapus',
    FETCHED: 'Review berhasil diambil',
    NOT_FOUND: 'Review tidak ditemukan',
    ALREADY_REVIEWED: 'Anda sudah memberikan review',
    NOT_ATTENDED: 'Anda harus menghadiri event untuk memberikan review',
  },

  // Voucher
  VOUCHER: {
    CREATED: 'Voucher berhasil dibuat',
    UPDATED: 'Voucher berhasil diperbarui',
    DELETED: 'Voucher berhasil dihapus',
    FETCHED: 'Voucher berhasil diambil',
    NOT_FOUND: 'Voucher tidak ditemukan',
    INVALID: 'Voucher tidak valid',
    EXPIRED: 'Voucher sudah kadaluarsa',
    USAGE_LIMIT_REACHED: 'Voucher sudah mencapai batas penggunaan',
    NOT_APPLICABLE: 'Voucher tidak berlaku untuk event ini',
  },

  // Coupon
  COUPON: {
    INVALID: 'Kupon tidak valid',
    EXPIRED: 'Kupon sudah kadaluarsa',
    ALREADY_USED: 'Kupon sudah digunakan',
    NOT_FOUND: 'Kupon tidak ditemukan',
  },

  // General
  GENERAL: {
    SUCCESS: 'Berhasil',
    FAILED: 'Gagal',
    INTERNAL_ERROR: 'Terjadi kesalahan pada server',
    VALIDATION_ERROR: 'Data tidak valid',
    NOT_FOUND: 'Data tidak ditemukan',
    RATE_LIMIT: 'Terlalu banyak request, coba lagi nanti',
  },
} as const;

export default MESSAGES;
