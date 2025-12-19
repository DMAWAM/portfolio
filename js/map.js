document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("leafletMap");
    if (!el || !window.L) return;

    // Koordinaten Kerzers:
    const center = [46.9759, 7.1956];

    const map = L.map("leafletMap", { scrollWheelZoom: false }).setView(center, 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    L.marker(center).addTo(map).bindPopup("aufgewachsen ursprünglich in Bern, mittlerweile in Kerzers im Freiburger Seeland zuhause");
});
