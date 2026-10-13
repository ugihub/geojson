// Contoh rute di atas data jalan GeoJSON, memakai modul-modul peta CrootJS:
//   map.js        peta dan gambar datanya (sekaligus mengekspor fungsi geo.js)
//   mapmarker.js  pin A dan B yang bisa digeser
//   mapcontrol.js garis skala, tombol "lokasi saya", dan tombol live tracking
//   georoute.js   rute terpendek di sepanjang garis-garis di dalam data; ikut mengekspor
//                 fungsi geomeasure.js, di sini getDistance() untuk jarak garis lurus
import { createMap, addGeoJSON, fitMap, onMapClick, getGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@v0.0.16/map.js";
import { addMarker } from "https://cdn.jsdelivr.net/gh/crootjs/lib@v0.0.16/mapmarker.js";
import { addScaleBar, addLocateButton, addTrackButton } from "https://cdn.jsdelivr.net/gh/crootjs/lib@v0.0.16/mapcontrol.js";
import { findRoute, getDistance } from "https://cdn.jsdelivr.net/gh/crootjs/lib@v0.0.16/georoute.js";
import { setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@v0.0.16/element.js";

let roads = null;             // data jalan, diisi setelah termuat
let removeRoute = () => {};   // penghapus garis rute yang sedang tampil
let fitted = false;           // tampilan hanya dipaskan ke rute pertama, tidak setiap kali pin digeser

createMap("map", { center: [107.5759, -6.8736], zoom: 16 });
addScaleBar("map");
addLocateButton("map");
// Tombol ini mengikuti lokasi perangkat terus-menerus sampai diklik lagi.
addTrackButton("map");

// Dua pin yang bisa digeser. Setiap kali salah satunya selesai digeser, rutenya dihitung ulang.
const start = addMarker("map", [107.5760061, -6.8729768], { color: "#16a34a", label: "A", title: "Titik awal", draggable: true, onDragEnd: showRoute });
const end = addMarker("map", [107.5772, -6.8752], { color: "#dc2626", label: "B", title: "Tujuan", draggable: true, onDragEnd: showRoute });

// Klik di peta memindahkan tujuan ke titik yang diklik.
onMapClick("map", (position) => {
    end.setPosition(position);
    showRoute();
});

getGeoJSON("jalan.geojson", (response) => {
    if (!response.data) {
        setInnerText("status", "Data jalan gagal dimuat.");
        setInnerText("ongkos", "—");
        return;
    }
    roads = response.data;
    // Jaringan jalannya digambar tipis sebagai latar; popup dimatikan supaya klik pada
    // jalan tetap dihitung sebagai klik peta biasa.
    addGeoJSON("map", roads, { style: { stroke: "#6b7280", strokeWidth: 2, strokeOpacity: 0.5 }, popup: false });
    showRoute();
});

function showRoute() {
    if (!roads) return;
    const from = start.getPosition();
    const to = end.getPosition();

    // findRoute() mengembalikan Feature LineString biasa, jadi bisa langsung digambar.
    // null berarti kedua titik tidak terhubung oleh garis-garis di dalam data.
    const route = findRoute(from, to, roads);
    removeRoute();
    if (!route) {
        removeRoute = () => {};
        setInnerText("status", "Tidak ada rute di antara kedua titik itu.");
        setInnerText("ongkos", "—");
        return;
    }
    removeRoute = addGeoJSON("map", route, { style: { stroke: "#2563eb", strokeWidth: 5 }, popup: false });
    if (!fitted) {
        fitted = true;
        fitMap("map", route, 60);
    }

    const routeDistance = route.properties?.distance;
    if (!Number.isFinite(routeDistance)) {
        setInnerText("ongkos", "—");
        setInnerText("status", "Rute ditemukan, tetapi jaraknya tidak valid.");
        return;
    }

    // Tarif hanya ilustrasi untuk tugas, bukan tarif resmi Gojek.
    // Rp10.000 untuk 2 km pertama, tambahan Rp2.500 per km berikutnya.
    const biaya = 10000 + Math.ceil(Math.max(0, routeDistance - 2000) / 1000) * 2500;
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    });
    setInnerText("ongkos", formatter.format(biaya));

    const direct = getDistance(from, to);
    setInnerText(
        "status",
        `Rute A ke B: ${formatMeters(routeDistance)} lewat jalan, ${formatMeters(direct)} garis lurus.`
    );
}

function formatMeters(meters) {
    return meters >= 1000 ? (meters / 1000).toFixed(2) + " km" : Math.round(meters) + " m";
}
