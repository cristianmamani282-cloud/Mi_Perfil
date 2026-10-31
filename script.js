/**
 * ==========================================================================
 * GUÍA CONCEPTUAL Y PRÁCTICA DEL DOM - DISEÑO WEB II (UPDS 2026)
 * Ing. Miguel Angel Cruz Ramos
 * 
 * Implementación de los 4 Ejemplos del DOM con validaciones avanzadas:
 * 1. Modo Oscuro / Modo Claro Dinámico
 * 2. Filtrado de Juegos
 * 3. Menú Desplegable Hamburguesa
 * 4. Validación Dinámica de Formulario con detección de tipo de dato
 * ==========================================================================
 */

// ==========================================================================
// EJEMPLO 1: Modo Oscuro / Modo Claro Dinámico (Dark Mode)
// Concepto: JavaScript escucha el clic y altera la clase en el <body>.
// ==========================================================================
const themeBtn = document.getElementById('themeBtn');
const bodyElement = document.body;

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    bodyElement.classList.toggle('light-mode');
    bodyElement.classList.toggle('dark-mode');

    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    if (bodyElement.classList.contains('light-mode')) {
      if (themeIcon) themeIcon.className = 'bi bi-sun-fill';
      if (themeText) themeText.textContent = 'Modo Claro';
    } else {
      if (themeIcon) themeIcon.className = 'bi bi-moon-stars-fill';
      if (themeText) themeText.textContent = 'Modo Oscuro';
    }
  });
}

// ==========================================================================
// EJEMPLO 2: Filtrado de Favoritos / Juegos
// Concepto: El DOM evalúa data-categoria y manipula style.display
// ==========================================================================
function filtrar(categoria) {
  // 1. Seleccionamos todas las filas de la tabla de juegos
  const filas = document.querySelectorAll('.game-row');

  // 2. Recorremos cada fila para verificar su atributo data-categoria
  filas.forEach(fila => {
    const catFila = fila.dataset.categoria;
    // 3. Manipulamos la propiedad style.display directamente en el DOM
    if (categoria === 'todos' || catFila === categoria) {
      fila.style.display = 'table-row';
      fila.classList.remove('d-none');
    } else {
      fila.style.display = 'none';
      fila.classList.add('d-none');
    }
  });

  // Actualizamos el botón de filtro activo
  const botones = document.querySelectorAll('.btn-filter');
  botones.forEach(btn => {
    if (btn.dataset.filter === categoria) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
window.filtrar = filtrar;

// ==========================================================================
// EJEMPLO 3: Menú Desplegable Hamburguesa (Responsive Navbar)
// Concepto: En móviles, al presionar el botón se alterna la clase show
// ==========================================================================
const burguerBtn = document.getElementById('burguerBtn');
const navMenu = document.getElementById('navMenu');

if (burguerBtn && navMenu) {
  burguerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });
}

// ==========================================================================
// EJEMPLO 4: Validación Dinámica de Formulario (Casillas Completas)
// Reglas:
// - Nombre: Solo letras y espacios. Mensaje específico si falta o ingresa números/caracteres.
// - Teléfono: Desplegable de código + solo números. Mensaje si falta o ingresa letras.
// - Mensaje: Obligatorio. Mensaje si falta.
// - No se puede enviar si falta alguna casilla.
// ==========================================================================
const form = document.getElementById('contactForm');
const nombreInput = document.getElementById('nombre');
const telefonoInput = document.getElementById('telefono');
const mensajeInput = document.getElementById('mensaje');
const alertaBox = document.getElementById('alertaBox');

const errorNombre = document.getElementById('errorNombre');
const errorTelefono = document.getElementById('errorTelefono');
const errorMensaje = document.getElementById('errorMensaje');

// Patrones de validación
const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const regexSoloNumeros = /^[0-9]+$/;

// Validación en tiempo real para Nombre (solo letras)
if (nombreInput) {
  nombreInput.addEventListener('input', () => {
    const val = nombreInput.value;
    if (val.length > 0 && /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(val)) {
      if (errorNombre) {
        errorNombre.textContent = '⚠️ Acá solo van letras (sin números ni caracteres especiales).';
      }
      nombreInput.classList.add('is-invalid-custom');
      // Filtra caracteres no válidos
      nombreInput.value = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    } else {
      if (errorNombre) errorNombre.textContent = '';
      nombreInput.classList.remove('is-invalid-custom');
    }
  });
}

// Validación en tiempo real para Teléfono (solo números)
if (telefonoInput) {
  telefonoInput.addEventListener('input', () => {
    const val = telefonoInput.value;
    if (val.length > 0 && /[^0-9]/.test(val)) {
      if (errorTelefono) {
        errorTelefono.textContent = '⚠️ Acá solo van números (sin letras ni caracteres especiales).';
      }
      telefonoInput.classList.add('is-invalid-custom');
      // Filtra caracteres no numéricos
      telefonoInput.value = val.replace(/[^0-9]/g, '');
    } else {
      if (errorTelefono) errorTelefono.textContent = '';
      telefonoInput.classList.remove('is-invalid-custom');
    }
  });
}

// Validación en tiempo real para Mensaje
if (mensajeInput) {
  mensajeInput.addEventListener('input', () => {
    if (mensajeInput.value.trim().length > 0) {
      if (errorMensaje) errorMensaje.textContent = '';
      mensajeInput.classList.remove('is-invalid-custom');
    }
  });
}

// Validación final al Enviar Formulario
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Detiene el envío automático

    let formularioValido = true;

    // 1. Validar Nombre
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

    // 2. Validar Teléfono
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

    // 3. Validar Mensaje
    const mensajeVal = mensajeInput ? mensajeInput.value.trim() : '';
    if (mensajeVal === '') {
      if (errorMensaje) errorMensaje.textContent = '⚠️ Esta casilla es obligatoria. Por favor escribe un mensaje.';
      if (mensajeInput) mensajeInput.classList.add('is-invalid-custom');
      formularioValido = false;
    } else {
      if (errorMensaje) errorMensaje.textContent = '';
      if (mensajeInput) mensajeInput.classList.remove('is-invalid-custom');
    }

    // Respuesta en alertaBox del DOM
    if (!formularioValido) {
      if (alertaBox) {
        alertaBox.innerHTML = '<p class="msg-error">⚠️ Por favor completa correctamente todas las casillas requeridas.</p>';
      }
    } else {
      const codigoPais = document.getElementById('codigoPais') ? document.getElementById('codigoPais').value : '';
      if (alertaBox) {
        alertaBox.innerHTML = `<p class="msg-exito">✅ ¡Formulario enviado con éxito! Gracias por tu mensaje, ${nombreVal}. Te contactaremos al ${codigoPais} ${telefonoVal}.</p>`;
      }
      // Limpiar campos
      if (nombreInput) nombreInput.value = '';
      if (telefonoInput) telefonoInput.value = '';
      if (mensajeInput) mensajeInput.value = '';
    }
  });
}
