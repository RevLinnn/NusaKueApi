
# 🌟 NusaKue API 🍰🏪

API untuk **memprediksi jenis kue tradisional Indonesia** dari gambar menggunakan **TensorFlow.js** dan **Hapi.js**.  
Mendukung fitur prediksi gambar, manajemen data kue & UMKM, serta pengambilan statistik prediksi teratas.

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

## 📦 Teknologi

- [TensorFlow.js](https://www.tensorflow.org/js) – model prediksi gambar  
- [Hapi.js](https://hapi.dev/) – framework API server  
- [Firebase Firestore](https://firebase.google.com/docs/firestore) – penyimpanan data  
- [Firebase Cloud Storage](https://firebase.google.com/docs/storage) – penyimpanan gambar  
- [Sharp](https://sharp.pixelplumbing.com/) – preprocessing gambar  

---

## 🔗 Base URL
```
http://localhost:3000
```

---

## 📌 Endpoints

### 🍰 Kue

| Method | Endpoint        | Deskripsi                     |
|--------|------------------|-------------------------------|
| `GET`  | `/cakes`         | Ambil semua data kue         |
| `GET`  | `/cakes/{id}`    | Ambil detail kue berdasarkan ID |
| `POST` | `/cakes`         | Tambah kue baru              |

**POST /cakes**  
Form-data:
- `nama`: string  
- `asal`: JSON array string (contoh: `["Jawa", "Sumatra"]`)  
- `bahan_pembuatan`: JSON array string  
- `budaya`: string  
- `cara_pembuatan`: string  
- `deskripsi`: string  
- `image`: file  

---

### 🤖 Prediksi

| Method | Endpoint           | Deskripsi                                      |
|--------|--------------------|-----------------------------------------------|
| `POST` | `/predict`         | Kirim gambar, dapatkan prediksi kue dari model |
| `GET`  | `/top-predictions` | Ambil 5 kue yang paling sering dikenali        |

**POST /predict**  
Form-data:
- `image`: file

---

### 🏪 UMKM

| Method | Endpoint                | Deskripsi                                  |
|--------|-------------------------|--------------------------------------------|
| `GET`  | `/umkms`                | Ambil semua data UMKM                      |
| `GET`  | `/umkms/{id}`           | Ambil detail UMKM berdasarkan ID           |
| `POST` | `/umkms`                | Tambah UMKM baru                           |
| `GET`  | `/umkms-cakes/{id}`     | Ambil UMKM yang menjual kue berdasarkan ID kue |

**POST /umkms**  
Form-data:
- `nama`: string  
- `alamat`: string  
- `no_telp`: string  
- `paling_diminati`: JSON array string (contoh: `["Kue A","Kue B"]`)  
- `image`: file *(opsional)*

---

## 📄 Ringkasan Response Schema

- **`Cake`**: Detail kue seperti nama, asal, bahan, budaya, cara pembuatan, gambar.
- **`Umkm`**: Data UMKM seperti nama, alamat, kontak, produk yang diminati.
- **`PredictionData`**: Hasil prediksi kue, skor keyakinan, metadata kue.
- **`TopPrediction`**: Daftar kue yang paling sering dikenali model.
- **`FailResponse` / `ErrorResponse`**: Format standar untuk kesalahan (status dan pesan).

---