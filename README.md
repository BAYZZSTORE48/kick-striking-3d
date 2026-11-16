# KICK STRIKING 3D — Starter

Proyek statis untuk GitHub Pages, tanpa Node.js.

## Upload ke GitHub
1. Ekstrak ZIP ini.
2. Upload **isi folder** ke root repository (index.html harus langsung terlihat di root).
3. GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.
4. Buka URL GitHub Pages setelah deployment selesai.

## Model petarung 3D
Slot model tersedia di `assets/models/player.glb`. Proyek ini tidak membuat manusia dari bentuk kotak/bola. Tambahkan model manusia original, rigged/sudah memiliki skeleton, dan berlisensi untuk dipakai. Ekspor sebagai GLB lalu beri nama `player.glb`.

## Yang sudah aktif
- Arena 3D Three.js dan pemuatan model GLB.
- Saldo awal $5.000.
- Fighter Shop: celana, gloves, rambut, tato.
- Upgrade power, speed, stamina (+5 poin per pembelian).
- Nama petarung dan penyimpanan lokal melalui localStorage.

## Yang belum dibuat
Pertandingan playable, lawan AI, wasit, animasi serangan, round timer, hasil pertandingan, dan pembayaran otomatis. Angka hadiah yang tampil di Career masih rancangan.

Three.js dan font diambil dari CDN, jadi browser perlu internet.
