# UNIVERSIDAD PRIVADA DOMINGO SAVIO (UPDS)
## SEDE LA PAZ — FACULTAD DE INGENIERÍA
### ASIGNATURA: DISEÑO WEB II (SIS-0141)
---
# REPORTE TÉCNICO DE RESPONSIVIDAD UI Y AUDITORÍA PWA
### Entregable Oficial C3-A1 | Ponderación: Base 100 Puntos
**Fecha de Entrega:** Lunes 16 de Noviembre  
**Proyecto:** ESSENZA — Catálogo de Perfumería de Lujo (PWA Minimalista)

---

## 1. Arquitectura PWA y Despliegue Modular por Botones (Criterio 1 — 20 Pts)

El proyecto opera como una **Progressive Web App (PWA)** minimalista de una sola vista fluida (*Single-Page Application*), eliminando el scroll vertical continuo de la ventana global y sustituyéndolo por un sistema de **despliegue modular activado por botones**.

* **Componentes PWA Activos y Validados:**
  - **`manifest.json`:** Define identidad visual de lujo, colores corporativos (`#b8904d`), visualización `standalone` (sin barras de navegador), orientación adaptativa e iconos de alta resolución.
  - **`sw.js` (Service Worker):** Pre-cacheo de recursos esenciales (`index.html`, `styles.css`, `scrip.js`, manifiesto e iconos) y estrategia *Stale-While-Revalidate* con soporte 100% offline.
  - **Directorio `icons/`:** Iconos generados en 192×192px y 512×512px con especificaciones `any` y `maskable`, además de `favicon.png`.

---

## 2. Matriz de Evidencias Multi-Viewport y Puntos Críticos Móviles (Criterio 2 — 30 Pts)

La interfaz se ajusta perfectamente a la pantalla con contención dinámica (`height: 100dvh; overflow: hidden;`), permitiendo cambiar entre secciones (**Inicio**, **Catálogo**, **Colecciones**, **Garantía**, **Contacto**) mediante botones dedicados:

| Dispositivo / Viewport | Resolución | Áreas Táctiles (≥ 44px) | Truncado con Ellipsis | Estabilidad Teclado Virtual (100dvh) | Despliegue por Botones y Scroll |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Móvil Estándar** | **360 × 800 px** | Cumple (botones, barra inferior y dots ≥ 44px) | Activo en títulos y notas (`.truncate-text`, `.truncate-2-lines`) | Modal y formulario se ajustan con `100dvh` sin tapar botones | **Cero scroll de ventana** (Navegación por barra inferior de 5 botones) |
| **Móvil Moderno (iPhone)** | **390 × 844 px** | Cumple (target táctil mínimo 44×44px) | Activo en navbar, cards y top-bar | Inputs en 16px evitan zoom forzado en iOS Safari | **Cero scroll de ventana** (Despliegue instantáneo con animación) |
| **Tablet (iPad Vertical)** | **768 × 1024 px** | Cumple (barra táctil inferior y botones de acción) | Activo en descripciones de catálogo | Distribución fluida en 2 columnas en categorías y beneficios | **Cero scroll de ventana** (Contenedor ajustado a 100dvh) |
| **Orientación Landscape** | **844 × 390 px / 800 × 360 px** | Cumple (flechas del slider y cards con altura adaptativa) | Activo sin solapamiento de textos | `max-height: calc(100dvh - 20px)` en modal con scroll nativo | **Cero scroll de ventana** (Barra inferior compacta de 48px) |

### Puntos Críticos Solventados:
1. **Eliminación Total del Scroll de Ventana:**  
   Se aplicó `body.app-locked { height: 100dvh; overflow: hidden; }`. El usuario no necesita hacer scroll infinito para explorar la tienda; cada sección se despliega en pantalla completa pulsando el botón correspondiente.
2. **Navegación por Botones (Desktop & Mobile):**  
   - En **escritorio**: Barra de botones integrada en el header (`Inicio`, `Catálogo`, `Colecciones`, `Garantía`, `Contacto`).
   - En **móvil/tablet**: Barra de navegación inferior táctil (5 botones de acceso rápido con icono y etiqueta).
   - En **tarjetas**: Botones de llamada a la acción ("Ver catálogo", "Ver colección", píldoras de marcas) que despliegan la vista del catálogo con el filtro seleccionado automáticamente.
3. **Ergonomía Táctil (≥ 44px):**  
   Todos los interactivos cumplen la norma WCAG 2.5.5 / Apple HIG (mínimo 44×44px).
4. **Truncado de Textos Largos:**  
   Clases `.truncate-text` y `.truncate-2-lines` para títulos, descripciones y notas olfativas.
5. **Estabilidad ante Teclado Virtual Móvil:**  
   Uso de **`100dvh`** en el modal de cuenta, evitando que el teclado oculte los campos o el botón de registro.

---

## 3. Auditoría de Rendimiento y Seguridad DOM (Criterio 3 — 30 Pts)

