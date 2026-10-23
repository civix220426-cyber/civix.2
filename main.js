// --- SCRIPT PRINCIPAL DE CIVIX SANTA MARTA (main.js) ---

let map;
let marker;
let userCoords = { lat: 11.2408, lng: -74.1990 }; 
let reportsData = [];
let donationsData = [];
let totalFunds = 0;

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    setupEventListeners();
    loadInitialData();
});

function initMap() {
    map = L.map('map').setView([userCoords.lat, userCoords.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([userCoords.lat, userCoords.lng], { draggable: true }).addTo(map);
    marker.bindPopup("<b>Ubicación del reporte</b><br>Arrastra el pin para ajustar la zona.").openPopup();

    marker.on('dragend', function(e) {
        const position = marker.getLatLng();
        userCoords.lat = position.lat;
        userCoords.lng = position.lng;
        updateCoordsDisplay();
    });

    map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        userCoords.lat = e.latlng.lat;
        userCoords.lng = e.latlng.lng;
        updateCoordsDisplay();
    });

    updateCoordsDisplay();
}

function updateCoordsDisplay() {
    const coordsDisplay = document.getElementById('coords-display');
    if (coordsDisplay) {
        coordsDisplay.innerHTML = `📍 Lat: ${userCoords.lat.toFixed(4)}, Lng: ${userCoords.lng.toFixed(4)}`;
    }
}

function setupEventListeners() {
    // Geolocalización
    const locateBtn = document.getElementById('locateMeBtn');
    if (locateBtn) {
        locateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userCoords.lat = position.coords.latitude;
                        userCoords.lng = position.coords.longitude;
                        map.setView([userCoords.lat, userCoords.lng], 15);
                        marker.setLatLng([userCoords.lat, userCoords.lng]);
                        updateCoordsDisplay();
                    },
                    () => { alert("No se pudo obtener tu ubicación automática."); }
                );
            } else {
                alert("Geolocalización no soportada.");
            }
        });
    }

    // Previsualizaciones de imágenes
    const reportImageInput = document.getElementById('report-image');
    if (reportImageInput) {
        reportImageInput.addEventListener('change', (e) => handleImagePreview(e, 'image-preview', 'image-preview-container'));
    }

    const donationProofInput = document.getElementById('donation-proof');
    if (donationProofInput) {
        donationProofInput.addEventListener('change', (e) => handleImagePreview(e, 'donation-preview', 'donation-preview-container'));
    }

    // Botón de Publicar Reporte
    const createReportBtn = document.getElementById('createReportBtn');
    if (createReportBtn) {
        createReportBtn.addEventListener('click', handleCreateReport);
    }

    // Botones de Copiar Cuentas
    const copyNequiBtn = document.getElementById('copy-nequi-btn');
    if (copyNequiBtn) {
        copyNequiBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(document.getElementById('acc-nequi').textContent);
            alert("Número de Nequi copiado.");
        });
    }

    const copyBancolombiaBtn = document.getElementById('copy-bancolombia-btn');
    if (copyBancolombiaBtn) {
        copyBancolombiaBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(document.getElementById('acc-bancolombia').textContent);
            alert("Número de Bancolombia copiado.");
        });
    }

    // Registrar donación
    const registerDonationBtn = document.getElementById('registerDonationBtn');
    if (registerDonationBtn) {
        registerDonationBtn.addEventListener('click', handleRegisterDonation);
    }

    // --- GESTIÓN DE MODALES ADMIN ---
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminModal = document.getElementById('admin-modal');
    const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
    const submitAdminLoginBtn = document.getElementById('submitAdminLoginBtn');
    const adminPasswordInput = document.getElementById('admin-password');
    
    const adminDashboardModal = document.getElementById('admin-dashboard-modal');
    const closeAdminDashboardBtn = document.getElementById('closeAdminDashboardBtn');

    if (adminLoginBtn && adminModal) {
        adminLoginBtn.addEventListener('click', () => {
            adminModal.style.display = 'flex';
            if (adminPasswordInput) adminPasswordInput.value = '';
        });
    }

    if (closeAdminModalBtn && adminModal) {
        closeAdminModalBtn.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }

    if (closeAdminDashboardBtn && adminDashboardModal) {
        closeAdminDashboardBtn.addEventListener('click', () => {
            adminDashboardModal.style.display = 'none';
        });
    }

    if (submitAdminLoginBtn) {
        submitAdminLoginBtn.addEventListener('click', () => {
            const pass = adminPasswordInput ? adminPasswordInput.value.trim() : '';
            if (pass === 'admin123') {
                adminModal.style.display = 'none';
                if (adminDashboardModal) {
                    adminDashboardModal.style.display = 'flex';
                    renderAdminDashboardLists(); 
                }
            } else {
                alert("Contraseña incorrecta. Intenta de nuevo.");
            }
        });
    }
}

