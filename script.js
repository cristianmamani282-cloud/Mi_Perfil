const themeBtn = document.getElementById('themeBtn');
const bodyElement = document.body;
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isLight = bodyElement.classList.toggle('light-mode');
    bodyElement.classList.toggle('dark-mode', !isLight);
    if (themeIcon) {
      themeIcon.className = isLight ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
    if (themeText) {
      themeText.textContent = isLight ? 'Modo Claro' : 'Modo Oscuro';
    }
  });
}

function filtrar(categoria) {
  const filas = document.querySelectorAll('.game-row');
  filas.forEach(fila => {
    const match = categoria === 'todos' || fila.dataset.categoria === categoria;
    fila.style.display = match ? 'table-row' : 'none';
    fila.classList.toggle('d-none', !match);
  });

  const botones = document.querySelectorAll('.btn-filter');
  botones.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === categoria);
  });
}
window.filtrar = filtrar;

const burguerBtn = document.getElementById('burguerBtn');
const navMenu = document.getElementById('navMenu');

if (burguerBtn && navMenu) {
  burguerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });

  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
    });
  });
}

const form = document.getElementById('contactForm');
const nombreInput = document.getElementById('nombre');
const telefonoInput = document.getElementById('telefono');
const mensajeInput = document.getElementById('mensaje');
const alertaBox = document.getElementById('alertaBox');
const codigoPaisSelect = document.getElementById('codigoPais');

const errorNombre = document.getElementById('errorNombre');
const errorTelefono = document.getElementById('errorTelefono');
const errorMensaje = document.getElementById('errorMensaje');

const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const regexSoloNumeros = /^[0-9]+$/;

if (nombreInput) {
  nombreInput.addEventListener('input', () => {
    const val = nombreInput.value;
    if (val.length > 0 && /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(val)) {
      if (errorNombre) errorNombre.textContent = '⚠️ Acá solo van letras (sin números ni caracteres especiales).';
      nombreInput.classList.add('is-invalid-custom');
      nombreInput.value = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    } else {
      if (errorNombre) errorNombre.textContent = '';
      nombreInput.classList.remove('is-invalid-custom');
    }
  });
}

if (telefonoInput) {
  telefonoInput.addEventListener('input', () => {
    const val = telefonoInput.value;
    if (val.length > 0 && /[^0-9]/.test(val)) {
      if (errorTelefono) errorTelefono.textContent = '⚠️ Acá solo van números (sin letras ni caracteres especiales).';
      telefonoInput.classList.add('is-invalid-custom');
      telefonoInput.value = val.replace(/[^0-9]/g, '');
    } else {
      if (errorTelefono) errorTelefono.textContent = '';
      telefonoInput.classList.remove('is-invalid-custom');
    }
  });
}

if (mensajeInput) {
  mensajeInput.addEventListener('input', () => {
    if (mensajeInput.value.trim().length > 0) {
      if (errorMensaje) errorMensaje.textContent = '';
      mensajeInput.classList.remove('is-invalid-custom');
    }
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let formularioValido = true;

    const nombreVal = nombreInput ? nombreInput.value.trim() : '';
    if (nombreVal === '') {
      if (errorNombre) errorNombre.textContent = '⚠️ Esta casilla es obligatoria. Por favor ingresa tu nombre.';
      if (nombreInput) nombreInput.classList.add('is-invalid-custom');
      formularioValido = false;
    } else if (!regexSoloLetras.test(nombreVal)) {
      if (errorNombre) errorNombre.textContent = '⚠️ Acá solo van letras (sin números ni caracteres especiales).';
      if (nombreInput) nombreInput.classList.add('is-invalid-custom');
      formularioValido = false;
    } else {
      if (errorNombre) errorNombre.textContent = '';
      if (nombreInput) nombreInput.classList.remove('is-invalid-custom');
    }

    const telefonoVal = telefonoInput ? telefonoInput.value.trim() : '';
    if (telefonoVal === '') {
      if (errorTelefono) errorTelefono.textContent = '⚠️ Esta casilla es obligatoria. Por favor ingresa tu número.';
      if (telefonoInput) telefonoInput.classList.add('is-invalid-custom');
      formularioValido = false;
    } else if (!regexSoloNumeros.test(telefonoVal)) {
      if (errorTelefono) errorTelefono.textContent = '⚠️ Acá solo van números (sin letras ni caracteres).';
      if (telefonoInput) telefonoInput.classList.add('is-invalid-custom');
      formularioValido = false;
    } else {
      if (errorTelefono) errorTelefono.textContent = '';
      if (telefonoInput) telefonoInput.classList.remove('is-invalid-custom');
    }

    const mensajeVal = mensajeInput ? mensajeInput.value.trim() : '';
    if (mensajeVal === '') {
      if (errorMensaje) errorMensaje.textContent = '⚠️ Esta casilla es obligatoria. Por favor escribe un mensaje.';
      if (mensajeInput) mensajeInput.classList.add('is-invalid-custom');
      formularioValido = false;
    } else {
      if (errorMensaje) errorMensaje.textContent = '';
      if (mensajeInput) mensajeInput.classList.remove('is-invalid-custom');
    }

    if (!formularioValido) {
      if (alertaBox) {
        alertaBox.innerHTML = '<p class="msg-error">⚠️ Por favor completa correctamente todas las casillas requeridas.</p>';
      }
    } else {
      const codigoPais = codigoPaisSelect ? codigoPaisSelect.value : '';
      if (alertaBox) {
        alertaBox.innerHTML = `<p class="msg-exito">✅ ¡Formulario enviado con éxito! Gracias por tu mensaje, ${nombreVal}. Te contactaremos al ${codigoPais} ${telefonoVal}.</p>`;
      }
      if (nombreInput) nombreInput.value = '';
      if (telefonoInput) telefonoInput.value = '';
      if (mensajeInput) mensajeInput.value = '';
    }
  });
}
