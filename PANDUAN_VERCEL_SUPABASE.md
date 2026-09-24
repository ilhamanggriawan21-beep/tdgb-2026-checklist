# Panduan Deployment ke Supabase & Vercel
## Checklist PO Jersey — Tour De Gunung Batu 2026

Sistem ini telah dilengkapi dengan integrasi **Supabase Cloud (Database & Realtime)** dan siap di-deploy ke **Vercel** agar dapat diakses oleh banyak panitia secara bersamaan di berbagai smartphone/laptop dari mana saja.

---

### BAGIAN 1: SETUP SUPABASE (Database Cloud & Realtime)

1. Buka [https://supabase.com](https://supabase.com) dan buat akun (gratis) jika belum punya.
2. Buat Project Baru:
   - Klik **New Project**
   - Beri nama: `tdgb-2026-checklist`
   - Buat Database Password (simpan password ini)
   - Pilih region terdekat (misal: `Singapore`)
3. Jalankan Query Database:
   - Di dashboard Supabase, buka menu **SQL Editor** (ikon terminal di menu sebelah kiri).
   - Buka file [`supabase_schema.sql`](file:///c:/CEKLIS/supabase_schema.sql) di folder project ini, copy seluruh isinya, lalu paste ke SQL Editor Supabase.
   - Klik tombol **Run** (Hijau). Tabel `peserta` akan otomatis dibuat lengkap dengan hak akses publik dan fitur Realtime aktif.
4. Salin API Keys:
   - Buka menu **Project Settings** (ikon gear di kiri bawah) -> **API**.
   - Salin **Project URL** (contoh: `https://xyz.supabase.co`).
   - Salin **Project API Keys (anon public)** (contoh: `eyJhbGci...`).
5. Upload Data 321 Peserta ke Supabase:
   - Buka terminal / PowerShell di folder project (`c:\CEKLIS`), lalu jalankan perintah:
     ```bash
     node upload_to_supabase.js <SUPABASE_URL> <SUPABASE_ANON_KEY>
     ```
     *(Ganti dengan URL dan Anon Key Anda)*
   - Seluruh 321 data pendaftar dan PO jersey akan otomatis terunggah ke database cloud dalam beberapa detik!
6. Masukkan Key ke Aplikasi:
   - Buka file [`supabase_config.js`](file:///c:/CEKLIS/supabase_config.js) dan tempel URL & Key Anda, ATAU buka web di browser dan klik tombol badge **"○ LOKAL (KLIK SYNC)"** di pojok kiri atas untuk memasukkan URL & Anon Key.

---

### BAGIAN 2: DEPLOY KE VERCEL (Akses Web Cloud)

Ada 2 cara yang sangat mudah untuk deploy ke Vercel:

#### CARA A (Paling Populer & Praktis via GitHub):
1. Buat repository baru di akun GitHub Anda (misal: `tdgb-2026-checklist`).
2. Di folder project (`c:\CEKLIS`), jalankan:
   ```bash
   git remote add origin https://github.com/USERNAME-ANDA/tdgb-2026-checklist.git
   git branch -M main
   git push -u origin main
   ```
3. Buka [https://vercel.com](https://vercel.com), login menggunakan akun GitHub Anda.
4. Klik **Add New** -> **Project**, lalu pilih repository `tdgb-2026-checklist`.
5. Klik tombol **Deploy**.
6. Dalam 30 detik, Anda akan mendapatkan URL web publik gratis (misal: `https://tdgb-2026-checklist.vercel.app`) yang bisa langsung dibuka oleh seluruh panitia di smartphone masing-masing!

#### CARA B (Langsung via Vercel CLI):
1. Di terminal PowerShell folder project (`c:\CEKLIS`), jalankan:
   ```bash
   npx vercel login
   ```
   *(Pilih login via Browser / Email Anda)*
2. Setelah login berhasil, cukup jalankan:
   ```bash
   npx vercel --prod
   ```
3. Tekan Enter untuk menyetujui opsi default. Website akan langsung online!

---

### ⚡ Keunggulan Setelah Terhubung ke Supabase & Vercel:
- **Realtime Multi-Device**: Jika Panitia A di gudang menandai peserta #1009 "Sudah Dikirim" dari HP-nya, layar HP Panitia B di lokasi lain akan otomatis berubah menjadi "Sudah Dikirim" seketika tanpa perlu refresh halaman!
- **Data Aman di Cloud**: Semua update tersimpan di database PostgreSQL Supabase dan selalu sinkron.
- **Akses Fleksibel**: Cukup bagikan link Vercel ke grup panitia, semua tim logistik bisa langsung bekerja dari perangkat masing-masing.