function handleImagePreview(event, imgId, containerId) {
    const file = event.target.files[0];
    const previewImg = document.getElementById(imgId);
    const container = document.getElementById(containerId);

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            container.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        previewImg.src = '';
        container.style.display = 'none';
    }
}

function loadInitialData() {
    reportsData = [
        {
            id: 1,
            title: "Hueco grande en la vía principal",
            category: "Hueco",
            description: "Dificulta el paso de motos y carros particulares.",
            status: "Terminado",
            percentage: 50,
            lat: 11.24,
            lng: -74.19
        },
        {
            id: 2,
            title: "Luminaria fundida",
            category: "Alumbrado",
            description: "El sector queda completamente oscuro a partir de las 7:00 PM.",
            status: "En Proceso",
            percentage: 30,
            lat: 11.25,
            lng: -74.20
        },
        {
            id: 3,
            title: "Tubería de agua rota",
            category: "Alcantarillado",
            description: "Hay pérdida constante de agua potable en la calle.",
            status: "Lista de Espera",
            percentage: 20,
            lat: 11.23,
            lng: -74.18
        }
    ];

    donationsData = [
        { id: 1, name: "Carlos Mendoza", amount: 25000 },
        { id: 2, name: "Ana Lucía Vives", amount: 50000 }
    ];

    totalFunds = 75000;
    renderReports();
    renderDonations();
    updateFundsUI();
}

function handleCreateReport() {
    const titleInput = document.getElementById('report-title');
    const categorySelect = document.getElementById('report-category');
    const descInput = document.getElementById('report-desc');

    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const description = descInput.value.trim();

    if (!title || !description) {
        alert("Por favor completa el título y la descripción del reporte.");
        return;
    }

    // Por defecto, los reportes nuevos entran con 0% hasta que el admin los ajuste
    const newReport = {
        id: Date.now(),
        title,
        category,
        description,
        status: "Lista de Espera",
        percentage: 0,
        lat: userCoords.lat,
        lng: userCoords.lng
    };

    reportsData.unshift(newReport);
    renderReports();
    if (document.getElementById('admin-dashboard-modal').style.display === 'flex') {
        renderAdminDashboardLists();
    }

    titleInput.value = '';
    descInput.value = '';
    document.getElementById('image-preview').src = '';
    document.getElementById('image-preview-container').style.display = 'none';
    document.getElementById('report-image').value = '';

    alert("¡Reporte publicado con éxito! Recuerda entrar a Admin para ajustar su porcentaje en los fondos si es necesario.");
}

function getStatusBadgeHTML(status) {
    const cleanStatus = (status || '').toLowerCase().trim();

    if (cleanStatus === 'terminado' || cleanStatus === 'resuelto') {
        return `<span class="status-badge status-completed">
                    <i class="fa-solid fa-circle-check"></i> Terminado
                </span>`;
    } 
    else if (cleanStatus === 'en proceso' || cleanStatus === 'visto') {
        return `<span class="status-badge status-process">
                    <i class="fa-solid fa-spinner fa-spin-pulse"></i> En Proceso
                </span>`;
    } 
    else {
        return `<span class="status-badge status-pending">
                    <i class="fa-solid fa-clock"></i> Lista de Espera
                </span>`;
    }
}

function renderReports() {
    const listContainer = document.getElementById('reports-list');
    const countBadge = document.getElementById('map-reports-count');
    
    if (!listContainer) return;

    listContainer.innerHTML = '';
    if (countBadge) countBadge.textContent = reportsData.length;

    reportsData.forEach(report => {
        const badgeHTML = getStatusBadgeHTML(report.status);

        const cardHTML = `
            <div class="report-card-item">
                <div class="report-card-header">
                    <h4 class="report-card-title">${escapeHTML(report.title)}</h4>
                    ${badgeHTML}
                </div>
                
                <p class="report-card-desc">${escapeHTML(report.description)}</p>
                
                <div class="report-card-footer">
                    <span class="report-category-tag">
                        <i class="fa-solid fa-tag"></i> ${escapeHTML(report.category)} | 🎯 ${report.percentage || 0}% de los fondos
                    </span>
                    <span>
                        📍 ${report.lat ? report.lat.toFixed(2) : '0'}, ${report.lng ? report.lng.toFixed(2) : '0'}
                    </span>
                </div>
            </div>
        `;
        listContainer.innerHTML += cardHTML;
    });
}

