/**
 * ASIO - Spa Asiático & Bienestar (Versión 2 - C3-A1 Oficial)
 * Arquitectura Segura: Sanitización contra XSS (.textContent),
 * Delegación de eventos (.off/.on pattern) para prevenir Memory Leaks y Bubbling,
 * Soporte PWA y rendimiento optimizado.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. UTILIDADES DE SEGURIDAD DOM (SANITIZACIÓN CONTRA XSS)
  // ==========================================================================
  function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    });
  }

  // ==========================================================================
  // 2. SISTEMA DE DESPLIEGUE DE VISTAS (SPA CERO SCROLL)
  // ==========================================================================
  const viewPanels = document.querySelectorAll('.spa-view-panel');
  const viewTabButtons = document.querySelectorAll('.view-btn-tab');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function switchView(targetViewName) {
    if (!targetViewName) return;

    // Desactivar todos los paneles
    viewPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Activar panel correspondiente
    const activePanel = document.getElementById(`view-${targetViewName}`);
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.scrollTop = 0;
    }

    // Actualizar botones de navegación desktop
    viewTabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.targetView === targetViewName);
    });

    // Actualizar barra de tabs inferior para celulares
    mobileNavItems.forEach(item => {
      item.classList.toggle('active', item.dataset.targetView === targetViewName);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Delegación de eventos de navegación (Previene duplicación de listeners)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.view-trigger-btn, .view-btn-tab, .mobile-nav-item');
    if (trigger && trigger.dataset.targetView) {
      e.preventDefault();
      switchView(trigger.dataset.targetView);
    }
  });

  // ==========================================================================
  // 3. ESTADO DE LA RESERVA
  // ==========================================================================
  const bookingState = {
    step: 1,
    experience: {
      id: 'masaje-relajante',
      name: 'Masaje Relajante',
      duration: '60 min',
      price: 40,
      image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=400&q=80'
    },
    specialist: {
      id: 'mei-lin',
      name: 'Mei Lin',
      role: 'Masajes'
    },
    date: {
      day: 19,
      month: 3, // 0-indexed: 3 = Abril
      year: 2025,
      dateString: 'Sábado, 19 de Abril 2025'
    },
    timeSlot: '10:00'
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Elementos del formulario y calendario
  const calendarDaysContainer = document.getElementById('calendarDaysGrid');
  const calendarMonthTitle = document.getElementById('calendarMonthTitle');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const continueBookingBtn = document.getElementById('continueBookingBtn');
  const stepperItems = document.querySelectorAll('.step-item');

  // ==========================================================================
  // 4. DELEGACIÓN DE EVENTOS: EXPERIENCIAS & ESPECIALISTAS
  // ==========================================================================
  const experienceContainer = document.querySelector('.experience-selection-grid');
  if (experienceContainer) {
    experienceContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.experience-select-item');
      if (!item) return;

      document.querySelectorAll('.experience-select-item').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');

      bookingState.experience = {
        id: item.dataset.id,
        name: item.dataset.name,
        duration: item.dataset.duration,
        price: parseFloat(item.dataset.price),
        image: item.querySelector('img')?.src || ''
      };

      updateStepper(1);
      showToast(`Experiencia: ${bookingState.experience.name}`);
    });
  }

  // Delegación para botones "Reservar ahora" de la vista Experiencias
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.deploy-reserve-btn');
    if (!btn) return;

    const targetId = btn.dataset.targetId;
    const matchingExpItem = document.querySelector(`.experience-select-item[data-id="${targetId}"]`);
    if (matchingExpItem) {
      matchingExpItem.click();
    }
    switchView('reserva');
  });

  // Delegación para selección de Especialista
  const specialistContainer = document.querySelector('.specialists-list-compact');
  if (specialistContainer) {
    specialistContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.specialist-card');
      if (!card) return;

      document.querySelectorAll('.specialist-card').forEach(el => el.classList.remove('selected'));
      card.classList.add('selected');

      bookingState.specialist = {
        id: card.dataset.id,
        name: card.dataset.name,
        role: card.dataset.role
      };

      updateStepper(2);
      showToast(`Especialista: ${bookingState.specialist.name}`);
    });
  }

  // ==========================================================================
  // 5. CALENDARIO INTERACTIVO (ABRIL 2025 - DÍA 19 PRESELECCIONADO)
  // ==========================================================================
  let currentViewingYear = 2025;
  let currentViewingMonth = 3; // Abril

  function renderCalendar(year, month) {
    if (!calendarDaysContainer || !calendarMonthTitle) return;

    calendarMonthTitle.textContent = `${monthNames[month]} ${year}`;
    calendarDaysContainer.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const startingOffset = (firstDay + 6) % 7; // Lunes inicio
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Días vacíos
    for (let i = 0; i < startingOffset; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day-cell disabled';
      calendarDaysContainer.appendChild(emptyCell);
    }

    // Días del mes usando createElement y textContent (Seguro contra XSS)
    for (let d = 1; d <= daysInMonth; d++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'cal-day-cell';
      dayCell.textContent = String(d);
      dayCell.dataset.day = String(d);

      if (d === bookingState.date.day && month === bookingState.date.month && year === bookingState.date.year) {
        dayCell.classList.add('selected');
      }

      calendarDaysContainer.appendChild(dayCell);
    }
  }

  // Delegación de eventos para el calendario (Evita N event listeners)
  if (calendarDaysContainer) {
    calendarDaysContainer.addEventListener('click', (e) => {
      const cell = e.target.closest('.cal-day-cell:not(.disabled)');
      if (!cell || !cell.dataset.day) return;

      document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');

      const d = parseInt(cell.dataset.day, 10);
      bookingState.date.day = d;
      bookingState.date.month = currentViewingMonth;
      bookingState.date.year = currentViewingYear;

      const dateObj = new Date(currentViewingYear, currentViewingMonth, d);
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      bookingState.date.dateString = `${dayNames[dateObj.getDay()]}, ${d} de ${monthNames[currentViewingMonth]} ${currentViewingYear}`;

      updateStepper(3);
      showToast(`Fecha: ${bookingState.date.dateString}`);
    });
  }

  renderCalendar(currentViewingYear, currentViewingMonth);

  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentViewingMonth--;
      if (currentViewingMonth < 0) {
        currentViewingMonth = 11;
        currentViewingYear--;
      }
      renderCalendar(currentViewingYear, currentViewingMonth);
    });

    nextMonthBtn.addEventListener('click', () => {
      currentViewingMonth++;
      if (currentViewingMonth > 11) {
        currentViewingMonth = 0;
        currentViewingYear++;
      }
      renderCalendar(currentViewingYear, currentViewingMonth);
    });
  }

  // Delegación para Horarios Disponibles
  const timeSlotsContainer = document.querySelector('.time-slots-grid-compact');
  if (timeSlotsContainer) {
    timeSlotsContainer.addEventListener('click', (e) => {
      const slot = e.target.closest('.time-slot-pill');
      if (!slot) return;

      document.querySelectorAll('.time-slot-pill').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      bookingState.timeSlot = slot.dataset.time || slot.textContent.trim();

      updateStepper(3);
      showToast(`Hora: ${bookingState.timeSlot} hrs`);
    });
  }

  // ==========================================================================
  // 6. CONTROL DEL STEPPER & BOTÓN CONTINUAR
  // ==========================================================================
  function updateStepper(stepNumber) {
    bookingState.step = Math.max(bookingState.step, stepNumber);
    stepperItems.forEach((stepEl, idx) => {
      const stepIdx = idx + 1;
      stepEl.classList.toggle('active', stepIdx === bookingState.step);
    });
  }

  stepperItems.forEach((stepEl, idx) => {
    stepEl.addEventListener('click', () => {
      updateStepper(idx + 1);
    });
  });

  if (continueBookingBtn) {
    continueBookingBtn.addEventListener('click', () => {
      openBookingConfirmationModal();
    });
  }

  // ==========================================================================
  // 7. MODALES DE CONFIRMACIÓN CON SANITIZACIÓN ESTRICTA
  // ==========================================================================
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const confirmBookingForm = document.getElementById('confirmBookingForm');

  function openBookingConfirmationModal() {
    if (!bookingModal) return;

    // Asignación segura con textContent para prevenir XSS
    document.getElementById('summaryExpName').textContent = bookingState.experience.name;
    document.getElementById('summaryDuration').textContent = bookingState.experience.duration;
    document.getElementById('summaryPrice').textContent = `$${bookingState.experience.price} USD`;
    document.getElementById('summarySpecialist').textContent = `${bookingState.specialist.name} (${bookingState.specialist.role})`;
    document.getElementById('summaryDateTime').textContent = `${bookingState.date.dateString} - ${bookingState.timeSlot} hrs`;

    bookingModal.classList.add('active');
  }

  function closeBookingConfirmationModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingConfirmationModal);

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingConfirmationModal();
    });
  }

  if (confirmBookingForm) {
    confirmBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rawName = document.getElementById('clientName').value.trim();
      const rawPhone = document.getElementById('clientPhone').value.trim();
      const clientName = sanitizeString(rawName) || 'Estimado(a) Cliente';
      const clientPhone = sanitizeString(rawPhone) || 'S/N';
      const bookingCode = `ASIO-${Math.floor(10000 + Math.random() * 90000)}`;

      closeBookingConfirmationModal();

      // Guardado local seguro
      const reservation = {
        code: bookingCode,
        clientName,
        phone: clientPhone,
        experience: bookingState.experience,
        specialist: bookingState.specialist,
        dateTime: `${bookingState.date.dateString} - ${bookingState.timeSlot} hrs`,
        status: 'Confirmada',
        createdAt: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('asio_spa_reservations') || '[]');
        stored.unshift(reservation);
        localStorage.setItem('asio_spa_reservations', JSON.stringify(stored));
      } catch (err) {
        console.warn('Almacenamiento local:', err);
      }

      // Modal de éxito con textContent seguro
      const successModal = document.getElementById('successModal');
      if (successModal) {
        document.getElementById('successClientName').textContent = clientName;
        document.getElementById('successBookingCode').textContent = bookingCode;
        document.getElementById('successDetails').textContent = `${bookingState.experience.name} con ${bookingState.specialist.name} para el ${bookingState.date.dateString} a las ${bookingState.timeSlot} hrs.`;
        successModal.classList.add('active');
      }

      showToast('¡Cita agendada con éxito!');
    });
  }

  const successCloseBtn = document.getElementById('successCloseBtn');
  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', () => {
      const successModal = document.getElementById('successModal');
      if (successModal) successModal.classList.remove('active');
    });
  }

  // ==========================================================================
  // 8. BÚSQUEDA RÁPIDA (CONSTRUCCIÓN SEGURA DEL DOM - CERO XSS)
  // ==========================================================================
  const searchToggleBtn = document.getElementById('searchToggleBtn');
  const searchModal = document.getElementById('searchModal');
  const searchModalClose = document.getElementById('searchModalClose');
  const searchInput = document.getElementById('siteSearchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');

  const searchableServices = [
    { title: 'Masaje Relajante', desc: 'Libera el estrés y conecta con tu tranquilidad.', price: '$40', targetId: 'masaje-relajante' },
    { title: 'Facial Asiático', desc: 'Limpieza profunda y rejuvenecimiento natural con técnicas ancestrales.', price: '$45', targetId: 'facial-asiatico' },
    { title: 'Ritual Zen', desc: 'Armoniza cuerpo, mente y espíritu con cuencos e incienso.', price: '$60', targetId: 'ritual-zen' },
    { title: 'Aromaterapia', desc: 'Equilibrio a través de aceites esenciales y orquídeas aromáticas.', price: '$40', targetId: 'aromaterapia' }
  ];

  if (searchToggleBtn && searchModal) {
    searchToggleBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 150);
        renderSearchResults('');
      }
    });

    if (searchModalClose) {
      searchModalClose.addEventListener('click', () => searchModal.classList.remove('active'));
    }

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('active');
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderSearchResults(e.target.value.trim().toLowerCase());
      });
    }
  }

  function renderSearchResults(query) {
    if (!searchResultsContainer) return;
    searchResultsContainer.innerHTML = '';

    const filtered = searchableServices.filter(s =>
      s.title.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      const emptyP = document.createElement('p');
      emptyP.style.cssText = 'text-align:center; padding:1rem; color:var(--text-muted); font-size: 0.8rem;';
      emptyP.textContent = 'No se encontraron resultados.';
      searchResultsContainer.appendChild(emptyP);
      return;
    }

    filtered.forEach(item => {
      const row = document.createElement('div');
      row.className = 'summary-row';
      row.style.cssText = 'padding: 0.65rem; border-radius: 8px; background: var(--bg-card-subtle); margin-bottom: 0.4rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; min-height: 44px;';
      
      const textWrap = document.createElement('div');
      const titleEl = document.createElement('div');
      titleEl.style.cssText = 'font-weight:700; color:var(--text-primary); font-size: 0.84rem;';
      titleEl.textContent = item.title; // Sanitizado con textContent

      const descEl = document.createElement('div');
      descEl.style.cssText = 'font-size: 0.74rem; color:var(--text-muted);';
      descEl.textContent = item.desc; // Sanitizado con textContent

      textWrap.appendChild(titleEl);
      textWrap.appendChild(descEl);

      const priceEl = document.createElement('div');
      priceEl.style.cssText = 'font-weight:700; color:var(--primary-purple); white-space:nowrap; margin-left: 0.6rem;';
      priceEl.textContent = item.price;

      row.appendChild(textWrap);
      row.appendChild(priceEl);

      row.addEventListener('click', () => {
        if (searchModal) searchModal.classList.remove('active');
        const matchingExp = document.querySelector(`.experience-select-item[data-id="${item.targetId}"]`);
        if (matchingExp) matchingExp.click();
        switchView('reserva');
      });

      searchResultsContainer.appendChild(row);
    });
  }

  // ==========================================================================
  // 9. TOAST NOTIFICACIONES
  // ==========================================================================
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  // ==========================================================================
  // 10. GESTIÓN DE INSTALACIÓN PWA (CUMPLE CON CRITERIO 1)
  // ==========================================================================
  let deferredInstallPrompt = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Registro relativo para compatibilidad total con subcarpetas en GitHub Pages
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA v2] Service Worker activo en:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA v2] Service Worker:', err);
        });
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  function triggerPWAInstall() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          showToast('¡Gracias por instalar ASIO Spa!');
        }
        deferredInstallPrompt = null;
      });
    } else {
      const guideModal = document.getElementById('pwaGuideModal');
      if (guideModal) guideModal.classList.add('active');
    }
  }

  document.querySelectorAll('.trigger-pwa-install').forEach(btn => {
    btn.addEventListener('click', triggerPWAInstall);
  });

  const pwaGuideCloseBtn = document.getElementById('pwaGuideCloseBtn');
  if (pwaGuideCloseBtn) {
    pwaGuideCloseBtn.addEventListener('click', () => {
      const guideModal = document.getElementById('pwaGuideModal');
      if (guideModal) guideModal.classList.remove('active');
    });
  }

  window.addEventListener('appinstalled', () => {
    showToast('¡ASIO Spa ahora está instalada en tu celular!');
  });
});
