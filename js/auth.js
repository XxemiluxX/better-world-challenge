import "./app.js";
const {loadDB, saveDB, setSession, getSession} = window.BWC;

function setMessage(id, text, type="error") {
  const el = document.getElementById(id); if (!el) return;
  el.textContent = text; el.className = `form-message ${type}`;
}

async function hashPassword(password) {
  // DEMO: solo guarda un hash para evitar almacenar la contraseña en texto plano.
  // PARA PRODUCCIÓN: Firebase Authentication debe manejar las credenciales.
  if (window.crypto?.subtle) {
    const data = new TextEncoder().encode(password);
    const buffer = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2,"0")).join("");
  }
  return btoa(unescape(encodeURIComponent(password)));
}

function goBySession() {
  const session = getSession();
  if (!session) return;
  window.location.href = session.role === "admin" ? "admin.html" : "profile.html";
}

document.addEventListener("DOMContentLoaded", () => {
  goBySession();

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value;
      const db = loadDB();
      const user = db.users.find(u => u.email.toLowerCase() === email);
      if (!user) return setMessage("loginMessage", "No encontramos una cuenta con ese correo.");
      const hash = await hashPassword(password);
      // Las cuentas demo sembradas tienen passwordHash="demo" y pueden entrar con "demo".
      const ok = user.passwordHash === hash || (user.passwordHash === "demo" && password === "demo");
      if (!ok) return setMessage("loginMessage", "La contraseña no coincide.");
      setSession(user.id, user.role);
      window.location.href = user.role === "admin" ? "admin.html" : "profile.html";
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("registerName").value.trim();
      const email = document.getElementById("registerEmail").value.trim().toLowerCase();
      const password = document.getElementById("registerPassword").value;
      const password2 = document.getElementById("registerPassword2").value;
      const db = loadDB();

      if (name.length < 2) return setMessage("registerMessage", "Escribe tu nombre.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMessage("registerMessage", "Usa un correo válido.");
      if (password.length < 6) return setMessage("registerMessage", "La contraseña debe tener al menos 6 caracteres.");
      if (password !== password2) return setMessage("registerMessage", "Las contraseñas no coinciden.");
      if (db.users.some(u => u.email.toLowerCase() === email)) return setMessage("registerMessage", "Ese correo ya está registrado.");

      const passwordHash = await hashPassword(password);
      const user = {id:window.BWC.uid("user"), name, email, passwordHash, role:"participant", currentChallenge:1, completed:0, createdAt:window.BWC.nowISO()};
      db.users.push(user); saveDB(db); setSession(user.id, "participant");
      setMessage("registerMessage", "Cuenta creada. Redirigiendo…", "success");
      setTimeout(() => window.location.href = "profile.html", 500);
    });
  }

  document.getElementById("adminDemoBtn")?.addEventListener("click", () => {
    // DEMO: el rol de administrador no es seguro en frontend.
    setSession("demo_admin", "admin");
    window.location.href = "admin.html";
  });

  document.querySelectorAll("#googleDemoBtn,#googleRegisterBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Demo: aquí se conectaría Firebase Authentication / Google OAuth.\n\nEn producción, no autentiques usuarios con JavaScript local.");
    });
  });
});
