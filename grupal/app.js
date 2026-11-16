/**
 * ASIO - Spa Asiático & Bienestar
 * Lógica interactiva adaptada para Escritorio y Celulares (PWA):
 * Enrutador de vistas desplegables sincronizado con la barra móvil inferior,
 * Motor de reservas, búsqueda rápida y gestión de instalación PWA.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. SISTEMA DE DESPLIEGUE DE VISTAS (SINCRONIZADO DESKTOP & CELULAR)
  // ==========================================================================
  const viewPanels = document.querySelectorAll('.spa-view-panel');
  const viewTabButtons = document.querySelectorAll('.view-btn-tab');
  const allViewTriggers = document.querySelectorAll('.view-trigger-btn');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function switchView(targetViewName) {
    if (!targetViewName) return;

    // Desactivar todos los paneles
    viewPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Activar panel seleccionado
    const activePanel = document.getElementById(`view-${targetViewName}`);
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.scrollTop = 0;
    }

    // Actualizar botones de navegación desktop
    viewTabButtons.forEach(btn => {
      if (btn.dataset.targetView === targetViewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Actualizar barra de tabs inferior para celulares
    mobileNavItems.forEach(item => {
      if (item.dataset.targetView === targetViewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Resetear posición de scroll global
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Eventos navegación Desktop
  viewTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.targetView);
    });
  });

  // Eventos navegación Móvil (Barra de tabs inferior PWA)
  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.targetView);
    });
  });

  // Eventos botones de acción internos
  allViewTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = btn.dataset.targetView;
      if (targetView) {
        switchView(targetView);
      }
    });
  });

  // ==========================================================================
  // 2. ESTADO DE LA RESERVA (BOOKING ENGINE)
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

  const experienceItems = document.querySelectorAll('.experience-select-item');
  const specialistItems = document.querySelectorAll('.specialist-card');
  const timeSlotItems = document.querySelectorAll('.time-slot-pill');
  const calendarDaysContainer = document.getElementById('calendarDaysGrid');
  const calendarMonthTitle = document.getElementById('calendarMonthTitle');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const continueBookingBtn = document.getElementById('continueBookingBtn');
  const stepperItems = document.querySelectorAll('.step-item');

  // ==========================================================================
  // 3. SELECCIÓN DE EXPERIENCIAS
  // ==========================================================================
  experienceItems.forEach((item) => {
    item.addEventListener('click', () => {
      experienceItems.forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');

      bookingState.experience = {
        id: item.dataset.id,
        name: item.dataset.name,
        duration: item.dataset.duration,
        price: parseFloat(item.dataset.price),
        image: item.querySelector('img').src
      };

      updateStepper(1);
      showToast(`Experiencia: ${bookingState.experience.name}`);
    });
  });

  const deployReserveBtns = document.querySelectorAll('.deploy-reserve-btn');
  deployReserveBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.targetId;
      const matchingExpItem = document.querySelector(`.experience-select-item[data-id="${targetId}"]`);
      
      if (matchingExpItem) {
        matchingExpItem.click();
      }

      switchView('reserva');
    });
  });

  // ==========================================================================
  // 4. SELECCIÓN DE ESPECIALISTAS
  // ==========================================================================
  specialistItems.forEach((item) => {
    item.addEventListener('click', () => {
      specialistItems.forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');

      bookingState.specialist = {
        id: item.dataset.id,
        name: item.dataset.name,
        role: item.dataset.role
      };

      updateStepper(2);
      showToast(`Especialista: ${bookingState.specialist.name}`);
    });
  });

  // ==========================================================================
  // 5. CALENDARIO INTERACTIVO (ABRIL 2025, DÍA 19 PRESELECCIONADO)
  // ==========================================================================
  let currentViewingYear = 2025;
  let currentViewingMonth = 3; // Abril

  function renderCalendar(year, month) {
    if (!calendarDaysContainer || !calendarMonthTitle) return;

    calendarMonthTitle.textContent = `${monthNames[month]} ${year}`;
    calendarDaysContainer.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const startingOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startingOffset; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day-cell disabled';
      calendarDaysContainer.appendChild(emptyCell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'cal-day-cell';
      dayCell.textContent = d;

      if (d === bookingState.date.day && month === bookingState.date.month && year === bookingState.date.year) {
        dayCell.classList.add('selected');
      }

      dayCell.addEventListener('click', () => {
        document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('selected'));
        dayCell.classList.add('selected');

        bookingState.date.day = d;
        bookingState.date.month = month;
        bookingState.date.year = year;

        const dateObj = new Date(year, month, d);
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        bookingState.date.dateString = `${dayNames[dateObj.getDay()]}, ${d} de ${monthNames[month]} ${year}`;

        updateStepper(3);
        showToast(`Fecha: ${bookingState.date.dateString}`);
      });

      calendarDaysContainer.appendChild(dayCell);
    }
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

  timeSlotItems.forEach((slot) => {
    slot.addEventListener('click', () => {
      timeSlotItems.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      bookingState.timeSlot = slot.dataset.time || slot.textContent.trim();
      updateStepper(3);
      showToast(`Hora: ${bookingState.timeSlot} hrs`);
    });
  });

  // ==========================================================================
  // 6. CONTROL DEL STEPPER & BOTÓN CONTINUAR
  // ==========================================================================
  function updateStepper(stepNumber) {
    bookingState.step = Math.max(bookingState.step, stepNumber);
    stepperItems.forEach((stepEl, idx) => {
      const stepIdx = idx + 1;
      if (stepIdx === bookingState.step) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('active');
      }
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
  // 7. MODALES DE CONFIRMACIÓN DE CITA
  // ==========================================================================
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const confirmBookingForm = document.getElementById('confirmBookingForm');

  function openBookingConfirmationModal() {
    if (!bookingModal) return;

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
      const clientName = document.getElementById('clientName').value.trim() || 'Estimado(a) Cliente';
      const bookingCode = `ASIO-${Math.floor(10000 + Math.random() * 90000)}`;

      closeBookingConfirmationModal();

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
  // 8. BÚSQUEDA RÁPIDA
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
      searchResultsContainer.innerHTML = '<p style="text-align:center; padding:1rem; color:var(--text-muted); font-size: 0.8rem;">No se encontraron resultados.</p>';
      return;
    }

    filtered.forEach(item => {
      const el = document.createElement('div');
      el.className = 'summary-row';
      el.style.cssText = 'padding: 0.65rem; border-radius: 8px; background: var(--bg-card-subtle); margin-bottom: 0.4rem; cursor: pointer;';
      el.innerHTML = `
        <div>
          <div style="font-weight:700; color:var(--text-primary); font-size: 0.84rem;">${item.title}</div>
          <div style="font-size: 0.74rem; color:var(--text-muted);">${item.desc}</div>
        </div>
        <div style="font-weight:700; color:var(--primary-purple); white-space:nowrap; margin-left: 0.6rem;">${item.price}</div>
      `;
      el.addEventListener('click', () => {
        if (searchModal) searchModal.classList.remove('active');
        const matchingExp = document.querySelector(`.experience-select-item[data-id="${item.targetId}"]`);
        if (matchingExp) matchingExp.click();
        switchView('reserva');
      });
      searchResultsContainer.appendChild(el);
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
  // 10. GESTIÓN DE INSTALACIÓN PWA (OPTIMIZADO PARA MÓVILES)
  // ==========================================================================
  let deferredInstallPrompt = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker activo en:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Error en Service Worker:', err);
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

  const pwaInstallBtns = document.querySelectorAll('.trigger-pwa-install');
  pwaInstallBtns.forEach(btn => {
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
