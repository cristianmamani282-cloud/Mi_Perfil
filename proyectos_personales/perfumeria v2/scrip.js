/* =========================================================
   ESSENZA PERFUMERÍA - MINIMALIST JAVASCRIPT & PWA ENGINE
   Diseño Web II (SIS-0141) - UPDS Sede La Paz
   Despliegue modular por botones sin scroll de ventana
   Auditoría XSS (.text()) y Delegación (.off().on())
========================================================= */

// =========================================================
// 1. CAPA DE RESILIENCIA Y COMPATIBILIDAD CON MICRO-$
// =========================================================
(function () {
    if (typeof window.$ === "undefined") {
        function MicroQuery(selector) {
            if (!(this instanceof MicroQuery)) {
                return new MicroQuery(selector);
            }
            if (!selector) {
                this.elements = [];
            } else if (selector === document) {
                this.elements = [document];
            } else if (selector === window) {
                this.elements = [window];
            } else if (selector instanceof HTMLElement) {
                this.elements = [selector];
            } else if (typeof selector === "string") {
                this.elements = Array.from(document.querySelectorAll(selector));
            } else if (Array.isArray(selector)) {
                this.elements = selector;
            } else {
                this.elements = [];
            }
            this.length = this.elements.length;
        }

        MicroQuery.prototype = {
            on: function (events, selector, handler) {
                const eventList = events.split(" ");
                if (typeof selector === "function") {
                    handler = selector;
                    selector = null;
                }
                this.elements.forEach((el) => {
                    eventList.forEach((ev) => {
                        if (!el._mqHandlers) el._mqHandlers = {};
                        if (!el._mqHandlers[ev]) el._mqHandlers[ev] = [];

                        const listener = function (e) {
                            if (!selector) {
                                handler.call(el, e);
                            } else {
                                const target = e.target.closest(selector);
                                if (target && el.contains(target)) {
                                    handler.call(target, e);
                                }
                            }
                        };

                        el._mqHandlers[ev].push({ selector, handler, listener });
                        el.addEventListener(ev, listener);
                    });
                });
                return this;
            },

            off: function (events, selector) {
                const eventList = events.split(" ");
                this.elements.forEach((el) => {
                    if (!el._mqHandlers) return;
                    eventList.forEach((ev) => {
                        const stored = el._mqHandlers[ev] || [];
                        const remaining = [];
                        stored.forEach((entry) => {
                            if (!selector || entry.selector === selector) {
                                el.removeEventListener(ev, entry.listener);
                            } else {
                                remaining.push(entry);
                            }
                        });
                        el._mqHandlers[ev] = remaining;
                    });
                });
                return this;
            },

            text: function (val) {
                if (typeof val === "undefined") {
                    return this.elements[0] ? this.elements[0].textContent : "";
                }
                this.elements.forEach((el) => {
                    el.textContent = String(val);
                });
                return this;
            },

            val: function (val) {
                if (typeof val === "undefined") {
                    return this.elements[0] ? this.elements[0].value : "";
                }
                this.elements.forEach((el) => {
                    el.value = val;
                });
                return this;
            },

            attr: function (name, val) {
                if (typeof val === "undefined") {
                    return this.elements[0] ? this.elements[0].getAttribute(name) : null;
                }
                this.elements.forEach((el) => el.setAttribute(name, val));
                return this;
            },

            addClass: function (cls) {
                this.elements.forEach((el) => el.classList.add(cls));
                return this;
            },

            removeClass: function (cls) {
                this.elements.forEach((el) => el.classList.remove(cls));
                return this;
            },

            toggleClass: function (cls) {
                let state = false;
                this.elements.forEach((el) => {
                    state = el.classList.toggle(cls);
                });
                return state;
            },

            show: function () {
                this.elements.forEach((el) => {
                    el.style.display = "";
                });
                return this;
            },

            hide: function () {
                this.elements.forEach((el) => {
                    el.style.display = "none";
                });
                return this;
            },

            focus: function () {
                if (this.elements[0]) this.elements[0].focus();
                return this;
            },

            scrollTop: function (val) {
                if (typeof val !== "undefined") {
                    this.elements.forEach((el) => { el.scrollTop = val; });
                }
                return this.elements[0] ? this.elements[0].scrollTop : 0;
            }
        };

        window.$ = window.jQuery = MicroQuery;
    }
})();

