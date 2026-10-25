# Al-Ibriez Book • Toko Resmi Al-Qur'an Al-Muttaqin (Penerbit Al-Qosbah)

> **Platform Web Pemesanan Online Resmi Al-Qur'an Al-Muttaqin**  
> Menghadirkan Mushaf Al-Muttaqin terbitan **Penerbit Al-Qosbah** dengan keunggulan **Tajwid Multikode Full Color**, **Panduan Garis Waqaf & Ibtida'**, serta **Khat Rasm Utsmani Standar Kemenag RI**.

---

## 🌟 Fitur Utama Website

1. **Header & Navigasi Bersih**:
   - Fitur pencarian produk instan secara *real-time*.
   - Tombol pemesanan cepat langsung ke form modal.
2. **Hero Section Islami & Modern**:
   - Ilustrasi vektor anak mengaji dengan tipografi modern dan tombol aksi cepat (*Pesan Sekarang* & *Lihat Contoh Bacaan*).
3. **Simulasi Contoh Bacaan & Tajwid Multikode**:
   - Tampilan contoh ayat Al-Qur'an interaktif dengan penanda hukum tajwid: *Mad*, *Ikhfa & Idgham*, *Qalqalah*, *Ghunnah*, *Tanda Waqaf*, dan *Tanda Ibtida'*.
   - Tombol filter interaktif yang menampilkan penjelasan kaidah tajwid beserta animasi highlight pada teks Arab.
4. **Katalog Produk Responsif**:
   - Tampilan grid 2-kolom yang optimal dan rapi pada layar handphone/mobile dan 3-kolom pada layar desktop.
   - Pilihan varian: *Al-Qur'an Hafalan*, *Al-Qur'an Terjemah*, *Al-Muttaqin A5*, *Al-Muttaqin A4 Jumbo*, *Tafsir Tematik*, *Cover Jaket Kulit*, dan *Buku Panduan Tajwid*.
5. **Form Pemesanan & Wilayah Berjenjang Otomatis (EMSIFA API)**:
   - **Tujuan Domestik (Indonesia)**: Dropdown hierarkis otomatis **Provinsi ➔ Kabupaten/Kota ➔ Kecamatan ➔ Desa/Kelurahan** terintegrasi dengan API Wilayah Indonesia.
   - **Tujuan Mancanegara (Luar Negeri)**: Pilihan negara tujuan (Malaysia, Singapura, Brunei, Arab Saudi, UAE, Qatar, Taiwan, Hong Kong, Jepang, dll.), State/Provinsi bagian, Kota, dan Postal/Zip Code.
6. **Kalkulator Ongkos Kirim & Berat Otomatis**:
   - Estimasi berat paket dihitung otomatis berdasarkan produk dan jumlah pesanan (Qty).
   - Penentuan zona tarif otomatis dari asal toko (**Weru Lor, Cirebon**):
     - Lokal Ciayumajakuning (Cirebon, Kuningan, Majalengka, Indramayu)
     - Jawa Barat, Jabodetabek & Banten
     - Jawa Tengah & D.I. Yogyakarta
     - Jawa Timur, Bali, NTB, Lampung
     - Sumatera, Kalimantan & Sulawesi
     - Maluku, Papua & NTT
     - Mancanegara (Pos EMS Internasional & DHL Express Worldwide)
   - Rincian biaya transparan: Subtotal produk + Ongkir otomatis + Kemasan aman & asuransi = Total Tagihan.
7. **Checkout WhatsApp Otomatis**:
   - Tombol pemesanan langsung membuka chat WhatsApp ke admin (+62 822-2948-9062) dengan format pesanan lengkap, nomor pesanan unik (Order ID), rincian produk, alamat lengkap terstruktur, dan total tagihan.
8. **Testimoni & Pengalaman Pembaca**:
   - Ulasan pembaca dengan tampilan horizontal swipe snap yang nyaman diakses pada perangkat seluler.
9. **Footer & Informasi Resmi**:
   - Nomor WhatsApp resmi: `0822-2948-9062`
   - Kantor Pusat: Weru Lor, Kec. Weru, Kabupaten Cirebon, Jawa Barat 45154
   - Kantor Pemasaran Bandung: Jalan Terusan Galunggung No. 9, Lingkar Selatan, Lengkong, Kota Bandung, Jawa Barat
   - Tautan media sosial resmi: Facebook (Tajug Al-Ibriz), Instagram (@masiwak_ibriez), YouTube (@santri.ngaji1926), dan TikTok (Gusmun al-Ibriz).

---

## 🛠️ Teknologi yang Digunakan

* **Frontend**: HTML5 Semantik, Vanilla CSS3 (Dark Mode, Glassmorphism, Responsive Mobile-First), Vanilla JavaScript (ES6+)
* **Backend**: Node.js, Express.js
* **Database**: **Neon Serverless PostgreSQL** (`pg` connection pool)
* **Integrasi Wilayah**: [EMSIFA API Wilayah Indonesia](https://emsifa.github.io/api-wilayah-indonesia/)

---

## 🗄️ Integrasi Database Neon PostgreSQL

Database di-hosting secara cloud serverless di **Neon PostgreSQL** (AWS Singapore `ap-southeast-1`):

### Konfigurasi `.env`
```env
DATABASE_URL=postgresql://neondb_owner:npg_s0Mwy1AHJgFn@ep-old-firefly-b3vvo99i-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3000
```

### Tabel yang Dikelola di Neon DB:
1. `catalog_products` - Katalog produk mushaf Al-Qur'an (nama, harga, kategori, gambar, berat, status).
2. `hero_banners` - Banner slider carousel landing page (judul, subtitle, tag, gradient, cta link, status).
3. `testimonials` - Ulasan pembeli mushaf & rating bintang.
4. `orders` - Rekam transaksi pemesanan masuk (Order ID, nama, WA, alamat, produk, qty, ongkir, grand total, status).
5. `store_settings` - Pengaturan toko & PIN keamanan Admin Dashboard.
6. `products` & `product_variants` - Relational catalog tables.
7. `shipping_zones`, `shipping_countries` & `order_status_logs` - Riwayat log status & zona pengiriman.

### Perintah Database:
```bash
# Inisialisasi & verifikasi tabel database Neon
npm run init-db

# Tes koneksi dan hitung baris tabel
npm run test-db
```

---

## 🚀 Menjalankan Aplikasi

```bash
# Menjalankan server fullstack (Web + Neon PostgreSQL API)
npm start

# Atau mode development
npm run dev
```

- **Website Toko**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin.html`
- **Health Check API**: `http://localhost:3000/api/health`
- **PIN Akses Admin Default**: `192837`
