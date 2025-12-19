document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("leafletMap");
    if (!el || !window.L) return;

    // Grob Bern-Zentrum:
    const center = [46.948, 7.4474];

    const map = L.map("leafletMap", { scrollWheelZoom: false }).setView(center, 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    L.marker(center).addTo(map).bindPopup("Region Bern");
});
