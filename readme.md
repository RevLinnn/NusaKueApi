# 🌟 NusaKue API

API untuk **memprediksi jenis kue tradisional Indonesia** dari gambar menggunakan **TensorFlow.js** dan **Hapi.js**.  
Mendukung prediksi gambar, penyimpanan data prediksi, serta pengambilan data kue dan UMKM terkait.

---

## 🚀 Menjalankan

1. **Clone project**:
    ```bash
    git clone https://github.com/username/nusakueapi.git
    cd nusakueapi
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Jalankan server**:
    ```bash
    npm run start
    ```

4. Buka di browser atau client API:  
   [http://localhost:3000](http://localhost:3000)

---

## 🔗 Endpoint

| Method | Endpoint           | Deskripsi                                                      |
| ------ | ------------------ | -------------------------------------------------------------- |
| POST   | `/predict`         | Kirim gambar dan dapatkan prediksi kue serta simpan data prediksi ke database |
| GET    | `/cakes`           | Ambil semua data kue                                           |
| GET    | `/cakes/{id}`      | Ambil data kue berdasarkan ID                                  |
| GET    | `/umkms`           | Ambil semua data UMKM                                          |
| GET    | `/umkms/{id}`      | Ambil data UMKM berdasarkan ID                                 |
| GET    | `/top-predictions` | Ambil daftar kue yang paling sering diprediksi (top 5)        |

---

## 📦 Teknologi

- [TensorFlow.js](https://www.tensorflow.org/js) - untuk model prediksi gambar  
- [Hapi.js](https://hapi.dev/) - framework API server  
- [Firebase Firestore](https://firebase.google.com/docs/firestore) - penyimpanan data  
- [Firebase Cloud Storage](https://firebase.google.com/docs/storage) - penyimpanan gambar  
- [Sharp](https://sharp.pixelplumbing.com/) - preprocessing gambar  

---
