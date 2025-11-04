# 📺 YoruStream - Platform Streaming Hiburan Lengkap

Website streaming multimedia yang modern dan komprehensif, menawarkan berbagai konten hiburan dari anime, donghua, manga, film, hingga siaran TV Indonesia, semuanya dalam satu platform yang responsif dan bebas iklan.

## 🎯 Fitur Utama

### 📚 Konten

- **Anime** - Streaming dan download anime terbaru dengan berbagai pilihan server.
- **Donghua** - Nikmati anime China terbaik dengan subtitle Indonesia.
- **Manga** - Baca manga, manhwa, dan manhua online dengan reader yang nyaman.
- **Film** - Tonton film terbaru dari berbagai negara dan genre.
- **TV Channel** - Saksikan siaran langsung TV Indonesia 24/7.

### 🎨 Tampilan & Pengalaman Pengguna (UX)

- **Loading Screen Animasi** - Tampilan memuat yang menarik saat pertama kali membuka website.
- **Navigasi Modern** - Navbar yang sticky dengan hamburger menu untuk perangkat mobile.
- **Tema yang Dapat Diubah** - Kustomisasi tampilan website langsung dari panel pengaturan.
- **Modal Interaktif** - Setiap konten ditampilkan di popup/modal yang elegan untuk fokus yang lebih baik.
- **Animasi Halus** - Transisi dan animasi yang meningkatkan pengalaman pengguna.
- **Grid Layout yang Rapi** - Tampilan konten yang terorganisir dan mudah dijelajahi.

### ⚙️ Fungsionalitas

- **Pencarian Terintegrasi** - Fitur pencarian di setiap kategori konten untuk menemukan judul dengan cepat.
- **Filter & Sorting** - Saring konten berdasarkan genre, tipe (manga/manhwa), musim, tahun, dll.
- **Multi-View Toggle** - Beralih antara tampilan yang berbeda (misal: Ongoing/Completed, Anime/Batch).
- **Navigasi Halaman (Pagination)** - Jelajahi ratusan konten dengan mudah melalui sistem pagination.
- **Pemutar TV Terintegrasi** - Menonton siaran TV langsung di browser menggunakan teknologi HLS.js.

### 🔐 Keamanan

- **Panel Owner Terproteksi** - Dashboard khusus untuk owner yang dilindungi password untuk mengelola website.

---

## 📁 Struktur Proyek

Struktur folder yang diorganisir dengan baik untuk kemudahan pengembangan dan maintenance.

```
YoruStream/
├── index.html          # File HTML utama
│── style.css           # Stylesheet utama
│── themes.css          # Stylesheet untuk tema-tema yang tersedia
│── responsive.css      # Stylesheet untuk desain responsif
├── js/
│── script.js           # Logika utama website (navigasi, modal, dll.)
│── themes.js           # Logika untuk penggantian tema
│── anime.js            # Logika untuk fetching dan menampilkan data Anime
│── donghua.js          # Logika untuk fetching dan menampilkan data Donghua
│── manga.js            # Logika untuk fetching dan menampilkan data Manga
│── film.js             # Logika untuk fetching dan menampilkan data Film
│── tv.js               # Logika untuk streaming TV Channel
```

---

## 🚀 Instalasi & Penggunaan

Ikuti langkah-langkah sederhana ini untuk menjalankan website secara lokal.

### 1. Download/Clone Repository

Unduh semua file repository dan ekstrak ke komputer Anda.

### 2. Buka di Browser

Cara termudah adalah dengan membuka file `index.html` langsung di browser Anda (Chrome, Firefox, Edge).

> **Catatan:** Untuk pengalaman terbaik dan menghindari masalah CORS dengan API, disarankan untuk menjalankan website menggunakan server lokal. Anda bisa menggunakan ekstensi **Live Server** di Visual Studio Code.

### 3. Jelajahi Fitur

Website sudah siap digunakan! Anda bisa langsung menjelajahi semua konten dan fitur yang tersedia.

---

## 🎨 Kustomisasi Tema

YoruStream hadir dengan beberapa pilihan tema yang dapat diubah langsung dari pengaturan:

1. Klik ikon **⚙️ Pengaturan** di navbar.
2. Pilih tema favorit Anda dari pilihan yang ada (Dark, Light, Neon, Purple, dll.).
3. Tampilan website akan berubah secara instan.

---

## 🔐 Akses Owner Panel

Panel owner menyediakan akses khusus untuk pengelolaan website.

1. Klik ikon **👑 Owner** di navbar.
2. Masukkan password owner Anda.
3. Jika password benar, dashboard owner akan terbuka, di mana Anda dapat melakukan aksi seperti membersihkan cache atau mereset pengaturan.

---

## 🌐 API & Sumber Data

Website ini mengambil data secara dinamis dari berbagai sumber. Konfigurasi API endpoint terletak di dalam file JavaScript masing-masing kategori:

- **Anime & Donghua**: `js/anime.js` & `js/donghua.js`
- **Manga**: `js/manga.js`
- **Film**: `js/film.js`
- **TV**: `js/tv.js`

Pastikan file-file JavaScript tersebut memiliki konfigurasi API yang benar agar konten dapat dimuat.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur konten yang semantik.
- **CSS3** - Styling modern dengan Custom Properties, Flexbox, dan Grid.
- **Vanilla JavaScript (ES6+)** - Logika aplikasi yang modular dan efisien.
- **Font Awesome** - Ikon yang konsisten dan berkualitas tinggi.
- **HLS.js** - Pustaka JavaScript untuk memutar streaming HLS (TV Channel).
- **AOS (Animate On Scroll)** - _(Opsional, jika ditambahkan)_ Untuk animasi gulir yang menarik.

---

## 📱 Desain Responsif

Website ini dirancang untuk memberikan pengalaman terbaik di berbagai perangkat:

- 💻 **Desktop/Laptop** - Tampilan penuh dengan semua fitur.
- 📱 **Tablet** - Layout yang menyesuaikan dengan layar sedang.
- 📱 **Mobile** - Navigasi hamburger dan layout yang dioptimalkan untuk sentuhan.

---

## 📞 Kontak

Untuk pertanyaan, dukungan, atau kerjasama, silakan hubungi owner:

- **Instagram**: [@_rheex_](https://www.instagram.com/_rheex_/)
- **Facebook**: [RheexV2](https://web.facebook.com/RheexV2?locale=id_ID)
- **TikTok**: [@ryuukurogane](https://www.tiktok.com/@ryuukurogane)
- **YouTube**: [@Rheex-XYZ](https://www.youtube.com/@Rheex-XYZ)

---

## 📜 Lisensi

© 2025 YoruStream by Rheex. All rights reserved.

---

**Dibuat dengan ❤️ oleh Rheex-XYZ**
