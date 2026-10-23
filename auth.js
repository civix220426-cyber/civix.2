import { auth } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const authContainer = document.getElementById("auth-container");
  const userPanel = document.getElementById("user-panel");
  const userEmailDisplay = document.getElementById("user-email-display");
  const reportsSection = document.getElementById("reports-section");

  // 1. REGISTRAR USUARIO
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        alert("Por favor completa los campos de correo y contraseña.");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("¡Cuenta creada exitosamente en Civix!");
        })
        .catch((error) => {
          alert("Error al registrarse: " + error.message);
        });
    });
  }

  // 2. INICIAR SESIÓN
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        alert("Por favor ingresa tu correo y contraseña.");
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("¡Sesión iniciada correctamente!");
        })
        .catch((error) => {
          alert("Error al ingresar: " + error.message);
        });
    });
  }

  // 3. CERRAR SESIÓN
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          alert("Has cerrado sesión.");
        })
        .catch((error) => {
          console.error("Error al salir:", error);
        });
    });
  }

  // 4. OBSERVADOR DE ESTADO (Mandar a la pantalla de reportes)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Ocultar formulario de Login / Registro
      if (authContainer) authContainer.style.display = "none";
      
      // Mostrar saludo y la sección de reportes
      if (userPanel) userPanel.style.display = "block";
      if (userEmailDisplay) userEmailDisplay.textContent = user.email;
      if (reportsSection) reportsSection.style.display = "block";
    } else {
      // Ocultar reportes y saludo, mostrar Login
      if (authContainer) authContainer.style.display = "block";
      if (userPanel) userPanel.style.display = "none";
      if (reportsSection) reportsSection.style.display = "none";
      
      if (emailInput) emailInput.value = "";
      if (passwordInput) passwordInput.value = "";
    }
  });

});