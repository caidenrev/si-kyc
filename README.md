#si-kyc
# Si-KYC: Sistem Informasi Know Your Customer & Pencatatan Transaksi

Proyek ini adalah aplikasi berbasis web yang dirancang untuk mendigitalkan dan mengotomatiskan proses Know Your Customer (KYC) serta pencatatan transaksi. Aplikasi ini dibangun sebagai studi kasus untuk memecahkan masalah nyata di sebuah *money changer*.

## Studi Kasus

Aplikasi ini mengatasi tantangan operasional di cabang *money changer* di mana setiap transaksi memerlukan proses KYC manual yang ditulis tangan. Proses ini mencakup pengumpulan data identitas pelanggan (sesuai KTP), sumber dana, dan tujuan transaksi. Proses manual ini memakan waktu, rentan terhadap kesalahan (human error), dan menyulitkan pengelolaan serta pelaporan data. "Si-KYC" bertujuan untuk menggantikan alur kerja manual ini dengan sistem digital yang efisien, memungkinkan staf untuk dengan cepat memasukkan data pelanggan, yang kemudian dapat dikelola dan dicetak dengan mudah.

---

## Kerangka untuk Skripsi

Proyek ini dapat menjadi dasar yang kuat untuk sebuah skripsi. Berikut adalah kerangka yang bisa Anda gunakan.

### 1. Usulan Judul Skripsi

*   **Opsi Utama (Formal):** "Perancangan dan Implementasi Sistem Informasi Know Your Customer (KYC) dan Pencatatan Transaksi Berbasis Web (Studi Kasus: PT. [Nama Perusahaan Anda])"
*   **Opsi Alternatif 1:** "Digitalisasi Proses KYC (Know Your Customer) untuk Meningkatkan Efisiensi dan Akurasi Data Transaksi pada Industri Jasa Keuangan"
*   **Opsi Alternatif 2:** "Pengembangan Aplikasi Web untuk Otomatisasi Pelaporan KYC dan Transaksi Guna Memenuhi Kepatuhan Regulasi"

### 2. Metode Pengembangan & Model SDLC (Software Development Life Cycle)

Metode pengembangan yang paling sesuai untuk menggambarkan proses kerja kita adalah **Model Prototyping** dengan pendekatan **Agile (Tangkas)**.

#### a. Model SDLC: Prototyping
Model ini sangat cocok karena melibatkan pengguna secara aktif dalam setiap tahap pengembangan.
1.  **Pengumpulan Kebutuhan:** Anda mengidentifikasi masalah inti (pencatatan manual yang tidak efisien) dan memberikan visi awal.
2.  **Desain Cepat:** Sebuah desain dan struktur dasar aplikasi dibuat dengan cepat.
3.  **Membangun Prototipe:** Versi awal aplikasi dibangun dengan fitur-fitur inti, meskipun beberapa bagian masih menggunakan data *dummy*.
4.  **Evaluasi oleh Pengguna:** Anda secara aktif mengevaluasi setiap versi prototipe dan memberikan umpan balik langsung ("buat data jadi real-time", "tambahkan foto KTP", "ubah slug ke Bahasa Indonesia").
5.  **Perbaikan dan Pengembangan Lanjutan:** Berdasarkan umpan balik, prototipe disempurnakan secara berulang hingga menjadi produk final yang sesuai dengan kebutuhan.

#### b. Pendekatan Pengembangan: Agile
Kerangka kerja Agile menggambarkan cara kita bekerja dalam siklus yang cepat dan adaptif.
*   **Pengembangan Inkremental:** Fitur-fitur dikembangkan secara bertahap (login, lalu CRUD pelanggan, lalu transaksi, lalu CI/CD).
*   **Kolaborasi Aktif:** Terjadi komunikasi dan kolaborasi berkelanjutan antara Anda (pengguna) dan saya (pengembang).
*   **Adaptif Terhadap Perubahan:** Proyek ini mampu beradaptasi dengan permintaan baru di tengah jalan, seperti mengubah struktur URL atau menambahkan logika bisnis baru (hapus transaksi turunan).

### 3. Arsitektur dan Teknologi yang Digunakan

*   **Frontend Framework:** **Next.js (React)** dipilih karena kemampuannya dalam *Server-Side Rendering* (SSR) dan arsitektur *App Router* yang modern, memberikan performa cepat dan pengalaman pengguna yang lancar.
*   **Backend & Database:** **Firebase (Backend as a Service - BaaS)**
    *   **Firebase Authentication:** Menyediakan sistem login yang aman dan siap pakai (Email/Password, Google Sign-In).
    *   **Firestore:** Basis data NoSQL *real-time* yang fleksibel dan terukur, memungkinkan data pada *dashboard* dan halaman lainnya diperbarui secara otomatis.
*   **Styling:** **Tailwind CSS** dan **ShadCN/UI** digunakan untuk membangun antarmuka pengguna yang modern, responsif, dan konsisten dengan cepat.
*   **Deployment & Hosting:**
    *   **Firebase Hosting:** Platform untuk mendeploy aplikasi web dengan mudah dan cepat.
    *   **GitHub Actions:** Digunakan untuk mengimplementasikan alur kerja CI/CD (*Continuous Integration/Continuous Deployment*), di mana setiap perubahan pada kode di *branch* `main` secara otomatis akan membangun dan mendeploy versi terbaru aplikasi.