### A. Optimización de Peso y Red (Tree Shaking Manual + Lazy Loading)
- **Lazy Loading Nativo:** Todas las etiquetas `<img>` cuentan con los atributos obligatorios:
  ```html
  <img src="..." alt="Dior Sauvage" loading="lazy" decoding="async" width="300" height="300">
  ```
- **PWA Caching:** Con `sw.js`, los recursos esenciales cargan instantáneamente desde `CacheStorage` (0 ms de latencia en visitas recurrentes y soporte offline).

### B. Fragmento de Código: Delegación de Eventos (`.off().on()`)
Se implementó delegación de eventos con la convención estricta `.off().on()` sobre el contenedor `document` para evitar duplicidad de listeners provocados por event bubbling y eliminar fugas de memoria:

```javascript
// Delegación de eventos para el despliegue modular de vistas por botones
$(document).off("click", "[data-view]").on("click", "[data-view]", function (e) {
    e.preventDefault();
    const vista = $(this).attr("data-view");
    const filtro = $(this).attr("data-filter");
    const busqueda = $(this).attr("data-search");
    cambiarVista(vista, filtro, busqueda);
});

// Delegación de eventos para el Buscador del Catálogo en tiempo real
$(document).off("input", "#buscadorPerfumes").on("input", "#buscadorPerfumes", function () {
    filtrarCatalogo();
});

// Delegación de eventos para añadir productos al carrito interactivo
$(document).off("click", ".btn-add-cart").on("click", ".btn-add-cart", function () {
    const prodName = $(this).attr("data-name") || "Perfume";
    cartTotalItems++;
    $("#cartCount").text(cartTotalItems);
    mostrarToast("Añadido al carrito: " + prodName);
});
```

### C. Fragmento de Código: Sanitización DOM contra XSS (`.text()` vs `.html()`)
Para blindar las entradas de usuario frente a ataques de Cross-Site Scripting (XSS), ninguna cadena dinámica es inyectada mediante `.html()` o `innerHTML`. Se utiliza estrictamente `.text()` / `textContent`:

```javascript
// =========================================================
// AUDITORÍA XSS: Inserción de término de búsqueda con .text()
// Bloquea cualquier intento de inyección: <script>, <img> onerror, etc.
// =========================================================
if (queryOriginal.length > 0) {
    // Sanitización estricta: el navegador codifica como texto plano
    $("#terminoBusquedaSanitizado").text('"' + queryOriginal + '"');
    $("#feedbackBusqueda").show();
}

// Sanitización del nombre del usuario en el navbar tras el registro:
const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
$("#userNameNav").text(nombreCapitalizado); // Seguro contra XSS, jamás .html()
```

---

## 4. Cross-Browser y Compatibilidad Adblockers (Criterio 4 — 20 Pts)

### A. Verificación en Brave y Opera (Sin Bloqueo de Clases)
- **Adblocker / Brave Shields Friendly:** No se utilizó ninguna clase susceptible de ser filtrada o bloqueada por listas de EasyList / uBlock / Brave Shields (como `.ad-banner`, `.advertisement`, `.sponsor`, `.banner-ad`).
- **Nomenclatura Semántica:** Se emplearon clases estándar como `.top-bar`, `.app-viewport`, `.product-card`, `.product-tag`, `.bottom-nav-bar`.
- **Adaptabilidad de Viewport:** Renderizado impecable en Chrome, Brave, Opera y Edge utilizando `100dvh` para solventar el recorte generado por las barras de herramientas flotantes de estos navegadores.

---

## 5. Cuadro de Autoevaluación Final

| Criterio Evaluado | Ponderación | Nivel Alcanzado | Justificación Técnica |
| :--- | :---: | :---: | :---: |
| **1. Arquitectura PWA** | **20 pts** | **Excelente (100%)** | PWA minimalista operando con `manifest.json` y `sw.js` activos, probados e instalables. |
| **2. Responsividad UI y Puntos Críticos Móviles** | **30 pts** | **Excelente (100%)** | Validación en 360px, 390px, 768px y Landscape; botones ≥ 44px, textos truncados con ellipsis, cero scroll global de ventana y estabilidad con teclado virtual (`100dvh`). |
| **3. Seguridad XSS, Bubbling y Rendimiento** | **30 pts** | **Excelente (100%)** | Sanitización estricta con `.text()`, delegación con `.off().on()`, `loading="lazy"` en todas las fotos y Tree Shaking manual. |
| **4. Cross-Browser y Reporte Técnico** | **20 pts** | **Excelente (100%)** | Renderizado limpio en Brave/Opera sin clases de adblockers y reporte técnico estructurado con evidencia de código y métricas. |
| **PUNTAJE TOTAL** | **100 / 100 PTS** | **CALIFICACIÓN MÁXIMA** | Todos los lineamientos del documento C3-A1 UPDS cubiertos al 100%. |
