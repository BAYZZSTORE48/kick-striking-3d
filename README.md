# VOLLEYBALL 3 VS 3
Prototype game voli indoor 3D untuk browser.

## File
- `index.html`: tampilan HUD dan kontrol.
- `style.css`: desain antarmuka dan kontrol HP.
- `game.js`: scene Three.js, lapangan, pemain, bola, AI, dan skor.

## Cara menjalankan di GitHub Pages
1. Upload ketiga file ke root repository GitHub.
2. Buka Settings > Pages.
3. Pilih Deploy from a branch, branch `main`, folder `/ (root)`, lalu Save.
4. Buka URL GitHub Pages setelah deploy selesai.

Game memuat Three.js dari CDN, jadi perlu koneksi internet.

## Kontrol
PC: WASD/tombol panah untuk bergerak, E pass, R set, F smash, Space servis.
HP: tombol arah dan tombol PASS / SET / SMASH / SERVIS.

## Catatan
Ada 3 pemain di tim biru dan 3 bot di tim merah. Pemain biru nomor 1 dikendalikan pengguna; dua rekan satu tim dan tiga lawan bergerak dengan AI sederhana. Model karakter saat ini berupa geometri 3D, belum model atlet realistis dengan animasi skeletal. Fisika bola dan aturan rally masih tahap prototype.
