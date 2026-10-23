import { db, auth } from "./firebase-config.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const createReportBtn = document.getElementById("createReportBtn");
  const reportTitle = document.getElementById("report-title");
  const reportDesc = document.getElementById("report-desc");
  const reportsList = document.getElementById("reports-list");

  // Detectar si hay sesión activa para cargar los reportes en pantalla
  onAuthStateChanged(auth, (user) => {
    if (user) {
      cargarReportes();
    }
  });

  // Publicar un reporte en Firebase Realtime Database
  if (createReportBtn) {
    createReportBtn.addEventListener("click", () => {
      const titulo = reportTitle.value.trim();
      const descripcion = reportDesc.value.trim();
      const user = auth.currentUser;

      if (!titulo || !descripcion) {
        alert("Debes llenar el título y la descripción del reporte.");
        return;
      }

      const reportesRef = ref(db, "reportes");
      
      push(reportesRef, {
        titulo: titulo,
        descripcion: descripcion,
        usuario: user ? user.email : "Anónimo",
        fecha: new Date().toLocaleString()
      })
      .then(() => {
        alert("¡Reporte publicado exitosamente!");
        reportTitle.value = "";
        reportDesc.value = "";
      })
      .catch((error) => {
        console.error("Error al guardar el reporte:", error);
        alert("Error al publicar: " + error.message);
      });
    });
  }

  // Leer y renderizar reportes desde la base de datos
  function cargarReportes() {
    const reportesRef = ref(db, "reportes");
    
    onValue(reportesRef, (snapshot) => {
      if (!reportsList) return;
      reportsList.innerHTML = "";
      const data = snapshot.val();

      if (data) {
        Object.keys(data).forEach((key) => {
          const item = data[key];
          const div = document.createElement("div");
          div.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          div.style.border = "1px solid #444";
          div.style.padding = "15px";
          div.style.marginBottom = "15px";
          div.style.borderRadius = "8px";
          div.style.textAlign = "left";
          
          div.innerHTML = `
            <h3 style="margin: 0 0 8px 0; color: #fff;">${item.titulo}</h3>
            <p style="margin: 0 0 10px 0; color: #ccc;">${item.descripcion}</p>
            <small style="color: #888;">Por: <b>${item.usuario}</b> | ${item.fecha}</small>
          `;
          reportsList.appendChild(div);
        });
      } else {
        reportsList.innerHTML = "<p>No hay reportes publicados en Santa Marta todavía.</p>";
      }
    });
  }

});