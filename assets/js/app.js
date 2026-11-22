/**
 * UI Controller & Interactions - Networking de Trabajadores Sociales
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  
  // Google Buttons
  const btnGoogleLogin = document.getElementById('btn-google-login');
  const btnGoogleRegister = document.getElementById('btn-google-register');

  // Password Toggles
  const toggleLoginPass = document.getElementById('toggle-login-password');
  const loginPassInput = document.getElementById('login-password');
  const toggleRegPass = document.getElementById('toggle-register-password');
  const regPassInput = document.getElementById('register-password');

  // Caps lock
  const capsWarningLogin = document.getElementById('caps-warning-login');

  // Password strength
  const regStrengthBar = document.getElementById('register-strength-bar');
  const regStrengthFill = document.getElementById('register-strength-fill');
  const regStrengthLabel = document.getElementById('register-strength-label');
  const regStrengthText = document.getElementById('register-strength-text');

  // Modal Forgot Password
  const openForgotModal = document.getElementById('link-forgot-password');
  const modalForgot = document.getElementById('modal-forgot-password');
  const closeForgotModal = document.getElementById('btn-close-modal');
  const formForgot = document.getElementById('form-forgot-password');

  // Demo auto-fill
  const btnDemoFill = document.getElementById('btn-demo-fill');

  // Toast container
  const toastContainer = document.getElementById('toast-container');

  /* ==========================================================================
     Sistema de Notificaciones Toast
     ========================================================================== */
  function showToast(type = 'info', title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  }

  /* ==========================================================================
     Pestañas (Tabs) Iniciar Sesión / Registrarse
     ========================================================================== */
  function switchTab(target) {
    if (target === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.style.display = 'block';
      formRegister.style.display = 'none';
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.style.display = 'block';
      formLogin.style.display = 'none';
    }
  }

  tabLogin?.addEventListener('click', () => switchTab('login'));
  tabRegister?.addEventListener('click', () => switchTab('register'));

  /* ==========================================================================
     Toggle Show/Hide Password
     ========================================================================== */
  function setupPasswordToggle(button, input) {
    if (!button || !input) return;
    button.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Cambiar icono
      button.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  }

  setupPasswordToggle(toggleLoginPass, loginPassInput);
  setupPasswordToggle(toggleRegPass, regPassInput);

  /* ==========================================================================
     Detector de Bloq Mayús (Caps Lock)
     ========================================================================== */
  loginPassInput?.addEventListener('keyup', (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      capsWarningLogin.style.display = 'block';
    } else {
      capsWarningLogin.style.display = 'none';
    }
  });

  /* ==========================================================================
     Medidor de Fuerza de Contraseña (Registro)
     ========================================================================== */
  regPassInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    if (!val) {
      regStrengthBar.style.display = 'none';
      regStrengthLabel.style.display = 'none';
      return;
    }

    regStrengthBar.style.display = 'block';
    regStrengthLabel.style.display = 'flex';

    const strength = window.authService.checkPasswordStrength(val);
    regStrengthFill.style.width = strength.percent + '%';
    regStrengthFill.style.backgroundColor = strength.color;
    regStrengthText.textContent = strength.label;
    regStrengthText.style.color = strength.color;
  });

  /* ==========================================================================
     Auto-Llenado de Datos Demo
     ========================================================================== */
  btnDemoFill?.addEventListener('click', () => {
    document.getElementById('login-email').value = 'colegiado.ts@trabajosocial.org';
    document.getElementById('login-password').value = 'Vocacion2026!';
    document.getElementById('login-remember').checked = true;
    showToast('info', 'Credenciales Demo Cargadas', 'Haz clic en "Iniciar Sesión" para entrar.');
  });

  /* ==========================================================================
     Login con Correo y Contraseña
     ========================================================================== */
  formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember').checked;
    const submitBtn = document.getElementById('btn-submit-login');

    // Reset de errores
    document.querySelectorAll('.form-group').forEach((g) => g.classList.remove('has-error'));

    let hasError = false;
    if (!window.authService.validateEmail(email)) {
      document.getElementById('group-login-email').classList.add('has-error');
      hasError = true;
    }
    if (!password) {
      document.getElementById('group-login-password').classList.add('has-error');
      hasError = true;
    }

    if (hasError) return;

    try {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      const user = await window.authService.loginWithEmail(email, password, remember);
      showToast('success', '¡Acceso Correcto!', `Bienvenido(a) a la red, ${user.name}.`);

      renderSuccessView(user);
    } catch (err) {
      showToast('error', 'Error al Iniciar Sesión', err.message || 'Verifica tus credenciales.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  /* ==========================================================================
     Registro de Nuevo Profesional
     ========================================================================== */
  formRegister?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const license = document.getElementById('register-license').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const submitBtn = document.getElementById('btn-submit-register');

    if (!name || !email || !password) {
      showToast('error', 'Campos incompletos', 'Por favor llena todos los campos obligatorios.');
      return;
    }

    try {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      const newUser = await window.authService.registerUser({ name, license, email, password });
      showToast('success', 'Cuenta Creada Exitosamente', `Bienvenido al Networking de Trabajadores Sociales, ${newUser.name}.`);

      renderSuccessView(newUser);
    } catch (err) {
      showToast('error', 'Error en el Registro', err.message);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  /* ==========================================================================
     Inicio de Sesión con Google
     ========================================================================== */
  async function handleGoogleLogin(buttonElement) {
    try {
      buttonElement.style.opacity = '0.7';
      buttonElement.style.pointerEvents = 'none';

      const user = await window.authService.loginWithGoogle();
      showToast('success', 'Autenticado con Google', `Sesión iniciada con éxito como ${user.name}`);

      renderSuccessView(user);
    } catch (err) {
      showToast('error', 'Error con Google', 'No se pudo completar el inicio con Google.');
    } finally {
      buttonElement.style.opacity = '1';
      buttonElement.style.pointerEvents = 'auto';
    }
  }

  btnGoogleLogin?.addEventListener('click', () => handleGoogleLogin(btnGoogleLogin));
  btnGoogleRegister?.addEventListener('click', () => handleGoogleLogin(btnGoogleRegister));

  /* ==========================================================================
     Modal de Recuperación de Contraseña
     ========================================================================== */
  openForgotModal?.addEventListener('click', (e) => {
    e.preventDefault();
    modalForgot.classList.add('open');
  });

  closeForgotModal?.addEventListener('click', () => {
    modalForgot.classList.remove('open');
  });

  modalForgot?.addEventListener('click', (e) => {
    if (e.target === modalForgot) modalForgot.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalForgot.classList.contains('open')) {
      modalForgot.classList.remove('open');
    }
  });

  formForgot?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const btnForgot = document.getElementById('btn-submit-forgot');

    try {
      btnForgot.classList.add('loading');
      btnForgot.disabled = true;

      const res = await window.authService.requestPasswordReset(email);
      showToast('success', 'Enlace Enviado', res.message);
      modalForgot.classList.remove('open');
      document.getElementById('forgot-email').value = '';
    } catch (err) {
      showToast('error', 'Error', err.message);
    } finally {
      btnForgot.classList.remove('loading');
      btnForgot.disabled = false;
    }
  });

  /* ==========================================================================
     Vista de Éxito / Dashboard Preview
     ========================================================================== */
  function renderSuccessView(user) {
    const formCol = document.querySelector('.form-column');
    formCol.innerHTML = `
      <div style="text-align: center; animation: fadeInContainer 0.6s ease; max-width: 440px; margin: auto;">
        <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; border-radius: 50%; overflow: hidden; border: 3px solid #06b6d4; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);">
          <img src="${user.avatar}" alt="${user.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: #ecfdf5; color: #059669; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.75rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ${user.networkStatus}
        </div>

        <h2 style="font-size: 1.85rem; font-weight: 800; color: #0a1128; margin-bottom: 0.4rem;">¡Hola, ${user.name}!</h2>
        <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 2rem;">Acceso concedido al <strong>Networking de Trabajadores Sociales</strong>. Tu entorno ético y protegido está listo.</p>

        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 1.25rem; text-align: left; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
            <span style="font-size: 0.8rem; color: #64748b;">Rol asignado:</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: #0a1128;">${user.role}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
            <span style="font-size: 0.8rem; color: #64748b;">Método de acceso:</span>
            <span style="font-size: 0.85rem; font-weight: 600; color: #0284c7; text-transform: capitalize;">${user.loginProvider}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 0.8rem; color: #64748b;">Correo activo:</span>
            <span style="font-size: 0.85rem; font-weight: 600; color: #0f172a;">${user.email}</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button id="btn-demo-logout" class="btn-submit" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; box-shadow: none;">
            Cerrar Sesión
          </button>
          <button class="btn-submit" onclick="alert('Redirigiendo al Feed Principal y Banco de Casos de Trabajadores Sociales...')">
            Entrar a la Red
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-demo-logout')?.addEventListener('click', () => {
      window.authService.logout();
      window.location.reload();
    });
  }

  // Si ya hay sesión guardada al abrir la página
  if (window.authService.currentUser) {
    renderSuccessView(window.authService.currentUser);
  }
});