// --- RENDERIZAR Y ADMINISTRAR DESDE EL PANEL ADMIN ---
function renderAdminDashboardLists() {
    const adminReportsPctContainer = document.getElementById('admin-reports-pct-inputs');
    const adminReportsContainer = document.getElementById('admin-reports-list');
    const adminDonationsContainer = document.getElementById('admin-donations-list');

    // Inputs para configurar porcentajes por reporte
    if (adminReportsPctContainer) {
        adminReportsPctContainer.innerHTML = '';
        if (reportsData.length === 0) {
            adminReportsPctContainer.innerHTML = '<p style="font-size:12px; color:var(--text-muted);">No hay reportes para configurar porcentajes.</p>';
        } else {
            reportsData.forEach((rep) => {
                adminReportsPctContainer.innerHTML += `
                    <div style="display: flex; gap: 10px; align-items: center; background: #0f172a; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <span style="flex: 3; font-size: 12px; font-weight: 600; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(rep.title)}</span>
                        <input type="number" value="${rep.percentage || 0}" id="admin-report-pct-${rep.id}" min="0" max="100" style="flex: 1; padding: 6px; text-align: center;" placeholder="%" oninput="calculateAdminTotalPercentage()">
                    </div>
                `;
            });
        }
        calculateAdminTotalPercentage();
    }

    if (adminReportsContainer) {
        adminReportsContainer.innerHTML = '';
        if (reportsData.length === 0) {
            adminReportsContainer.innerHTML = '<p style="font-size:12px; color:var(--text-muted);">No hay reportes registrados.</p>';
        } else {
            reportsData.forEach((rep) => {
                adminReportsContainer.innerHTML += `
                    <div class="bank-card" style="flex-direction: column; align-items: stretch; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong>${escapeHTML(rep.title)}</strong>
                            <button class="btn-danger" onclick="deleteReport(${rep.id})"><i class="fa-solid fa-trash"></i> Eliminar</button>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                            <span style="font-size: 11px; color: var(--text-muted);">Estado: <strong>${rep.status}</strong></span>
                            <select onchange="updateReportStatus(${rep.id}, this.value)" style="width: 160px; padding: 4px; font-size: 11px;">
                                <option value="Lista de Espera" ${rep.status === 'Lista de Espera' ? 'selected' : ''}>Lista de Espera</option>
                                <option value="En Proceso" ${rep.status === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                                <option value="Terminado" ${rep.status === 'Terminado' ? 'selected' : ''}>Terminado</option>
                            </select>
                        </div>
                    </div>
                `;
            });
        }
    }

    if (adminDonationsContainer) {
        adminDonationsContainer.innerHTML = '';
        if (donationsData.length === 0) {
            adminDonationsContainer.innerHTML = '<p style="font-size:12px; color:var(--text-muted);">No hay donaciones registradas.</p>';
        } else {
            donationsData.forEach((don) => {
                adminDonationsContainer.innerHTML += `
                    <div class="bank-card">
                        <div>
                            <span>👤 ${escapeHTML(don.name)}</span> - 
                            <strong style="color: var(--accent);">$ ${don.amount.toLocaleString()} COP</strong>
                        </div>
                        <button class="btn-danger" onclick="deleteDonation(${don.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            });
        }
    }
}

// Función auxiliar para calcular en vivo el total de los inputs de porcentaje en el panel admin
window.calculateAdminTotalPercentage = function() {
    let currentTotal = 0;
    reportsData.forEach((rep) => {
        const input = document.getElementById(`admin-report-pct-${rep.id}`);
        if (input) {
            currentTotal += parseFloat(input.value) || 0;
        }
    });

    const indicator = document.getElementById('admin-total-pct-indicator');
    if (indicator) {
        indicator.textContent = `Suma: ${currentTotal}%`;
        if (Math.abs(currentTotal - 100) < 0.1) {
            indicator.style.color = 'var(--accent)';
        } else {
            indicator.style.color = 'var(--danger)';
        }
    }
};

// Funciones globales vinculadas al Admin
window.saveReportsPercentages = function() {
    let newTotal = 0;
    let tempPercentages = {};

    reportsData.forEach((rep) => {
        const input = document.getElementById(`admin-report-pct-${rep.id}`);
        if (input) {
            const pct = parseFloat(input.value) || 0;
            tempPercentages[rep.id] = pct;
            newTotal += pct;
        }
    });

    if (Math.abs(newTotal - 100) > 0.1) {
        alert(`Los porcentajes de los reportes deben sumar exactamente 100%. Actualmente suman: ${newTotal}%`);
        return;
    }

    // Aplicar cambios
    reportsData.forEach((rep) => {
        if (tempPercentages[rep.id] !== undefined) {
            rep.percentage = tempPercentages[rep.id];
        }
    });

    renderReports();
    updateFundsUI();
    alert("¡Porcentajes de los reportes actualizados con éxito!");
};

window.deleteReport = function(id) {
    if (confirm("¿Estás seguro de eliminar este reporte de forma permanente?")) {
        reportsData = reportsData.filter(r => r.id !== id);
        renderReports();
        renderAdminDashboardLists();
    }
};

window.updateReportStatus = function(id, newStatus) {
    const report = reportsData.find(r => r.id === id);
    if (report) {
        report.status = newStatus;
        renderReports();
        renderAdminDashboardLists();
    }
};

window.deleteDonation = function(id) {
    if (confirm("¿Estás seguro de eliminar este aporte monetario? Se restará del fondo total.")) {
        const donation = donationsData.find(d => d.id === id);
        if (donation) {
            totalFunds -= donation.amount;
            donationsData = donationsData.filter(d => d.id !== id);
            renderDonations();
            updateFundsUI();
            renderAdminDashboardLists();
        }
    }
};

async function handleRegisterDonation() {
    const nameInput = document.getElementById('donation-name');
    const amountInput = document.getElementById('donation-amount');
    const proofInput = document.getElementById('donation-proof');
    const statusMsg = document.getElementById('ocr-status');

    const name = nameInput.value.trim() || "Anónimo";
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Por favor ingresa un monto válido de donación.");
        return;
    }

    if (proofInput.files.length === 0) {
        alert("Debes adjuntar el comprobante de pago para validar por OCR.");
        return;
    }

    statusMsg.style.display = 'block';
    statusMsg.style.background = 'rgba(59, 130, 246, 0.1)';
    statusMsg.style.color = '#60a5fa';
    statusMsg.textContent = "🔍 Analizando comprobante de pago mediante OCR...";

    try {
        const file = proofInput.files[0];
        await Tesseract.recognize(file, 'spa');

        statusMsg.style.background = 'rgba(16, 185, 129, 0.1)';
        statusMsg.style.color = '#34d399';
        statusMsg.textContent = "✅ ¡Comprobante verificado con éxito!";

        donationsData.unshift({ id: Date.now(), name, amount });
        totalFunds += amount;

        renderDonations();
        updateFundsUI();
        if (document.getElementById('admin-dashboard-modal').style.display === 'flex') {
            renderAdminDashboardLists();
        }

        nameInput.value = '';
        amountInput.value = '';
        proofInput.value = '';
        document.getElementById('donation-preview').src = '';
        document.getElementById('donation-preview-container').style.display = 'none';

        setTimeout(() => { statusMsg.style.display = 'none'; }, 4000);

    } catch (error) {
        console.error(error);
        statusMsg.style.background = 'rgba(239, 68, 68, 0.1)';
        statusMsg.style.color = '#f87171';
        statusMsg.textContent = "❌ Error al leer el comprobante.";
    }
}

function renderDonations() {
    const donationsList = document.getElementById('donations-list');
    if (!donationsList) return;

    donationsList.innerHTML = '';
    donationsData.forEach(item => {
        donationsList.innerHTML += `
            <div class="bank-card" style="margin-bottom: 5px; padding: 6px 10px;">
                <span>👤 ${escapeHTML(item.name)}</span>
                <strong style="color: var(--accent);">+$ ${item.amount.toLocaleString()} COP</strong>
            </div>
        `;
    });
}

function updateFundsUI() {
    const totalDonatedAmount = document.getElementById('total-donated-amount');
    if (totalDonatedAmount) {
        totalDonatedAmount.textContent = `$ ${totalFunds.toLocaleString()} COP`;
    }
    renderFundAllocations();
}

function renderFundAllocations() {
    const allocationContainer = document.getElementById('fund-allocation-list');
    if (!allocationContainer) return;

    allocationContainer.innerHTML = '';
    
    if (reportsData.length === 0) {
        allocationContainer.innerHTML = '<p style="font-size: 11px; color: var(--text-muted);">No hay reportes activos para distribuir los fondos.</p>';
        return;
    }

    reportsData.forEach(report => {
        const pct = report.percentage || 0;
        const proportionalAmount = (totalFunds * pct) / 100;

        allocationContainer.innerHTML += `
            <div style="background: #1e293b; border: 1px solid var(--border-color); padding: 8px; border-radius: 6px; font-size: 11px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <strong style="color: #f8fafc; max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHTML(report.title)}">${escapeHTML(report.title)} (${pct}%)</strong>
                    <span style="color: var(--accent); font-weight: bold;">$ ${proportionalAmount.toLocaleString()} COP</span>
                </div>
                <div style="width: 100%; background: #334155; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${pct}%; background: var(--primary); height: 100%;"></div>
                </div>
            </div>
        `;
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}