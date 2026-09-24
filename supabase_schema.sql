-- ========================================================
-- SCHEMA SUPABASE: CHECKLIST PO JERSEY TOUR DE GUNUNG BATU 2026
-- Jalankan query ini di SQL Editor di dashboard Supabase Anda
-- ========================================================

-- 1. Buat tabel peserta
CREATE TABLE IF NOT EXISTS public.peserta (
    id TEXT PRIMARY KEY,
    bib TEXT,
    no_reg TEXT,
    nama TEXT NOT NULL,
    komunitas TEXT,
    no_telp TEXT,
    no_kerabat TEXT,
    alamat_lengkap TEXT,
    jenis_reg TEXT,
    is_po BOOLEAN DEFAULT false,
    kategori_jersey TEXT,
    jenis_lengan TEXT,
    ukuran TEXT,
    qty INTEGER DEFAULT 0,
    metode_ambil TEXT,
    alamat_kirim TEXT,
    batch_produksi TEXT,
    total_harga NUMERIC DEFAULT 0,
    status_pembayaran TEXT,
    is_lunas BOOLEAN DEFAULT false,
    verifikator TEXT,
    tanggal_bayar TEXT,
    -- Status Checklist
    status_kirim TEXT DEFAULT 'Belum',
    ekspedisi TEXT DEFAULT '',
    no_resi TEXT DEFAULT '',
    tanggal_kirim TEXT DEFAULT '',
    catatan TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.peserta ENABLE ROW LEVEL SECURITY;

-- 3. Policy Akses Publik untuk Panitia (Bisa Baca & Update)
CREATE POLICY "Akses Baca Publik" ON public.peserta
    FOR SELECT USING (true);

CREATE POLICY "Akses Update Publik" ON public.peserta
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Akses Insert Publik" ON public.peserta
    FOR INSERT WITH CHECK (true);

-- 4. Aktifkan Realtime Replication untuk tabel peserta
ALTER PUBLICATION supabase_realtime ADD TABLE public.peserta;

-- 5. Index untuk performa pencarian kilat
CREATE INDEX IF NOT EXISTS idx_peserta_bib ON public.peserta(bib);
CREATE INDEX IF NOT EXISTS idx_peserta_metode ON public.peserta(metode_ambil);
CREATE INDEX IF NOT EXISTS idx_peserta_status ON public.peserta(status_kirim);
