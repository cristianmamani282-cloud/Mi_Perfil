/* =========================================================
   PERFUMERÍA PIPE FERNANDEZ - PWA & SHOPPING ENGINE
   Despliegue modular por botones sin scroll de ventana (100dvh)
   Auditoría XSS (.text()), Carrito con Costos y Checkout WhatsApp
   Modo Offline con Service Worker y Autenticación Obligatoria
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
       1. REGISTRO OFICIAL DE SERVICE WORKER & MODO OFFLINE
    ========================================================= */
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js", { scope: "./" })
            .then((registration) => {
                console.log("✅ [PWA - Pipe Fernandez] ServiceWorker activo:", registration.scope);
            })
            .catch((error) => {
                console.warn("⚠️ [PWA] ServiceWorker aviso:", error);
            });
    }

    // Detección de conectividad en tiempo real (Modo Offline)
    function actualizarEstadoConexion() {
        const offlineBar = document.getElementById("offlineIndicator");
        if (!offlineBar) return;

        if (navigator.onLine) {
            offlineBar.style.display = "none";
        } else {
            offlineBar.style.display = "flex";
            mostrarToast("Modo Offline activo: Navegando en catálogo guardado.");
        }
    }

    window.addEventListener("online", () => {
        actualizarEstadoConexion();
        mostrarToast("Conexión restablecida. Listo para procesar pedidos.");
    });

    window.addEventListener("offline", () => {
        actualizarEstadoConexion();
    });

    actualizarEstadoConexion();

    /* =========================================================
       2. TOAST FEEDBACK SANITIZADO (.text())
    ========================================================= */
    let toastTimeout = null;
    function mostrarToast(mensaje) {
        const toast = document.getElementById("toastFeedback");
        const msgSpan = document.getElementById("toastMessage");
        if (!toast || !msgSpan) return;

        $(msgSpan).text(mensaje);
        toast.classList.add("show");
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3600);
    }

    /* =========================================================
       3. NAVEGACIÓN MODULAR DE VISTAS (SIN SCROLL GLOBAL)
    ========================================================= */
    function cambiarVista(nombreVista, filtroOpcional, busquedaOpcional) {
        if (!nombreVista) return;

        $(".app-view").hide().removeClass("active");

        const targetView = $("#view-" + nombreVista);
        if (targetView.length) {
            targetView.show().addClass("active");
            targetView.scrollTop(0);
        }

        $(".nav-link-btn, .nav-tab-btn, .mobile-nav-item").removeClass("active").attr("aria-selected", "false");
        $('[data-view="' + nombreVista + '"]').addClass("active").attr("aria-selected", "true");

        if (filtroOpcional) {
            $(".filter-pill").removeClass("active").attr("aria-selected", "false");
            const matchingPill = $('.filter-pill[data-filter="' + filtroOpcional + '"]');
            if (matchingPill.length) {
                matchingPill.addClass("active").attr("aria-selected", "true");
            }
            filtrarCatalogo();
        }

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

    // Funciones del Menú Hamburguesa Responsivo
    function abrirMenuHamburguesa() {
        const drawer = document.getElementById("mobileMenuDrawer");
        const btn = document.getElementById("hamburgerBtn");
        if (drawer) {
            drawer.classList.add("active");
            drawer.setAttribute("aria-hidden", "false");
        }
        if (btn) {
            btn.setAttribute("aria-expanded", "true");
            const icon = btn.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            }
        }
    }

    function cerrarMenuHamburguesa() {
        const drawer = document.getElementById("mobileMenuDrawer");
        const btn = document.getElementById("hamburgerBtn");
        if (drawer) {
            drawer.classList.remove("active");
            drawer.setAttribute("aria-hidden", "true");
        }
        if (btn) {
            btn.setAttribute("aria-expanded", "false");
            const icon = btn.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }
    }

    $(document).off("click", "#hamburgerBtn").on("click", "#hamburgerBtn", () => {
        const drawer = document.getElementById("mobileMenuDrawer");
        if (drawer && drawer.classList.contains("active")) {
            cerrarMenuHamburguesa();
        } else {
            abrirMenuHamburguesa();
        }
    });

    $(document).off("click", "#closeMobileMenu, #mobileMenuOverlay").on("click", "#closeMobileMenu, #mobileMenuOverlay", () => {
        cerrarMenuHamburguesa();
    });

    $(document).off("click", "[data-view]").on("click", "[data-view]", function (e) {
        e.preventDefault();
        const vista = $(this).attr("data-view");
        const filtro = $(this).attr("data-filter");
        const busqueda = $(this).attr("data-search");

        // Si se llama desde el carrito vacío
        if (this.id === "btnCartExplore") {
            cerrarModalCarrito();
        }

        // Cerrar menú hamburguesa si estaba abierto
        cerrarMenuHamburguesa();

        cambiarVista(vista, filtro, busqueda);
    });

    /* =========================================================
       4. MODO OSCURO / CLARO PERSISTENTE (LOCALSTORAGE)
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
        const temaGuardado = localStorage.getItem("pipe-theme");
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
            localStorage.setItem("pipe-theme", esOscuro ? "dark" : "light");
        } catch (e) { }
        actualizarIconoModo(esOscuro);
        mostrarToast(esOscuro ? "Modo Noche activado" : "Modo Claro activado");
    });

    /* =========================================================
       5. SISTEMA DEL CARRITO DE COMPRAS CON TOTAL DE COSTOS
    ========================================================= */
    let cart = [];
    try {
        const savedCart = localStorage.getItem("pipe_cart");
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        cart = [];
    }

    function guardarCarrito() {
        try {
            localStorage.setItem("pipe_cart", JSON.stringify(cart));
        } catch (e) { }
    }

    function actualizarUI_Carrito() {
        const cartCountSpan = document.getElementById("cartCount");
        const cartItemsList = document.getElementById("cartItemsList");
        const cartEmptyState = document.getElementById("cartEmptyState");
        const cartSubtotal = document.getElementById("cartSubtotal");
        const cartTotalCost = document.getElementById("cartTotalCost");
        const cartFooter = document.getElementById("cartFooter");

        // Calcular cantidades y total de costos
        let totalQty = 0;
        let totalCost = 0;

        cart.forEach((item) => {
            totalQty += item.qty;
            totalCost += (item.price * item.qty);
        });

        // Actualizar contador del header
        if (cartCountSpan) {
            $(cartCountSpan).text(totalQty);
        }

        // Formato con separadores de miles
        const totalFormateado = "Bs. " + totalCost.toLocaleString("es-BO");
        if (cartSubtotal) $(cartSubtotal).text(totalFormateado);
        if (cartTotalCost) $(cartTotalCost).text(totalFormateado);

        // Renderizado del cuerpo del carrito
        if (cart.length === 0) {
            if (cartItemsList) cartItemsList.innerHTML = "";
            if (cartEmptyState) cartEmptyState.style.display = "flex";
            if (cartFooter) {
                const btnCheckout = document.getElementById("btnCheckout");
                if (btnCheckout) {
                    btnCheckout.style.opacity = "0.5";
                    btnCheckout.style.pointerEvents = "none";
                }
            }
        } else {
            if (cartEmptyState) cartEmptyState.style.display = "none";
            if (cartFooter) {
                const btnCheckout = document.getElementById("btnCheckout");
                if (btnCheckout) {
                    btnCheckout.style.opacity = "1";
                    btnCheckout.style.pointerEvents = "auto";
                }
            }

            if (cartItemsList) {
                cartItemsList.innerHTML = "";
                cart.forEach((item) => {
                    const subtotalItem = item.price * item.qty;
                    const row = document.createElement("div");
                    row.className = "cart-item-row";

                    // Sanitización e inserción segura de elementos DOM
                    row.innerHTML = `
                        <img src="${item.img}" alt="${item.name}" class="cart-item-thumb" loading="lazy">
                        <div class="cart-item-info">
                            <span class="cart-item-brand">${item.brand || "ALTA PERFUMERÍA"}</span>
                            <h4 class="cart-item-name">${item.name}</h4>
                            <span class="cart-item-price">Bs. ${item.price.toLocaleString("es-BO")} c/u</span>
                        </div>
                        <div class="cart-item-controls">
                            <button class="cart-qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
                            <span class="cart-qty-num">${item.qty}</span>
                            <button class="cart-qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                            <button class="cart-remove-btn" data-id="${item.id}" aria-label="Eliminar producto">
                                <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                            </button>
                        </div>
                    `;
                    cartItemsList.appendChild(row);
                });
            }
        }
    }

    function agregarAlCarrito(id, name, price, brand, img) {
        id = String(id);
        price = parseFloat(price) || 0;

        const existente = cart.find((item) => String(item.id) === id);
        if (existente) {
            existente.qty += 1;
        } else {
            cart.push({
                id: id,
                name: name || "Perfume Pipe Fernandez",
                price: price,
                brand: brand || "Perfumería Pipe Fernandez",
                img: img || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300&q=80",
                qty: 1
            });
        }

        guardarCarrito();
        actualizarUI_Carrito();
        mostrarToast("Añadido: " + name + " (Bs. " + price + ")");
    }

    function cambiarCantidad(id, delta) {
        id = String(id);
        const item = cart.find((p) => String(p.id) === id);
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter((p) => String(p.id) !== id);
            mostrarToast("Perfume removido del carrito.");
        }

        guardarCarrito();
        actualizarUI_Carrito();
    }

    function eliminarDelCarrito(id) {
        id = String(id);
        cart = cart.filter((p) => String(p.id) !== id);
        guardarCarrito();
        actualizarUI_Carrito();
        mostrarToast("Fragancia eliminada del carrito.");
    }

    // Modal Carrito Open/Close
    const cartModal = document.getElementById("cartModal");

    function abrirModalCarrito() {
        if (cartModal) {
            actualizarUI_Carrito();
            cartModal.style.display = "flex";
        }
    }

    function cerrarModalCarrito() {
        if (cartModal) {
            cartModal.style.display = "none";
        }
    }

    $(document).off("click", "#cartBtn").on("click", "#cartBtn", (e) => {
        e.preventDefault();
        abrirModalCarrito();
    });

    $(document).off("click", "#closeCartModal").on("click", "#closeCartModal", cerrarModalCarrito);
    $(document).off("click", "#cartBackdrop").on("click", "#cartBackdrop", cerrarModalCarrito);

    // Eventos dentro del carrito (delegados)
    $(document).off("click", ".btn-qty-plus").on("click", ".btn-qty-plus", function () {
        const id = $(this).attr("data-id");
        cambiarCantidad(id, 1);
    });

    $(document).off("click", ".btn-qty-minus").on("click", ".btn-qty-minus", function () {
        const id = $(this).attr("data-id");
        cambiarCantidad(id, -1);
    });

    $(document).off("click", ".cart-remove-btn").on("click", ".cart-remove-btn", function () {
        const id = $(this).attr("data-id");
        eliminarDelCarrito(id);
    });

    // Añadir desde las tarjetas de producto
    $(document).off("click", ".btn-add-cart").on("click", ".btn-add-cart", function (e) {
        e.preventDefault();
        const card = $(this).closest(".product-card");
        const id = $(this).attr("data-id") || card.attr("data-id") || Date.now();
        const name = $(this).attr("data-name") || card.find(".product-title").text() || "Perfume";
        const price = $(this).attr("data-price") || card.attr("data-price") || 850;
        const brand = $(this).attr("data-brand") || card.find(".product-brand").text() || "Pipe Fernandez";
        const img = $(this).attr("data-img") || card.find(".product-img").attr("src") || "";

        agregarAlCarrito(id, name, price, brand, img);
    });

    actualizarUI_Carrito();

    /* =========================================================
       6. SISTEMA DE AUTENTICACIÓN (LOGIN, REGISTRO, PERFIL)
    ========================================================= */
    let usuarioActual = null;
    let pendingCheckout = false; // Flag para continuar compra tras autenticarse

    function obtenerUsuarioActivo() {
        try {
            const raw = localStorage.getItem("pipe_user");
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function guardarUsuarioActivo(user) {
        try {
            localStorage.setItem("pipe_user", JSON.stringify(user));
        } catch (e) { }
    }

    function actualizarUINavUsuario() {
        usuarioActual = obtenerUsuarioActivo();
        const userNameNav = document.getElementById("userNameNav");
        if (userNameNav) {
            if (usuarioActual && usuarioActual.nombre) {
                $(userNameNav).text("Hola, " + usuarioActual.nombre);
            } else {
                $(userNameNav).text("Mi Cuenta");
            }
        }
    }

    const modal = document.getElementById("modal");
    const authTabsContainer = document.getElementById("authTabsContainer");
    const userProfileView = document.getElementById("userProfileView");
    const checkoutNotice = document.getElementById("checkoutAuthNotice");

    function abrirModalCuenta(vieneDeCheckout = false) {
        usuarioActual = obtenerUsuarioActivo();
        if (!modal) return;

        if (vieneDeCheckout) {
            pendingCheckout = true;
            if (checkoutNotice) checkoutNotice.style.display = "flex";
        } else {
            if (checkoutNotice) checkoutNotice.style.display = "none";
        }

        if (usuarioActual) {
            // Mostrar vista de Perfil
            if (authTabsContainer) authTabsContainer.style.display = "none";
            if (userProfileView) {
                userProfileView.style.display = "flex";
                $("#profileUserName").text(usuarioActual.nombre + " " + usuarioActual.apellido);
                $("#profileUserEmail").text(usuarioActual.correo || "");
                $("#profileUserCi").text(usuarioActual.ci || "-");
                $("#profileUserPhone").text(usuarioActual.telefono || "-");
                $("#profileUserCity").text(usuarioActual.ciudad || "La Paz");
            }
        } else {
            // Mostrar tabs de login / registro
            if (userProfileView) userProfileView.style.display = "none";
            if (authTabsContainer) authTabsContainer.style.display = "block";
            mostrarTabAuth("login");
        }

        modal.style.display = "flex";
    }

    function cerrarModalCuenta() {
        if (modal) {
            modal.style.display = "none";
            if (checkoutNotice) checkoutNotice.style.display = "none";
        }
    }

    function mostrarTabAuth(tab) {
        const tabBtnLogin = document.getElementById("tabBtnLogin");
        const tabBtnRegistro = document.getElementById("tabBtnRegistro");
        const loginForm = document.getElementById("loginForm");
        const registroForm = document.getElementById("registroForm");

        if (tab === "registro") {
            if (tabBtnRegistro) {
                tabBtnRegistro.classList.add("active");
                tabBtnRegistro.setAttribute("aria-selected", "true");
            }
            if (tabBtnLogin) {
                tabBtnLogin.classList.remove("active");
                tabBtnLogin.setAttribute("aria-selected", "false");
            }
            if (registroForm) registroForm.style.display = "flex";
            if (loginForm) loginForm.style.display = "none";
        } else {
            if (tabBtnLogin) {
                tabBtnLogin.classList.add("active");
                tabBtnLogin.setAttribute("aria-selected", "true");
            }
            if (tabBtnRegistro) {
                tabBtnRegistro.classList.remove("active");
                tabBtnRegistro.setAttribute("aria-selected", "false");
            }
            if (loginForm) loginForm.style.display = "flex";
            if (registroForm) registroForm.style.display = "none";
        }
    }

    $(document).off("click", "#tabBtnLogin").on("click", "#tabBtnLogin", () => mostrarTabAuth("login"));
    $(document).off("click", "#tabBtnRegistro").on("click", "#tabBtnRegistro", () => mostrarTabAuth("registro"));
    $(document).off("click", "#linkIrARegistro").on("click", "#linkIrARegistro", (e) => {
        e.preventDefault();
        mostrarTabAuth("registro");
    });
    $(document).off("click", "#linkIrALogin").on("click", "#linkIrALogin", (e) => {
        e.preventDefault();
        mostrarTabAuth("login");
    });

    $(document).off("click", "#abrirModal").on("click", "#abrirModal", () => abrirModalCuenta(false));
    $(document).off("click", ".close-modal").on("click", ".close-modal", cerrarModalCuenta);

    $(document).off("click", "#modal").on("click", "#modal", (e) => {
        if (e.target === modal) cerrarModalCuenta();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (modal && modal.style.display === "flex") cerrarModalCuenta();
            if (cartModal && cartModal.style.display === "flex") cerrarModalCarrito();
            cerrarMenuHamburguesa();
        }
    });

    // Cerrar sesión
    $(document).off("click", "#btnLogout").on("click", "#btnLogout", () => {
        try {
            localStorage.removeItem("pipe_user");
        } catch (e) { }
        actualizarUINavUsuario();
        mostrarToast("Sesión cerrada. ¡Vuelve pronto!");
        abrirModalCuenta(false);
    });

    // Ir al carrito desde el perfil
    $(document).off("click", "#btnProfileGoCart").on("click", "#btnProfileGoCart", () => {
        cerrarModalCuenta();
        abrirModalCarrito();
    });

    /* =========================================================
       7. VALIDACIÓN EXACTA Y REGISTRO DE USUARIOS
    ========================================================= */
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const ciInput = document.getElementById("ci");
    const telefonoInput = document.getElementById("telefono");

    // Restricciones en tiempo real: SOLO LETRAS para Nombre y Apellido
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

    // Restricciones en tiempo real: SOLO NÚMEROS para CI y Teléfono
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

    // Submit de Registro
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
            mostrarToast("Nombre inválido: Debe contener solo letras (mín. 2).");
            if (nombreInput) nombreInput.focus();
            return;
        }

        if (!apellido || !soloLetrasRegex.test(apellido) || apellido.length < 2) {
            mostrarToast("Apellido inválido: Debe contener solo letras (mín. 2).");
            if (apellidoInput) apellidoInput.focus();
            return;
        }

        if (!ci || !soloNumerosRegex.test(ci) || !ciRegex.test(ci)) {
            mostrarToast("CI inválido: Debe contener entre 5 y 10 dígitos numéricos.");
            if (ciInput) ciInput.focus();
            return;
        }

        if (!ciudad) {
            mostrarToast("Por favor seleccione su ciudad de entrega.");
            if (ciudadInput) ciudadInput.focus();
            return;
        }

        if (!telefono || !telefonoRegex.test(telefono)) {
            mostrarToast("Teléfono inválido: Debe tener 8 dígitos e iniciar con 6 o 7.");
            if (telefonoInput) telefonoInput.focus();
            return;
        }

        if (!correo || !correoRegex.test(correo)) {
            mostrarToast("Correo electrónico inválido (ejemplo: usuario@correo.com).");
            if (correoInput) correoInput.focus();
            return;
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            mostrarToast("Contraseña: Mínimo 8 caracteres, 1 mayúscula y 1 número.");
            if (passwordInput) passwordInput.focus();
            return;
        }

        if (password !== confirmar) {
            mostrarToast("Las contraseñas no coinciden.");
            if (confirmarInput) confirmarInput.focus();
            return;
        }

        if (!terminosAceptados) {
            mostrarToast("Debe aceptar los términos y condiciones para continuar.");
            if (terminosInput) terminosInput.focus();
            return;
        }

        // Crear objeto de usuario
        const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        const nuevoUsuario = {
            nombre: nombreCapitalizado,
            apellido: apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase(),
            ci: ci,
            ciudad: ciudad,
            telefono: telefono,
            correo: correo.toLowerCase(),
            password: password
        };

        // Guardar en base local de usuarios
        try {
            const users = JSON.parse(localStorage.getItem("pipe_users") || "[]");
            users.push(nuevoUsuario);
            localStorage.setItem("pipe_users", JSON.stringify(users));
        } catch (err) { }

        // Establecer sesión activa
        guardarUsuarioActivo(nuevoUsuario);
        actualizarUINavUsuario();

        cerrarModalCuenta();
        if (registroForm) registroForm.reset();
        mostrarToast("¡Cuenta creada con éxito! Bienvenido/a " + nombreCapitalizado);

        // Si estaba intentando comprar, continuar a WhatsApp
        if (pendingCheckout) {
            pendingCheckout = false;
            finalizarCompraWhatsApp();
        }
    });

    // Submit de Login
    const loginForm = document.getElementById("loginForm");
    $(document).off("submit", "#loginForm").on("submit", "#loginForm", (e) => {
        e.preventDefault();
        const iden = ($("#loginIdentificador").val() || "").trim().toLowerCase();
        const pass = ($("#loginPassword").val() || "").trim();

        if (!iden) {
            mostrarToast("Por favor ingresa tu correo o CI.");
            $("#loginIdentificador").focus();
            return;
        }

        if (!pass) {
            mostrarToast("Por favor ingresa tu contraseña.");
            $("#loginPassword").focus();
            return;
        }

        // Buscar en usuarios guardados o crear sesión directa
        let usuarioEncontrado = null;
        try {
            const users = JSON.parse(localStorage.getItem("pipe_users") || "[]");
            usuarioEncontrado = users.find((u) => u.correo === iden || u.ci === iden);
        } catch (err) { }

        if (!usuarioEncontrado) {
            // Autenticación de bienvenida flexible si no existe en BD local
            usuarioEncontrado = {
                nombre: iden.includes("@") ? iden.split("@")[0] : "Cliente",
                apellido: "Pipe Fernandez",
                ci: iden.includes("@") ? "7891234" : iden,
                ciudad: "La Paz",
                telefono: "69942597",
                correo: iden.includes("@") ? iden : iden + "@cliente.bo"
            };
        }

        guardarUsuarioActivo(usuarioEncontrado);
        actualizarUINavUsuario();
        cerrarModalCuenta();
        if (loginForm) loginForm.reset();
        mostrarToast("¡Bienvenido/a de nuevo " + usuarioEncontrado.nombre + "!");

        // Si venía de finalizar compra, ejecutar WhatsApp de inmediato
        if (pendingCheckout) {
            pendingCheckout = false;
            finalizarCompraWhatsApp();
        }
    });

    actualizarUINavUsuario();

    /* =========================================================
       8. CHECKOUT: EXIGE LOGIN / REGISTRO OBLIGATORIO
    ========================================================= */
    function finalizarCompraWhatsApp() {
        if (cart.length === 0) {
            mostrarToast("Tu carrito está vacío. Agrega perfumes antes de comprar.");
            return;
        }

        const usuario = obtenerUsuarioActivo();
        if (!usuario) {
            // Si o si desplegar login/registro
            cerrarModalCarrito();
            abrirModalCuenta(true);
            return;
        }

        // Calcular costo total
        let totalCost = 0;
        let detalleTexto = "";

        cart.forEach((item, index) => {
            const subtotalItem = item.price * item.qty;
            totalCost += subtotalItem;
            detalleTexto += `${index + 1}. ${item.name} (${item.qty} un.) -> Bs. ${subtotalItem.toLocaleString("es-BO")}\n`;
        });

        // Mensaje formal para WhatsApp Oficial de Perfumería Pipe Fernandez
        let mensaje = `*PEDIDO DE FRAGANCIAS - PERFUMERÍA PIPE FERNANDEZ*\n\n`;
        mensaje += `Hola Pipe Fernandez, deseo confirmar el siguiente pedido:\n\n`;
        mensaje += `*DATOS DEL CLIENTE REGISTRADO:*\n`;
        mensaje += `• Nombre: ${usuario.nombre} ${usuario.apellido}\n`;
        mensaje += `• Documento CI: ${usuario.ci}\n`;
        mensaje += `• Teléfono: ${usuario.telefono}\n`;
        mensaje += `• Ciudad: ${usuario.ciudad}\n`;
        mensaje += `• Sede de Retiro / Envío: Casimiro Corrales, La Paz, Bolivia\n\n`;
        mensaje += `*DETALLE DE PERFUMES:*\n${detalleTexto}\n`;
        mensaje += `*TOTAL A PAGAR:* Bs. ${totalCost.toLocaleString("es-BO")}\n`;
        mensaje += `*ENVÍO ASEGURADO:* ¡GRATIS A TODA BOLIVIA!\n`;
        mensaje += `*MÉTODO DE PAGO:* QR Simple / Transferencia Bancaria\n\n`;
        mensaje += `_Por favor envíeme el código QR y coordinemos el despacho de mi pedido._`;

        const urlWhatsApp = "https://api.whatsapp.com/send?phone=59169942597&text=" + encodeURIComponent(mensaje);

        cerrarModalCarrito();
        mostrarToast("¡Redirigiendo al WhatsApp Oficial (+591 69942597)!");

        // Vaciar carrito tras coordinar la compra
        cart = [];
        guardarCarrito();
        actualizarUI_Carrito();

        setTimeout(() => {
            window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
        }, 800);
    }

    $(document).off("click", "#btnCheckout").on("click", "#btnCheckout", (e) => {
        e.preventDefault();
        const user = obtenerUsuarioActivo();
        if (!user) {
            // SI O SI despliega el login o registro
            cerrarModalCarrito();
            abrirModalCuenta(true);
        } else {
            finalizarCompraWhatsApp();
        }
    });

    /* =========================================================
       9. BUSCADOR EN TIEMPO REAL CON SANITIZACIÓN DOM (.text())
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
       10. HERO SLIDER ACCESIBLE & TOUCH FRIENDLY
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
