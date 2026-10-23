// Inicializar mapa simple en Santa Marta
const map = L.map('map', { zoomControl: false }).setView([11.2408, -74.1990], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);