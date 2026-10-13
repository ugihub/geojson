# Aplikasi GeoJSON CrootJS — Rute & Tarif Simulasi

Proyek tugas SIG. File asli `7141240016.geojson` pada root repository dipertahankan. Folder ini berisi aplikasi rute dengan CrootJS (tanpa Leaflet/Google Maps JS), data jalan `LineString`, dan estimasi ongkos minimum Rp10.000. Bukan aplikasi resmi Gojek dan bukan tarif nyata.

## GitHub Pages
Pengaturan: Settings → Pages → Deploy from a branch → `master` → `/docs` → Save. Setelah aktif, URL akan berbentuk `https://ugihub.github.io/geojson/`. Jangan menganggap URL live sebelum deployment sukses.

Data jalan disadur dari [crootjs/examples](https://github.com/crootjs/examples/tree/main/geo/route), dengan kredit OpenStreetMap contributors. Library: https://croot.js.org/docs/georoute


## Audit dependensi dan kompatibilitas (13 Oktober 2026)
- Hanya memakai CrootJS `v0.0.16`: `map.js`, `mapmarker.js`, `mapcontrol.js`, `georoute.js`, `element.js`, yang dimuat dari GitHub `crootjs/lib` melalui CDN jsDelivr. Tidak ada Leaflet, OpenLayers, Mapbox GL JS, Turf.js, jQuery, atau library JavaScript lain.
- Menggunakan ES Modules (`<script type="module" src="index.js">`) dan urutan koordinat GeoJSON [longitude, latitude].
- GeoJSON jalan: 225 LineString, 968 simpul (pembulatan 6 desimal), 1 komponen jaringan terhubung. Titik awal contoh diletakkan di ruas jalan.
- `findRoute()` memakai jaringan jalan dan menghasilkan `properties.distance` dalam meter. Tarif hanya simulasi: minimum Rp10.000 untuk 2 km pertama, tambahan Rp2.500 per km berikutnya.
- Peta dasar adalah gambar tile OpenStreetMap yang diambil **oleh CrootJS map.js**, bukan library JavaScript tambahan. Membutuhkan koneksi internet dan wajib atribusi.
- Hasil audit adalah pemeriksaan kode statis dan data; pengujian runtime di browser dan deployment GitHub Pages perlu dilakukan terpisah.