// =========================================================
// 2. INICIALIZACIÓN PRINCIPAL (DOM READY)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       CRITERIO 1: REGISTRO OFICIAL DE SERVICE WORKER (PWA)
    ========================================================= */
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js", { scope: "./" })
            .then((registration) => {
                console.log("✅ [PWA] ServiceWorker registrado:", registration.scope);
            })
            .catch((error) => {
                console.warn("⚠️ [PWA] ServiceWorker aviso:", error);
            });
    }

    /* =========================================================
       SISTEMA DE DESPLIEGUE MODULAR POR BOTONES (SIN SCROLL)
    ========================================================= */
    function cambiarVista(nombreVista, filtroOpcional, busquedaOpcional) {
        if (!nombreVista) return;

        // Ocultar todas las vistas
        $(".app-view").hide().removeClass("active");

        // Mostrar la vista seleccionada
        const targetView = $("#view-" + nombreVista);
        if (targetView.length) {
            targetView.show().addClass("active");
            targetView.scrollTop(0);
        }

        // Actualizar botones de navegación activos (desktop y mobile bar)
        $(".nav-link-btn, .nav-tab-btn").removeClass("active").attr("aria-selected", "false");
        $('[data-view="' + nombreVista + '"]').addClass("active").attr("aria-selected", "true");

        // Aplicar filtro si se solicitó (ej. 'mujer', 'hombre', 'top')
        if (filtroOpcional) {
            $(".filter-pill").removeClass("active").attr("aria-selected", "false");
            const matchingPill = $('.filter-pill[data-filter="' + filtroOpcional + '"]');
            if (matchingPill.length) {
                matchingPill.addClass("active").attr("aria-selected", "true");
            }
            filtrarCatalogo();
        }

        // Aplicar búsqueda si se solicitó por marca
        if (busquedaOpcional) {
            const buscador = document.getElementById("buscadorPerfumes");
            if (buscador) {
                buscador.value = busquedaOpcional;
            }
            $(".filter-pill").removeClass("active").attr("aria-selected", "false");
            $('.filter-pill[data-filter="todos"]').addClass("active").attr("aria-selected", "true");
            filtrarCatalogo();
        }
    }

    // Delegación .off().on() para todos los botones que despliegan vistas
    $(document).off("click", "[data-view]").on("click", "[data-view]", function (e) {
        e.preventDefault();
        const vista = $(this).attr("data-view");
        const filtro = $(this).attr("data-filter");
        const busqueda = $(this).attr("data-search");
        cambiarVista(vista, filtro, busqueda);
    });

    /* =========================================================
       TOAST FEEDBACK ACCESIBLE Y SANITIZADO
    ========================================================= */
    let toastTimeout = null;
    function mostrarToast(mensaje) {
        const toast = document.getElementById("toastFeedback");
        const msgSpan = document.getElementById("toastMessage");
        if (!toast || !msgSpan) return;

        // SANITIZACIÓN DOM CONTRA XSS: .text() estricto
        $(msgSpan).text(mensaje);

        toast.classList.add("show");
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3400);
    }

    /* =========================================================
       MODO OSCURO / CLARO PERSISTENTE (LOCALSTORAGE)
    ========================================================= */
    const modoBtn = document.getElementById("modoBtn");
    const body = document.body;

    function actualizarIconoModo(esOscuro) {
        if (!modoBtn) return;
        const icon = modoBtn.querySelector("i");
        if (icon) {
            if (esOscuro) {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
                modoBtn.setAttribute("title", "Modo Claro");
            } else {
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
                modoBtn.setAttribute("title", "Modo Noche");
            }
        }
    }

    try {
        const temaGuardado = localStorage.getItem("essenza-theme");
        if (temaGuardado === "dark") {
            body.classList.add("dark");
            actualizarIconoModo(true);
        } else {
            body.classList.remove("dark");
            actualizarIconoModo(false);
        }
    } catch (e) { }

    $(document).off("click", "#modoBtn").on("click", "#modoBtn", () => {
        const esOscuro = body.classList.toggle("dark");
        try {
            localStorage.setItem("essenza-theme", esOscuro ? "dark" : "light");
        } catch (e) { }
        actualizarIconoModo(esOscuro);
        mostrarToast(esOscuro ? "Modo Noche activado" : "Modo Claro activado");
    });

    /* =========================================================
       MODAL REGISTRO (100dvh Y ESTABILIDAD ANTE TECLADO VIRTUAL)
    ========================================================= */
    const modal = document.getElementById("modal");

    function abrirModalRegistro() {
        if (modal) {
            modal.style.display = "flex";
            const primerInput = modal.querySelector("input#nombre");
            if (primerInput) setTimeout(() => primerInput.focus(), 100);
        }
    }

    function cerrarModalRegistro() {
        if (modal) modal.style.display = "none";
    }

    $(document).off("click", "#abrirModal").on("click", "#abrirModal", abrirModalRegistro);
    $(document).off("click", ".close-modal").on("click", ".close-modal", cerrarModalRegistro);

    $(document).off("click", "#modal").on("click", "#modal", (e) => {
        if (e.target === modal) {
            cerrarModalRegistro();
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.style.display === "flex") {
            cerrarModalRegistro();
        }
    });

    /* =========================================================
       SANITIZACIÓN DE CAMPOS EN TIEMPO REAL
    ========================================================= */
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const ciInput = document.getElementById("ci");
    const telefonoInput = document.getElementById("telefono");

    if (nombreInput) {
        $(document).off("input", "#nombre").on("input", "#nombre", () => {
            nombreInput.value = nombreInput.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]/g, "");
        });
    }

    if (apellidoInput) {
        $(document).off("input", "#apellido").on("input", "#apellido", () => {
            apellidoInput.value = apellidoInput.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]/g, "");
        });
    }

    if (ciInput) {
        $(document).off("input", "#ci").on("input", "#ci", () => {
            ciInput.value = ciInput.value.replace(/\D/g, "");
        });
    }

    if (telefonoInput) {
        $(document).off("input", "#telefono").on("input", "#telefono", () => {
            telefonoInput.value = telefonoInput.value.replace(/\D/g, "").slice(0, 8);
        });
    }

    /* =========================================================
       VALIDACIÓN DEL FORMULARIO Y SANITIZACIÓN DOM CON .text()
    ========================================================= */
    const registroForm = document.getElementById("registroForm");
    const ciudadInput = document.getElementById("ciudad");
    const correoInput = document.getElementById("correo");
    const passwordInput = document.getElementById("password");
    const confirmarInput = document.getElementById("confirmar");
    const terminosInput = document.getElementById("terminos");

    $(document).off("submit", "#registroForm").on("submit", "#registroForm", (e) => {
        e.preventDefault();

        const nombre = nombreInput ? nombreInput.value.trim() : "";
        const apellido = apellidoInput ? apellidoInput.value.trim() : "";
        const ci = ciInput ? ciInput.value.trim() : "";
        const ciudad = ciudadInput ? ciudadInput.value : "";
        const telefono = telefonoInput ? telefonoInput.value.trim() : "";
        const correo = correoInput ? correoInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";
        const confirmar = confirmarInput ? confirmarInput.value : "";
        const terminosAceptados = terminosInput ? terminosInput.checked : false;

        const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;
        const soloNumerosRegex = /^[0-9]+$/;
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonoRegex = /^[67][0-9]{7}$/;
        const ciRegex = /^[0-9]{5,10}$/;

        if (!nombre || !soloLetrasRegex.test(nombre) || nombre.length < 2) {
            mostrarToast("Nombre inválido (solo letras, mín. 2 caracteres).");
            if (nombreInput) nombreInput.focus();
            return;
        }

        if (!apellido || !soloLetrasRegex.test(apellido) || apellido.length < 2) {
            mostrarToast("Apellido inválido (solo letras, mín. 2 caracteres).");
            if (apellidoInput) apellidoInput.focus();
            return;
        }

        if (!ci || !soloNumerosRegex.test(ci) || !ciRegex.test(ci)) {
            mostrarToast("CI inválido (5 a 10 dígitos numéricos).");
            if (ciInput) ciInput.focus();
            return;
        }

        if (!ciudad) {
            mostrarToast("Por favor seleccione su ciudad.");
            if (ciudadInput) ciudadInput.focus();
            return;
        }

        if (!telefono || !telefonoRegex.test(telefono)) {
            mostrarToast("Teléfono inválido (8 dígitos bolivianos, inicia con 6 o 7).");
            if (telefonoInput) telefonoInput.focus();
            return;
        }

        if (!correo || !correoRegex.test(correo)) {
            mostrarToast("Correo inválido (ejemplo: usuario@correo.com).");
            if (correoInput) correoInput.focus();
            return;
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            mostrarToast("Contraseña débil (mín. 8 caracteres, 1 mayúscula y 1 número).");
            if (passwordInput) passwordInput.focus();
            return;
        }

        if (password !== confirmar) {
            mostrarToast("Las contraseñas no coinciden.");
            if (confirmarInput) confirmarInput.focus();
            return;
        }

        if (!terminosAceptados) {
            mostrarToast("Debe aceptar los términos y condiciones.");
            if (terminosInput) terminosInput.focus();
            return;
        }

        // SANITIZACIÓN DOM CON .text() (PREVENCIÓN XSS)
        const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        $("#userNameNav").text(nombreCapitalizado);

        cerrarModalRegistro();
        if (registroForm) registroForm.reset();
        mostrarToast("¡Bienvenido/a " + nombreCapitalizado + "! Cuenta creada exitosamente.");
    });

    /* =========================================================
       BUSCADOR EN TIEMPO REAL CON SANITIZACIÓN XSS (.text())
    ========================================================= */
    const buscador = document.getElementById("buscadorPerfumes");
    const feedbackBusqueda = document.getElementById("feedbackBusqueda");
    const terminoSpan = document.getElementById("terminoBusquedaSanitizado");
    const contadorSpan = document.getElementById("cantidadResultados");
    const btnLimpiar = document.getElementById("btnLimpiarBusqueda");
    const noResults = document.getElementById("noResults");
    const productCards = document.querySelectorAll(".product-card");

    function filtrarCatalogo() {
        const query = buscador ? buscador.value.trim().toLowerCase() : "";
        const queryOriginal = buscador ? buscador.value.trim() : "";
        const activeFilter = document.querySelector(".filter-pill.active");
        const categoriaActual = activeFilter ? activeFilter.getAttribute("data-filter") : "todos";

        let visibles = 0;

        if (btnLimpiar) {
            btnLimpiar.style.display = query.length > 0 ? "inline-flex" : "none";
        }

        // AUDITORÍA XSS: Inserción del término con .text()
        if (queryOriginal.length > 0) {
            if (terminoSpan) $(terminoSpan).text('"' + queryOriginal + '"');
            if (feedbackBusqueda) feedbackBusqueda.style.display = "flex";
        } else {
            if (feedbackBusqueda) feedbackBusqueda.style.display = "none";
        }

        productCards.forEach((card) => {
            const cardName = (card.getAttribute("data-name") || "").toLowerCase();
            const cardBrand = (card.getAttribute("data-brand") || "").toLowerCase();
            const cardCategory = (card.getAttribute("data-category") || "").toLowerCase();

            const coincideQuery = query === "" || cardName.includes(query) || cardBrand.includes(query);
            const coincideCategoria = categoriaActual === "todos" || cardCategory.includes(categoriaActual);

            if (coincideQuery && coincideCategoria) {
                card.style.display = "flex";
                visibles++;
            } else {
                card.style.display = "none";
            }
        });

        if (contadorSpan) {
            $(contadorSpan).text("(" + visibles + ")");
        }

        if (noResults) {
            noResults.style.display = visibles === 0 ? "block" : "none";
        }
    }

    $(document).off("input", "#buscadorPerfumes").on("input", "#buscadorPerfumes", filtrarCatalogo);

    $(document).off("click", "#btnLimpiarBusqueda").on("click", "#btnLimpiarBusqueda", () => {
        if (buscador) {
            buscador.value = "";
            buscador.focus();
        }
        filtrarCatalogo();
    });

    $(document).off("click", ".filter-pill").on("click", ".filter-pill", function () {
        $(".filter-pill").removeClass("active").attr("aria-selected", "false");
        $(this).addClass("active").attr("aria-selected", "true");
        filtrarCatalogo();
    });

    /* =========================================================
       CARRITO DE COMPRAS INTERACTIVO
    ========================================================= */
    let cartTotalItems = 0;
    const cartCountSpan = document.getElementById("cartCount");

    $(document).off("click", ".btn-add-cart").on("click", ".btn-add-cart", function () {
        const prodName = $(this).attr("data-name") || "Perfume";
        cartTotalItems++;

        if (cartCountSpan) {
            $(cartCountSpan).text(cartTotalItems);
        }

        mostrarToast("Añadido al carrito: " + prodName);
    });

    /* =========================================================
       HERO SLIDER TOUCH ACCESIBLE
    ========================================================= */
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;
    let autoSlideInterval = null;

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add("active");
                dot.setAttribute("aria-selected", "true");
            } else {
                dot.classList.remove("active");
                dot.setAttribute("aria-selected", "false");
            }
        });
    }

    function siguienteSlide() {
        currentSlide = (currentSlide + 1) % (dots.length || 1);
        updateDots();
    }

    function anteriorSlide() {
        currentSlide = (currentSlide - 1 + (dots.length || 1)) % (dots.length || 1);
        updateDots();
    }

    $(document).off("click", ".slider-btn.next").on("click", ".slider-btn.next", siguienteSlide);
    $(document).off("click", ".slider-btn.prev").on("click", ".slider-btn.prev", anteriorSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            updateDots();
        });
    });

    function iniciarAutoSlide() {
        autoSlideInterval = setInterval(siguienteSlide, 5000);
    }
    iniciarAutoSlide();

    const heroSection = document.querySelector(".hero");
    if (heroSection) {
        heroSection.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
        heroSection.addEventListener("mouseleave", iniciarAutoSlide);
        heroSection.addEventListener("touchstart", () => clearInterval(autoSlideInterval), { passive: true });
        heroSection.addEventListener("touchend", iniciarAutoSlide, { passive: true });
    }

});
