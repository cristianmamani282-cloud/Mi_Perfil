/**
 * CYBERZONE GAMING CAFÉ - CORE SCRIPT (jQuery 3.7.1)
 * Dynamic themes, background crossfading, live clock, carousel, modal & reservations
 */

$(document).ready(function () {

    // =========================================================================
    // 1. RELOJ EN VIVO DINÁMICO (HORA Y FECHA EN ESPAÑOL)
    // =========================================================================
    function actualizarReloj() {
        const ahora = new Date();

        // Formato de hora HH:MM:SS
        const horas = String(ahora.getHours()).padStart(2, '0');
        const minutos = String(ahora.getMinutes()).padStart(2, '0');
        $('#liveTime').text(`${horas}:${minutos}`);

        // Formato de fecha: ej. "Jue, 5 Jun 2025" o fecha actual
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const diaSemana = diasSemana[ahora.getDay()];
        const diaMes = ahora.getDate();
        const mes = meses[ahora.getMonth()];
        const anio = ahora.getFullYear();

        $('#liveDate').text(`${diaSemana}, ${diaMes} ${mes} ${anio}`);
    }

    actualizarReloj();
    setInterval(actualizarReloj, 1000);


    // =========================================================================
    // 2. HERO CAROUSEL / SLIDER AUTOMÁTICO Y MANUAL
    // =========================================================================
    const $slides = $('.carousel-slide');
    const $dots = $('.carousel-indicators .dot');
    const totalSlides = $slides.length;
    let slideActual = 0;
    let carouselInterval;

    function mostrarSlide(indice) {
        if (indice < 0) {
            slideActual = totalSlides - 1;
        } else if (indice >= totalSlides) {
            slideActual = 0;
        } else {
            slideActual = indice;
        }

        $slides.removeClass('active').eq(slideActual).addClass('active');
        $dots.removeClass('active').eq(slideActual).addClass('active');
    }

    function siguienteSlide() {
        mostrarSlide(slideActual + 1);
    }

    function anteriorSlide() {
        mostrarSlide(slideActual - 1);
    }

    function iniciarAutoplay() {
        detenerAutoplay();
        carouselInterval = setInterval(siguienteSlide, 5000);
    }

    function detenerAutoplay() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }

    // Controles del carrusel
    $('#nextSlide').on('click', function () {
        siguienteSlide();
        iniciarAutoplay();
    });

    $('#prevSlide').on('click', function () {
        anteriorSlide();
        iniciarAutoplay();
    });

    $dots.on('click', function () {
        const targetIndex = parseInt($(this).data('index'));
        mostrarSlide(targetIndex);
        iniciarAutoplay();
    });

    // Pausar autoplay al pasar el mouse por el carrusel
    $('.carousel-container').hover(detenerAutoplay, iniciarAutoplay);
    iniciarAutoplay();


    // =========================================================================
    // 3. CAMBIO DE CATEGORÍAS Y FONDOS DINÁMICOS
    // "al cambiar cambie tambien los fondos"
    // =========================================================================
    $('.cat-btn').on('click', function () {
        const categoria = $(this).data('category');

        // Actualizar botón activo
        $('.cat-btn').removeClass('active');
        $(this).addClass('active');

        // 1. Cambiar clase de tema en el body para colores de acento
        $('body')
            .removeClass('theme-pc theme-ps5 theme-xbox theme-snacks')
            .addClass('theme-' + categoria);

        // 2. Transición suave de capas de fondo (Crossfade)
        $('.bg-layer').removeClass('active');
        $('.bg-' + categoria).addClass('active');

        // 3. Mostrar panel de contenido correspondiente
        $('.category-panel').removeClass('active').hide();
        const $targetPanel = $('#panel-' + categoria);
        $targetPanel.fadeIn(350).addClass('active');

        // Efecto háptico visual en el botón
        $(this).find('.cat-arrow').css('transform', 'rotate(180deg)');
        setTimeout(() => {
            $('.cat-arrow').css('transform', 'rotate(0deg)');
        }, 300);
    });


    // =========================================================================
    // 4. COLAPSAR / EXPANDIR PANEL (ACORDEÓN)
    // =========================================================================
    $('.panel-toggle-btn').on('click', function () {
        const $panel = $(this).closest('.category-panel');
        const $grid = $panel.find('.cards-grid');
        const $chevron = $(this).find('.toggle-chevron');

        $grid.slideToggle(300, function () {
            if ($grid.is(':visible')) {
                $chevron.removeClass('collapsed');
            } else {
                $chevron.addClass('collapsed');
            }
        });
    });


    // =========================================================================
    // 5. MODAL DE CONFIRMACIÓN DE RESERVA & HORAS
    // =========================================================================
    let equipoSeleccionado = '';
    let tarifaPorHora = 40;
    let horasSeleccionadas = 1;
    let modalTimerInterval;
    let tiempoModalRestante = 29 * 60 + 58; // 29 minutos 58 segundos como en la foto
    let $tarjetaEquipoSeleccionada = null;

    // Abrir modal al hacer clic en "Reservar"
    $(document).on('click', '.btn-reservar:not(.btn-disabled):not(.btn-snack)', function () {
        $tarjetaEquipoSeleccionada = $(this).closest('.equipment-card');
        equipoSeleccionado = $(this).data('equipo');
        tarifaPorHora = parseInt($(this).data('tarifa')) || 40;

        // Actualizar datos en el modal
        $('#modalEquipoNombre').text(equipoSeleccionado);

        // Actualizar tarifas por hora
        $('#hourPrice1').text(`Bs. ${tarifaPorHora * 1}`);
        $('#hourPrice2').text(`Bs. ${tarifaPorHora * 2}`);
        $('#hourPrice3').text(`Bs. ${tarifaPorHora * 3}`);

        // Resetear horas a 1 por defecto
        horasSeleccionadas = 1;
        $('.hour-btn').removeClass('active');
        $('.hour-btn[data-hours="1"]').addClass('active');

        // Limpiar inputs
        $('#inputNombre').val('');
        $('#inputCI').val('');
        $('#inputUsuario').val('');

        // Iniciar cuenta regresiva del modal
        iniciarContadorModal();

        // Mostrar modal con animación
        $('#modalOverlay').css('display', 'flex').hide().fadeIn(250);
        $('#modalOverlay').addClass('open');
    });

    // Selección interactiva de horas (1 Hora, 2 Horas, 3 Horas)
    $('.hour-btn').on('click', function () {
        $('.hour-btn').removeClass('active');
        $(this).addClass('active');
        horasSeleccionadas = parseInt($(this).data('hours'));
    });

    // Cerrar modal
    function cerrarModal() {
        detenerContadorModal();
        $('#modalOverlay').fadeOut(200, function () {
            $(this).removeClass('open');
        });
    }

    $('#btnCerrarModal, #btnModalCancelar').on('click', cerrarModal);

    // Cerrar al hacer clic en el backdrop fuera de la tarjeta
    $('#modalOverlay').on('click', function (e) {
        if ($(e.target).is('#modalOverlay')) {
            cerrarModal();
        }
    });

    // Temporizador de cuenta regresiva para confirmación de pago en modal
    function iniciarContadorModal() {
        detenerContadorModal();
        tiempoModalRestante = 29 * 60 + 58; // 29:58
        actualizarTextoContadorModal();

        modalTimerInterval = setInterval(function () {
            tiempoModalRestante--;
            actualizarTextoContadorModal();

            if (tiempoModalRestante <= 0) {
                detenerContadorModal();
                cerrarModal();
                mostrarToast('El tiempo para confirmar el pago ha expirado.', 'error');
            }
        }, 1000);
    }

    function actualizarTextoContadorModal() {
        const min = Math.floor(tiempoModalRestante / 60);
        const seg = tiempoModalRestante % 60;
        const textoMin = String(min).padStart(2, '0');
        const textoSeg = String(seg).padStart(2, '0');
        $('#modalCountdown').text(`${textoMin}:${textoSeg}`);
    }

    function detenerContadorModal() {
        if (modalTimerInterval) {
            clearInterval(modalTimerInterval);
        }
    }


    // =========================================================================
    // 6. CONFIRMAR RESERVA Y PAGO
    // =========================================================================
    let sesionJuegoTimerInterval;
    let tiempoSesionSegundos = 0;

    $('#btnModalConfirmar').on('click', function () {
        const nombre = $('#inputNombre').val().trim();
        const ci = $('#inputCI').val().trim();
        let usuario = $('#inputUsuario').val().trim();

        // Validaciones
        if (!nombre || !ci || !usuario) {
            mostrarToast('Por favor completa todos tus datos personales.', 'warning');
            return;
        }

        if (!usuario.startsWith('@')) {
            usuario = '@' + usuario;
        }

        // 1. Cerrar modal
        cerrarModal();

        // 2. Marcar la tarjeta del equipo como ocupada
        if ($tarjetaEquipoSeleccionada) {
            $tarjetaEquipoSeleccionada.find('.card-status')
                .removeClass('status-available')
                .addClass('status-occupied')
                .html('<span class="status-dot"></span><span>Ocupado por ti</span>');

            $tarjetaEquipoSeleccionada.find('.btn-reservar')
                .addClass('btn-disabled')
                .prop('disabled', true)
                .text('En Uso');
        }

        // 3. Activar barra superior de reserva activa
        $('#equipoReservado').text(equipoSeleccionado);
        $('#usuarioReservado').text(usuario);
        $('#reservaActiva').slideDown();

        // Iniciar temporizador de la sesión de juego reservada
        tiempoSesionSegundos = horasSeleccionadas * 3600;
        iniciarSesionJuegoTimer();

        // 4. Actualizar paso activo en "¿Cómo funciona?"
        $('.step-item').removeClass('active');
        $('.step-item.step-3, .step-item.step-4').addClass('active');

        // 5. Toast de felicitaciones
        const totalPagar = tarifaPorHora * horasSeleccionadas;
        mostrarToast(`¡Reserva confirmada! ${equipoSeleccionado} por ${horasSeleccionadas}h (Bs. ${totalPagar}). ¡A jugar!`, 'success');
    });

    function iniciarSesionJuegoTimer() {
        if (sesionJuegoTimerInterval) {
            clearInterval(sesionJuegoTimerInterval);
        }

        actualizarTextoReservaActiva();

        sesionJuegoTimerInterval = setInterval(function () {
            tiempoSesionSegundos--;
            actualizarTextoReservaActiva();

            if (tiempoSesionSegundos <= 0) {
                clearInterval(sesionJuegoTimerInterval);
                $('#reservaActiva').slideUp();
                mostrarToast('¡Tu tiempo de juego ha finalizado! Gracias por visitarnos.', 'warning');
            }
        }, 1000);
    }

    function actualizarTextoReservaActiva() {
        const hrs = Math.floor(tiempoSesionSegundos / 3600);
        const min = Math.floor((tiempoSesionSegundos % 3600) / 60);
        const seg = tiempoSesionSegundos % 60;

        const strHrs = String(hrs).padStart(2, '0');
        const strMin = String(min).padStart(2, '0');
        const strSeg = String(seg).padStart(2, '0');

        $('#tiempoReserva').text(`${strHrs}:${strMin}:${strSeg}`);
    }

    // Botón para liberar reserva activa
    $('#btnFinalizarReserva').on('click', function () {
        if (confirm('¿Deseas liberar tu puesto y finalizar la sesión?')) {
            if (sesionJuegoTimerInterval) {
                clearInterval(sesionJuegoTimerInterval);
            }
            $('#reservaActiva').slideUp();

            if ($tarjetaEquipoSeleccionada) {
                $tarjetaEquipoSeleccionada.find('.card-status')
                    .removeClass('status-occupied')
                    .addClass('status-available')
                    .html('<span class="status-dot"></span><span>Disponible</span>');

                $tarjetaEquipoSeleccionada.find('.btn-reservar')
                    .removeClass('btn-disabled')
                    .prop('disabled', false)
                    .text('Reservar');
            }

            mostrarToast('Puesto liberado exitosamente.', 'info');
        }
    });


    // =========================================================================
    // 7. ORDENAR SNACKS Y BEBIDAS
    // =========================================================================
    $(document).on('click', '.btn-snack', function () {
        const item = $(this).data('item');
        const precio = $(this).data('precio');

        $(this).css('transform', 'scale(0.95)');
        setTimeout(() => $(this).css('transform', ''), 150);

        mostrarToast(`🍟 Orden recibida: ${item} (Bs. ${precio}). Te lo llevaremos a tu puesto.`, 'success');
    });


    // =========================================================================
    // 8. SISTEMA DE TOAST NOTIFICATIONS
    // =========================================================================
    let toastTimeout;

    function mostrarToast(mensaje, tipo = 'success') {
        const $toast = $('#toastNotification');
        const $msg = $('#toastMessage');
        const $icon = $toast.find('.toast-icon');

        // Icono según tipo
        if (tipo === 'success') {
            $icon.html('<i class="fa-solid fa-circle-check" style="color: #22c55e;"></i>');
            $toast.css('border-left-color', '#22c55e');
        } else if (tipo === 'warning') {
            $icon.html('<i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b;"></i>');
            $toast.css('border-left-color', '#f59e0b');
        } else if (tipo === 'error') {
            $icon.html('<i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i>');
            $toast.css('border-left-color', '#ef4444');
        } else {
            $icon.html('<i class="fa-solid fa-circle-info" style="color: #38bdf8;"></i>');
            $toast.css('border-left-color', '#38bdf8');
        }

        $msg.text(mensaje);

        clearTimeout(toastTimeout);
        $toast.stop(true, true).fadeIn(300);

        toastTimeout = setTimeout(function () {
            $toast.fadeOut(400);
        }, 4000);
    }


    // =========================================================================
    // 9. NAVEGACIÓN SUAVE DE ENLACES DEL HEADER
    // =========================================================================
    $('.header-nav a').on('click', function (e) {
        $('.header-nav a').removeClass('active');
        $(this).addClass('active');

        const href = $(this).attr('href');
        if (href.startsWith('#')) {
            const target = $(href);
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 500);

                // Si se hace clic en snacks, cambiar categoría automáticamente
                if (href === '#snacks') {
                    $('.cat-btn[data-category="snacks"]').trigger('click');
                } else if (href === '#equipos') {
                    $('.cat-btn[data-category="pc"]').trigger('click');
                }
            }
        }
    });

});
