Komponen Strategi Alasan
Auth JWT Stateless Memudahkan horizontal scaling (tidak perlu session store).
Validation Zod (End-to-End) Skema yang sama dipakai di Frontend & Backend, meminimalisir error tipe data.
Concurrency SQL Row Level Locking Menjamin tidak ada overselling tiket saat traffic naik 100x.
Storage Cloudinary Proxy Memisahkan file binary dari server utama untuk menjaga performa I/O.

## Arsitektur Multi-Tenant

| **Komponen**      | **Strategi**         | **Implementasi**                                                            |
| ----------------- | -------------------- | --------------------------------------------------------------------------- |
| **URL Routing**   | Dynamic Slugs        | Next.js Middleware Rewrites (`/:tenant/:branch`)                            |
| **Data Security** | Tenant Isolation     | Query wajib menggunakan `organizationId` filter di level Service.           |
| **Assets**        | Cloudinary Foldering | Upload gambar dikelompokkan folder per tenant: `events/tenant_id/event_id`. |
| **RBAC**          | Hierarchical Roles   | SuperAdmin (Platform) > Admin (Tenant) > Manager (Branch) > Customer.       |
