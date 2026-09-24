// Script untuk mengunggah seluruh 321 data peserta ke Supabase
const fs = require('fs');
const path = require('path');

// Baca file peserta_data.json
const dataPath = path.join(__dirname, 'data', 'peserta_data.json');
if (!fs.existsSync(dataPath)) {
  console.error('File data/peserta_data.json tidak ditemukan!');
  process.exit(1);
}

const participants = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Format data ke kolom tabel Supabase
const payload = participants.map(p => ({
  id: p.id,
  bib: p.bib,
  no_reg: p.noReg,
  nama: p.nama,
  komunitas: p.komunitas,
  no_telp: p.noTelp,
  no_kerabat: p.noKerabat,
  alamat_lengkap: p.alamatLengkap,
  jenis_reg: p.jenisReg,
  is_po: p.isPO,
  kategori_jersey: p.kategoriJersey,
  jenis_lengan: p.jenisLengan,
  ukuran: p.ukuran,
  qty: p.qty,
  metode_ambil: p.metodeAmbil,
  alamat_kirim: p.alamatKirim,
  batch_produksi: p.batchProduksi,
  total_harga: p.totalHarga,
  status_pembayaran: p.statusPembayaran,
  is_lunas: p.isLunas,
  verifikator: p.verifikator,
  tanggal_bayar: p.tanggalBayar,
  status_kirim: p.statusKirim || 'Belum',
  ekspedisi: p.ekspedisi || '',
  no_resi: p.noResi || '',
  tanggal_kirim: p.tanggalKirim || '',
  catatan: p.catatan || ''
}));

console.log(`Menyiapkan ${payload.length} baris data peserta...`);

async function upload(supabaseUrl, supabaseKey) {
  if (!supabaseUrl || !supabaseKey) {
    console.error('\nPERINGATAN: Supabase URL dan Anon Key belum diisi!');
    console.log('Jalankan dengan format:');
    console.log('node upload_to_supabase.js <SUPABASE_URL> <SUPABASE_ANON_KEY>\n');
    process.exit(1);
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/peserta`;

  console.log(`Mengunggah ke: ${endpoint}`);

  // Upload per batch (50 baris per batch agar aman)
  const batchSize = 50;
  for (let i = 0; i < payload.length; i += batchSize) {
    const chunk = payload.slice(i, i + batchSize);
    console.log(`Mengunggah batch ${i + 1} - ${Math.min(i + batchSize, payload.length)}...`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(chunk)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Gagal pada batch ${i + 1}:`, res.status, errText);
      process.exit(1);
    }
  }

  console.log('\nSUKSES! Seluruh data peserta berhasil diunggah ke Supabase!');
}

const args = process.argv.slice(2);
const url = args[0] || process.env.SUPABASE_URL;
const key = args[1] || process.env.SUPABASE_ANON_KEY;

upload(url, key);
