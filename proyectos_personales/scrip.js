document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       MENÚ HAMBURGUESA
    ========================== */

    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");

    function cerrarMenu() {
        if (menu && menu.classList.contains("active")) {
            menu.classList.remove("active");
            if (hamburger) {
                hamburger.setAttribute("aria-expanded", "false");
                const icon = hamburger.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        }
    }

    if (hamburger && menu) {

        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("active");
            const abierto = menu.classList.contains("active");
            hamburger.setAttribute("aria-expanded", abierto ? "true" : "false");

            const icon = hamburger.querySelector("i");
            if (icon) {
                if (abierto) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Cerrar menú al hacer clic en un enlace
        const menuLinks = menu.querySelectorAll("a");
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                cerrarMenu();
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
                cerrarMenu();
            }
        });

        // Cerrar menú al redimensionar si pasa a pantalla grande
        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) {
                cerrarMenu();
            }
        });

    }

    /* ==========================
       MODO OSCURO / CLARO
    ========================== */

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
                modoBtn.setAttribute("aria-label", "Cambiar a modo claro");
            } else {
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
                modoBtn.setAttribute("title", "Modo Noche");
                modoBtn.setAttribute("aria-label", "Cambiar a modo noche");
            }
        }
    }

    function obtenerTemaGuardado() {
        try {
            return localStorage.getItem("essenza-theme");
        } catch (e) {
            return null;
        }
    }

    function guardarTema(tema) {
        try {
            localStorage.setItem("essenza-theme", tema);
        } catch (e) {
            // Silencioso ante restricciones del navegador
        }
    }

    const temaGuardado = obtenerTemaGuardado();

    if (temaGuardado === "dark") {
        body.classList.add("dark");
        actualizarIconoModo(true);
    } else {
        body.classList.remove("dark");
        actualizarIconoModo(false);
    }

    if (modoBtn) {

        modoBtn.addEventListener("click", () => {

            const esOscuro = body.classList.toggle("dark");

            if (esOscuro) {
                guardarTema("dark");
            } else {
                guardarTema("light");
            }

            actualizarIconoModo(esOscuro);

        });

    }

    /* ==========================
       MODAL REGISTRO
    ========================== */

    const modal =
        document.getElementById("modal");

    const abrirModal =
        document.getElementById("abrirModal");

    const cerrarModal =
        document.querySelector(".close-modal");

    function abrirModalRegistro() {
        cerrarMenu();
        if (modal) modal.style.display = "flex";
    }

    function cerrarModalRegistro() {
        if (modal) modal.style.display = "none";
    }

    if (abrirModal) {
        abrirModal.addEventListener("click", abrirModalRegistro);
    }

    if (cerrarModal) {
        cerrarModal.addEventListener("click", cerrarModalRegistro);
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            cerrarModalRegistro();
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.style.display === "flex") {
            cerrarModalRegistro();
        }
    });

    /* ==========================
       VALIDACIONES FORMULARIO
    ========================== */

    const registroForm = document.getElementById("registroForm");
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const ciInput = document.getElementById("ci");
    const ciudadInput = document.getElementById("ciudad");
    const telefonoInput = document.getElementById("telefono");
    const correoInput = document.getElementById("correo");
    const passwordInput = document.getElementById("password");
    const confirmarInput = document.getElementById("confirmar");
    const terminosInput = document.getElementById("terminos");

    // Restricciones exactas en tiempo real: SOLO LETRAS para Nombre y Apellido
    if (nombreInput) {
        nombreInput.addEventListener("input", () => {
            nombreInput.value = nombreInput.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]/g, "");
        });
    }

    if (apellidoInput) {
        apellidoInput.addEventListener("input", () => {
            apellidoInput.value = apellidoInput.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]/g, "");
        });
    }

    // Restricciones exactas en tiempo real: SOLO NÚMEROS para CI y Teléfono
    if (ciInput) {
        ciInput.addEventListener("input", () => {
            ciInput.value = ciInput.value.replace(/\D/g, "");
        });
    }

    if (telefonoInput) {
        telefonoInput.addEventListener("input", () => {
            telefonoInput.value = telefonoInput.value.replace(/\D/g, "").slice(0, 8);
        });
    }

    if (registroForm) {

        registroForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = nombreInput ? nombreInput.value.trim() : "";
            const apellido = apellidoInput ? apellidoInput.value.trim() : "";
            const ci = ciInput ? ciInput.value.trim() : "";
            const ciudad = ciudadInput ? ciudadInput.value : "";
            const telefono = telefonoInput ? telefonoInput.value.trim() : "";
            const correo = correoInput ? correoInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";
            const confirmar = confirmarInput ? confirmarInput.value : "";
            const terminosAceptados = terminosInput ? terminosInput.checked : true;

            const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;
            const soloNumerosRegex = /^[0-9]+$/;
            const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const telefonoRegex = /^[67][0-9]{7}$/;
            const ciRegex = /^[0-9]{5,10}$/;

            // 1. Validar Nombre (solo letras, mínimo 2 caracteres)
            if (!nombre) {
                alert("Por favor ingrese su nombre.");
                if (nombreInput) nombreInput.focus();
                return;
            }
            if (!soloLetrasRegex.test(nombre) || nombre.length < 2) {
                alert("El nombre debe contener únicamente letras (mínimo 2 letras, sin números ni símbolos).");
                if (nombreInput) nombreInput.focus();
                return;
            }

            // 2. Validar Apellido (solo letras, mínimo 2 caracteres)
            if (!apellido) {
                alert("Por favor ingrese su apellido.");
                if (apellidoInput) apellidoInput.focus();
                return;
            }
            if (!soloLetrasRegex.test(apellido) || apellido.length < 2) {
                alert("El apellido debe contener únicamente letras (mínimo 2 letras, sin números ni símbolos).");
                if (apellidoInput) apellidoInput.focus();
                return;
            }

            // 3. Validar CI (exactamente solo números, entre 5 y 10 dígitos)
            if (!ci) {
                alert("Por favor ingrese su CI.");
                if (ciInput) ciInput.focus();
                return;
            }
            if (!soloNumerosRegex.test(ci) || !ciRegex.test(ci)) {
                alert("El CI debe contener únicamente números (entre 5 y 10 dígitos, sin letras).");
                if (ciInput) ciInput.focus();
                return;
            }

            // 4. Validar Ciudad seleccionada
            if (ciudad === "") {
                alert("Por favor seleccione una ciudad de la lista.");
                if (ciudadInput) ciudadInput.focus();
                return;
            }

            // 5. Validar Teléfono (exactamente 8 números y comenzando con 6 o 7)
            if (!telefono) {
                alert("Por favor ingrese su número de teléfono.");
                if (telefonoInput) telefonoInput.focus();
                return;
            }
            if (!soloNumerosRegex.test(telefono)) {
                alert("El teléfono debe contener únicamente números.");
                if (telefonoInput) telefonoInput.focus();
                return;
            }
            if (!telefonoRegex.test(telefono)) {
                alert("El número de teléfono debe tener exactamente 8 dígitos y comenzar con 6 o 7.");
                if (telefonoInput) telefonoInput.focus();
                return;
            }

            // 6. Validar Correo Electrónico
            if (!correo) {
                alert("Por favor ingrese su correo electrónico.");
                if (correoInput) correoInput.focus();
                return;
            }
            if (!correoRegex.test(correo)) {
                alert("Ingrese un correo electrónico válido (ejemplo: usuario@correo.com).");
                if (correoInput) correoInput.focus();
                return;
            }

            // 7. Validar Contraseña (mínimo 8 caracteres, mayúscula y número)
            if (password.length < 8) {
                alert("La contraseña debe tener mínimo 8 caracteres.");
                if (passwordInput) passwordInput.focus();
                return;
            }
            if (!/[A-Z]/.test(password)) {
                alert("La contraseña debe contener al menos una letra mayúscula.");
                if (passwordInput) passwordInput.focus();
                return;
            }
            if (!/[0-9]/.test(password)) {
                alert("La contraseña debe contener al menos un número.");
                if (passwordInput) passwordInput.focus();
                return;
            }

            // 8. Confirmar que ambas contraseñas coinciden
            if (password !== confirmar) {
                alert("Las contraseñas no coinciden.");
                if (confirmarInput) confirmarInput.focus();
                return;
            }

            // 9. Validar aceptación de términos y condiciones
            if (terminosInput && !terminosAceptados) {
                alert("Debe aceptar los términos y condiciones para crear su cuenta.");
                terminosInput.focus();
                return;
            }

            alert("✅ Cuenta creada correctamente.");
            registroForm.reset();
            if (modal) modal.style.display = "none";
        });

    }

    /* ==========================
       HERO SLIDER SIMPLE
    ========================== */

    const dots =
        document.querySelectorAll(".dot");

    const prevBtn =
        document.querySelector(".prev");

    const nextBtn =
        document.querySelector(".next");

    let currentSlide = 0;

    function updateDots() {

        dots.forEach(dot => {

            dot.classList.remove(
                "active"
            );

        });

        dots[currentSlide]
            .classList.add(
                "active"
            );

    }

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            () => {

                currentSlide++;

                if (
                    currentSlide >=
                    dots.length
                ) {

                    currentSlide = 0;

                }

                updateDots();

            }
        );

    }

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            () => {

                currentSlide--;

                if (
                    currentSlide < 0
                ) {

                    currentSlide =
                        dots.length - 1;

                }

                updateDots();

            }
        );

    }

    dots.forEach((dot, index) => {

        dot.addEventListener(
            "click",
            () => {

                currentSlide = index;

                updateDots();

            }
        );

    });

    /* ==========================
       AUTO SLIDER
    ========================== */

    setInterval(() => {

        currentSlide++;

        if (
            currentSlide >=
            dots.length
        ) {

            currentSlide = 0;

        }

        updateDots();

    }, 5000);

});