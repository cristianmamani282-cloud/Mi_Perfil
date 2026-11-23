/**
 * POLLOS YACK'S (POLLOS JACK) - LÓGICA DE APLICACIÓN (VERSIÓN 2)
 * SPA PWA: Navegación de vistas por botones (Sin scroll de ventana),
 * Modo Oscuro/Claro, Modo Offline y Checkout por WhatsApp.
 */

// =============================================================================
// Configuración Global y Storage
// =============================================================================
const CONFIG = {
  API_URL: 'http://localhost:3000/api/v1',
  WHATSAPP_PHONE: '59177725603',
  FALLBACK_IMAGE: 'https://assets.olaclick.app/companies/products/images/800/f07b0bca-f313-4008-bb21-fe6c2c162ac5.jpg',
  STORAGE_THEME_KEY: 'pollos_yacks_theme',
  STORAGE_CART_KEY: 'pollos_yacks_cart',
  STORAGE_TOKEN_KEY: 'pollos_yacks_token',
  STORAGE_USER_KEY: 'pollos_yacks_user',
  STORAGE_ORDERS_KEY: 'pollos_yacks_local_orders',
};

// =============================================================================
// Datos Iniciales (Catálogo Completo Integrado para Modo Offline)
// =============================================================================
const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 1, name: 'Pollos a la Canasta' },
  { id: 2, name: 'Salchis' },
  { id: 3, name: 'Hamburguesas' },
  { id: 4, name: 'Combos para Compartir' },
  { id: 5, name: 'Bebidas' },
];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    categoryId: 1,
    name: 'Pierna con Entrepierna',
    desc: '1/4 de pollo pierna con entrepierna, papas fritas crocantes y plátano frito tradicional.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80',
    badge: 'Pollo a la Canasta',
  },
  {
    id: 2,
    categoryId: 1,
    name: 'Ala con Pecho',
    desc: '1/4 de pollo ala con pecho jugoso, porción de papas fritas y plátano frito.',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    badge: 'Pollo a la Canasta',
  },
  {
    id: 3,
    categoryId: 2,
    name: 'Salchicarne',
    desc: 'Salchicha picada, carne de res picada, papas fritas crocantes y plátano con salsas de la casa.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80',
    badge: 'Salchis',
  },
  {
    id: 4,
    categoryId: 2,
    name: 'Salchipapa Tradicional',
    desc: 'Salchipapa clásica con abundante porción de papas fritas doradas y plátano frito.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    badge: 'Salchis',
  },
  {
    id: 5,
    categoryId: 3,
    name: 'Hamburguesa Simple',
    desc: 'Carne jugosa, queso fundido, tomate fresco, lechuga, morrón, pepinillo y papas fritas.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    badge: 'Hamburguesas',
  },
  {
    id: 6,
    categoryId: 3,
    name: 'Hamburguesa Mixta',
    desc: 'Carne a la plancha, queso, salchicha doradita, lechuga, tomate y papas fritas.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    badge: 'Hamburguesas',
  },
  {
    id: 7,
    categoryId: 3,
    name: 'Hamburguesa Especial',
    desc: 'Carne artesanal, queso, jamón ahumado, tocino crocante, aderezos y papas.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
    badge: 'Hamburguesas',
  },
  {
    id: 8,
    categoryId: 3,
    name: "Hamburguesa Yack's",
    desc: '2 piezas de carne, queso, jamón, tocino, huevo frito, tomate, lechuga, morrón y papas.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?auto=format&fit=crop&w=600&q=80',
    badge: 'Hamburguesas',
  },
  {
    id: 9,
    categoryId: 4,
    name: 'Combo Individual',
    desc: '1/4 pierna con entrepierna o ala con pecho + Papas + 1 Coca-Cola 500ml fría.',
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    badge: 'Combos',
  },
  {
    id: 10,
    categoryId: 4,
    name: 'Combo Canasta Familiar',
    desc: '6 piernas y entrepiernas crocantes + 1 porción grande de papas + 1 Coca-Cola 2L.',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1527477378408-1bc097a877e3?auto=format&fit=crop&w=600&q=80',
    badge: 'Combos',
  },
  {
    id: 11,
    categoryId: 4,
    name: 'Combo Canasta 2 (10 Presas)',
    desc: '10 presas seleccionadas (5 entrepiernas y 5 piernas) + 2 porciones de papas + Coca-Cola 2L.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80',
    badge: 'Combos',
  },
  {
    id: 12,
    categoryId: 4,
    name: 'Combo para Dos (Pollo)',
    desc: '1/4 ala con pecho + 1/4 pierna con entrepierna + Papas + 1 Coca-Cola 2L.',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    badge: 'Combos',
  },
  {
    id: 13,
    categoryId: 4,
    name: 'Combo para Dos (Pollo & Burger)',
    desc: '1/4 ala con pecho + 1 Hamburguesa Especial + Papas + Coca-Cola 2L.',
    price: 48.00,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    badge: 'Combos',
  },
  {
    id: 14,
    categoryId: 4,
    name: 'Combo Amigos 1 (4 Cuartos)',
    desc: 'Dos 1/4 ala con pecho + dos 1/4 pierna con entrepierna + Doble porción de papas + Coca-Cola 2L.',
    price: 102.00,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80',
    badge: 'Combos',
  },
  {
    id: 15,
    categoryId: 4,
    name: 'Combo Amigos 3 (4 Burgers)',
    desc: "4 Hamburguesas completas Yack's + Papas fritas + 1 Coca-Cola 2L.",
    price: 96.00,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    badge: 'Combos',
  },
  {
    id: 16,
    categoryId: 5,
    name: 'Gaseosa Coca-Cola 2Lt',
    desc: 'Gaseosa tamaño familiar bien fría para acompañar tu banquete.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    badge: 'Bebidas',
  },
  {
    id: 17,
    categoryId: 5,
    name: 'Gaseosa Coca-Cola 500ml',
    desc: 'Botella personal ideal para disfrutar con tu combo individual.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
    badge: 'Bebidas',
  },
];

const DEFAULT_BRANCHES = [
  {
    id: 1,
    name: 'Casa Matriz Sopocachi',
    tag: 'Sucursal Principal',
    icon: 'fa-house-chimney',
    address: 'Av. Jaimes Freyre N.º 2236, frente a la calle Juan Manuel Cáceres.',
    phone: '77725603',
    schedule: '12:00 - 21:30 (Lunes a Domingo)',
    mapUrl: 'https://maps.google.com/?q=Av.+Jaimes+Freyre+2236,+La+Paz',
  },
  {
    id: 2,
    name: 'Sucursal Camacho',
    tag: 'Centro de La Paz',
    icon: 'fa-store',
    address: 'Plaza de comidas "La Jungla", subsuelo del Mercado Camacho.',
    phone: '77725603',
    schedule: '12:00 - 21:30 (Lunes a Domingo)',
    mapUrl: 'https://maps.google.com/?q=Mercado+Camacho,+La+Paz',
  },
  {
    id: 3,
    name: 'Sucursal Vita',
    tag: 'Zona Comercial',
    icon: 'fa-building',
    address: 'Galería Comercial Génesis, Av. Buenos Aires N.º 436, frente al Puente Vita.',
    phone: '77725603',
    schedule: '12:00 - 21:30 (Lunes a Domingo)',
    mapUrl: 'https://maps.google.com/?q=Av.+Buenos+Aires+436,+La+Paz',
  },
  {
    id: 4,
    name: 'Zona Sur - Montenegro',
    tag: 'San Miguel / Calacoto',
    icon: 'fa-utensils',
    address: 'Av. Montenegro N.º 1323, Zona Sur.',
    phone: '77725603',
    schedule: '12:00 - 21:30 (Lunes a Domingo)',
    mapUrl: 'https://maps.google.com/?q=Av.+Montenegro+1323,+La+Paz',
  },
  {
    id: 5,
    name: 'Zona Sur - Achumani',
    tag: 'Nueva Sucursal',
    icon: 'fa-sparkles',
    address: 'Av. García Lanza N.º 300, Achumani.',
    phone: '77725603',
    schedule: '12:00 - 21:30 (Lunes a Domingo)',
    mapUrl: 'https://maps.google.com/?q=Av.+Garcia+Lanza+300,+La+Paz',
  },
  {
    id: 6,
    name: 'Sucursal El Alto',
    tag: '12 de Octubre',
    icon: 'fa-mountain-city',
    address: 'Calle Raúl Salmón N.º 217, zona 12 de Octubre, El Alto.',
    phone: '77725603',
    schedule: '12:00 - 21:30 (Lunes a Domingo)',
    mapUrl: 'https://maps.google.com/?q=Calle+Raul+Salmon+217,+El+Alto',
  },
  {
    id: 7,
    name: 'Sucursal Miraflores',
    tag: 'Cerca al Monumento',
    icon: 'fa-landmark',
    address: 'Av. Busch N.º 1314, cerca del monumento.',
    phone: '77725603',
    schedule: '12:00 - 21:30 (Lunes a Domingo)',
    mapUrl: 'https://maps.google.com/?q=Av.+Busch+1314,+La+Paz',
  },
];

const DEFAULT_REVIEWS = [
  {
    text: '"El pollo a la canasta de Pollos Jack en Sopocachi es insuperable. Siempre jugosito, las papas en su punto y las salsas deliciosas. Vengo desde que era niño."',
    stars: 5,
    initials: 'MC',
    name: 'Marcelo Condori',
    branch: 'Cliente Sopocachi',
  },
  {
    text: '"La promoción de añadir Bs 1 por un octavo más es excelente. Muy buenas porciones para el precio. La sucursal de la Montenegro súper rápida."',
    stars: 4.5,
    initials: 'SP',
    name: 'Sofía Paredes',
    branch: 'Cliente Zona Sur',
  },
  {
    text: '"Las hamburguesas mixtas y las salchicarnes son geniales para comer al paso. Muy buena atención en la sucursal de la calle Raúl Salmón en El Alto."',
    stars: 5,
    initials: 'RQ',
    name: 'Ramiro Quispe',
    branch: 'Cliente El Alto',
  },
];

// =============================================================================
// Estado de la Aplicación
// =============================================================================
let state = {
  currentView: 'inicio',
  theme: localStorage.getItem(CONFIG.STORAGE_THEME_KEY) || 'light',
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS,
  branches: DEFAULT_BRANCHES,
  selectedCategory: 'all',
  searchQuery: '',
  cart: JSON.parse(localStorage.getItem(CONFIG.STORAGE_CART_KEY) || '[]'),
  user: JSON.parse(localStorage.getItem(CONFIG.STORAGE_USER_KEY) || 'null'),
  token: localStorage.getItem(CONFIG.STORAGE_TOKEN_KEY) || null,
  selectedBranchId: 1,
  orderType: 'Delivery',
  metodoPago: 'Efectivo',
  orders: JSON.parse(localStorage.getItem(CONFIG.STORAGE_ORDERS_KEY) || '[]'),
  authTab: 'login',
};

// =============================================================================
// NAVEGACIÓN ENTRE PANTALLAS (SIN SCROLL GLOBAL)
// =============================================================================
function showView(viewName) {
  // Ocultar todas las pantallas
  document.querySelectorAll('.view-screen').forEach((screen) => {
    screen.classList.remove('active');
  });

  // Mostrar la pantalla seleccionada
  const targetScreen = document.getElementById(`view-${viewName}`);
  if (targetScreen) {
    targetScreen.classList.add('active');
    targetScreen.scrollTop = 0; // Reiniciar scroll interno de la vista activa
    state.currentView = viewName;
  }

  // Actualizar botones de navegación de la barra superior (Navbar)
  document.querySelectorAll('.nav-tab-btn').forEach((btn) => {
    const isActive = btn.getAttribute('data-view') === viewName;
    btn.classList.toggle('active', isActive);
    if (isActive) {
      // Auto-centrar botón activo en barra horizontal (ideal para móviles)
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
}

// =============================================================================
// MODO OSCURO / MODO CLARO
// =============================================================================
function initTheme() {
  const saved = localStorage.getItem(CONFIG.STORAGE_THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(CONFIG.STORAGE_THEME_KEY, theme);

  const themeIcon = document.getElementById('theme-icon');
  const themeMeta = document.getElementById('theme-color-meta');

  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  if (themeMeta) {
    themeMeta.setAttribute('content', theme === 'dark' ? '#090D16' : '#FF7B00');
  }
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

// =============================================================================
// PWA Y DETECCIÓN DE MODO OFFLINE
// =============================================================================
function initPWA() {
  // Registrar Service Worker para soporte PWA y Offline
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.protocol === 'http:')) {
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => console.log('Service Worker registrado con éxito:', reg.scope))
      .catch((err) => console.warn('Service Worker no se pudo registrar:', err));
  }

  // Monitoreo de estado Online / Offline
  function updateOnlineStatus() {
    const banner = document.getElementById('offline-banner');
    if (!banner) return;
    if (!navigator.onLine) {
      banner.classList.add('active');
    } else {
      banner.classList.remove('active');
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

// =============================================================================
// Sincronización Backend (Opcional si API está activa)
// =============================================================================
async function syncWithBackend() {
  try {
    const [catRes, prodRes, branchRes] = await Promise.all([
      fetch(`${CONFIG.API_URL}/categorias`),
      fetch(`${CONFIG.API_URL}/productos`),
      fetch(`${CONFIG.API_URL}/sucursales`),
    ]);

    if (catRes.ok && prodRes.ok && branchRes.ok) {
      const catData = await catRes.json();
      const prodData = await prodRes.json();
      const branchData = await branchRes.json();

      if (catData.success && Array.isArray(catData.data)) {
        state.categories = [
          { id: 'all', name: 'Todos' },
          ...catData.data.filter((c) => c.estado).map((c) => ({ id: c.id_categoria, name: c.nombre })),
        ];
        renderCategoryButtons();
      }

      if (prodData.success && Array.isArray(prodData.data)) {
        state.products = prodData.data.filter((p) => p.estado).map((p) => ({
          id: p.id_producto,
          categoryId: p.id_categoria,
          name: p.nombre,
          desc: p.descripcion || '',
          price: Number(p.precio),
          image: p.imagen || CONFIG.FALLBACK_IMAGE,
          badge: p.categoria ? p.categoria.nombre : 'Plato',
        }));
        renderProducts();
      }

      if (branchData.success && Array.isArray(branchData.data)) {
        state.branches = branchData.data.filter((b) => b.estado).map((b) => {
          const match = DEFAULT_BRANCHES.find((d) => d.name.toLowerCase().includes(b.nombre.toLowerCase()));
          return {
            id: b.id_sucursal,
            name: b.nombre,
            tag: b.ciudad || 'La Paz',
            icon: match ? match.icon : 'fa-store',
            address: b.direccion,
            phone: match ? match.phone : '77725603',
            schedule: match ? match.schedule : '12:00 - 21:30 (Lunes a Domingo)',
            mapUrl: match ? match.mapUrl : null,
          };
        });
        renderBranches();
        renderBranchSelect();
      }
    }
  } catch (err) {
    console.info('Modo offline: catálogo y sucursales precargadas activas.');
  }
}

// =============================================================================
// Renderizado del Menú Digital
// =============================================================================
function renderCategoryButtons() {
  const container = document.getElementById('menu-categories');
  if (!container) return;

  container.innerHTML = state.categories
    .map(
      (cat) => `
      <button 
        class="filter-btn ${state.selectedCategory === cat.id ? 'active' : ''}" 
        onclick="selectCategory('${cat.id}')">
        ${cat.name}
      </button>
    `,
    )
    .join('');
}

function selectCategory(catId) {
  state.selectedCategory = catId === 'all' ? 'all' : Number(catId);
  renderCategoryButtons();
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const query = state.searchQuery.toLowerCase().trim();
  const filtered = state.products.filter((p) => {
    const matchesCategory = state.selectedCategory === 'all' || p.categoryId === state.selectedCategory;
    const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fa-solid fa-face-frown fs-1 text-muted mb-3"></i>
        <h4 class="text-secondary">No encontramos platos con esa búsqueda</h4>
        <p class="text-muted">Intenta buscando 'pollo', 'hamburguesa' o 'salchipapa'</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (product) => `
      <div class="col-md-6 col-lg-4">
        <div class="food-card">
          <div class="food-img-container">
            <img src="${product.image}" alt="${product.name}" class="food-img" loading="lazy" onerror="this.src='${CONFIG.FALLBACK_IMAGE}'" />
            <span class="food-badge">${product.badge}</span>
          </div>
          <div class="food-body">
            <h3 class="food-title">${product.name}</h3>
            <p class="food-desc">${product.desc}</p>
            <div class="food-footer">
              <span class="food-price">Bs ${product.price.toFixed(2)}</span>
              <button class="btn-add-cart" onclick="addProductToCart(${product.id})">
                <i class="fa-solid fa-plus me-1"></i> Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    )
    .join('');
}

function onSearchInput(event) {
  state.searchQuery = event.target.value;
  renderProducts();
}

// =============================================================================
// Renderizado de Sucursales
// =============================================================================
function renderBranches() {
  const grid = document.getElementById('branches-grid');
  if (!grid) return;

  grid.innerHTML = state.branches
    .map(
      (branch) => `
      <div class="col-md-6 col-lg-4">
        <div class="branch-card">
          <div class="branch-header">
            <div class="branch-icon-box"><i class="fa-solid ${branch.icon}"></i></div>
            <div>
              <h3 class="branch-name">${branch.name}</h3>
              <span class="branch-tag">${branch.tag}</span>
            </div>
          </div>
          <ul class="branch-info-list">
            <li><i class="fa-solid fa-location-dot"></i> ${branch.address}</li>
            <li><i class="fa-solid fa-clock"></i> ${branch.schedule}</li>
            <li><i class="fa-solid fa-phone"></i> Contacto: ${branch.phone}</li>
          </ul>
          <div class="branch-actions">
            ${
              branch.mapUrl
                ? `<a href="${branch.mapUrl}" target="_blank" rel="noopener" class="btn-branch-map">
                    <i class="fa-solid fa-map-location-dot me-1"></i> Ver en Mapa
                  </a>`
                : ''
            }
            <a href="tel:${branch.phone}" class="btn-branch-call">
              <i class="fa-solid fa-phone me-1"></i> Llamar
            </a>
          </div>
        </div>
      </div>
    `,
    )
    .join('');
}

function renderBranchSelect() {
  const select = document.getElementById('cart-branch-select');
  if (!select) return;

  select.innerHTML = state.branches
    .map(
      (b) => `
      <option value="${b.id}" ${b.id === state.selectedBranchId ? 'selected' : ''}>${b.name}</option>
    `,
    )
    .join('');
}

// =============================================================================
// Renderizado de Reseñas
// =============================================================================
function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;

  grid.innerHTML = DEFAULT_REVIEWS
    .map((r) => {
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        if (r.stars >= i) {
          starsHtml += '<i class="fa-solid fa-star"></i> ';
        } else if (r.stars >= i - 0.5) {
          starsHtml += '<i class="fa-solid fa-star-half-stroke"></i> ';
        } else {
          starsHtml += '<i class="fa-regular fa-star"></i> ';
        }
      }

      return `
        <div class="col-md-4">
          <div class="review-card">
            <div class="review-stars">${starsHtml}</div>
            <p class="review-text">${r.text}</p>
            <div class="review-author">
              <div class="author-avatar">${r.initials}</div>
              <div>
                <h4 class="author-name">${r.name}</h4>
                <span class="author-branch">${r.branch}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

// =============================================================================
// Carrito de Compras & Offline Storage
// =============================================================================
function saveCart() {
  localStorage.setItem(CONFIG.STORAGE_CART_KEY, JSON.stringify(state.cart));
  updateCartUI();
}

function addProductToCart(productId) {
  const prod = state.products.find((p) => p.id === productId);
  if (!prod) return;

  const existing = state.cart.find((item) => item.id === prod.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      qty: 1,
      image: prod.image,
    });
  }

  saveCart();
  openCart();
}

function addPromoToCart(name, price) {
  const promoId = 'promo_' + name.replace(/\s+/g, '_');
  const existing = state.cart.find((item) => item.id === promoId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: promoId,
      name: name,
      price: price,
      qty: 1,
      image: CONFIG.FALLBACK_IMAGE,
    });
  }

  saveCart();
  openCart();
}

function changeItemQty(index, delta) {
  if (!state.cart[index]) return;
  state.cart[index].qty += delta;

  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
  }

  saveCart();
}

function removeItemFromCart(index) {
  if (!state.cart[index]) return;
  state.cart.splice(index, 1);
  saveCart();
}

function openCart() {
  document.getElementById('cart-backdrop')?.classList.add('show');
  document.getElementById('cart-offcanvas')?.classList.add('show');

  // Si el usuario tiene sesión activa, pre-llenar datos de contacto si están vacíos
  if (state.user) {
    const nameInput = document.getElementById('order-customer-name');
    const phoneInput = document.getElementById('order-customer-phone');
    if (nameInput && !nameInput.value.trim()) {
      const full = `${state.user.nombre || ''} ${state.user.apellido || ''}`.trim();
      nameInput.value = sanitizeLettersOnly(full);
    }
    if (phoneInput && !phoneInput.value.trim() && state.user.telefono) {
      phoneInput.value = sanitizeNumbersOnly(state.user.telefono);
    }
  }
}

function closeCart() {
  document.getElementById('cart-backdrop')?.classList.remove('show');
  document.getElementById('cart-offcanvas')?.classList.remove('show');
}

function updateCartUI() {
  const totalQty = state.cart.reduce((sum, it) => sum + it.qty, 0);
  const totalPrice = state.cart.reduce((sum, it) => sum + it.price * it.qty, 0);

  // Insignia en navbar desktop
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = totalQty;

  // Insignia en barra móvil inferior
  const bottomBadge = document.getElementById('bottom-cart-badge');
  if (bottomBadge) {
    bottomBadge.textContent = totalQty;
    bottomBadge.style.display = totalQty > 0 ? 'flex' : 'none';
  }

  // Total a pagar
  const totalElem = document.getElementById('cart-total-price');
  if (totalElem) totalElem.textContent = `Bs ${totalPrice.toFixed(2)}`;

  // Lista de items
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="text-center text-muted py-5">
        <i class="fa-solid fa-basket-shopping fs-1 mb-3 text-secondary"></i>
        <p class="mb-0">Tu carrito está vacío</p>
        <small>¡Añade tus platos favoritos del menú!</small>
      </div>
    `;
    return;
  }

  container.innerHTML = state.cart
    .map(
      (item, idx) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='${CONFIG.FALLBACK_IMAGE}'" />
        <div class="flex-grow-1">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">Bs ${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="btn-qty" onclick="changeItemQty(${idx}, -1)">-</button>
            <span class="fw-bold px-2">${item.qty}</span>
            <button class="btn-qty" onclick="changeItemQty(${idx}, 1)">+</button>
          </div>
        </div>
        <button class="btn-remove-item" onclick="removeItemFromCart(${idx})" aria-label="Eliminar">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `,
    )
    .join('');
}

function onOrderTypeChange(type) {
  state.orderType = type;
  const addressContainer = document.getElementById('delivery-address-container');
  if (addressContainer) {
    addressContainer.style.display = type === 'Delivery' ? 'block' : 'none';
  }
}

function onBranchChange(event) {
  state.selectedBranchId = Number(event.target.value);
}

function onMetodoPagoChange(event) {
  state.metodoPago = event.target.value;
}

// =============================================================================
// Enviar por WhatsApp / Pedido Online
// =============================================================================
function sendWhatsAppOrder() {
  if (state.cart.length === 0) {
    alert('Tu carrito está vacío. Añade productos antes de enviar tu pedido.');
    return;
  }

  const custNameInput = document.getElementById('order-customer-name');
  const custPhoneInput = document.getElementById('order-customer-phone');
  const custName = custNameInput?.value.trim() || '';
  const custPhone = custPhoneInput?.value.trim() || '';

  // Validaciones estrictas: Solo letras en nombre
  if (custName && !isValidLetters(custName)) {
    showFieldFeedback(custNameInput, false, 'El nombre solo debe contener letras');
    alert('El nombre del cliente solo debe contener letras.');
    custNameInput?.focus();
    return;
  }

  // Validaciones estrictas: Solo números en teléfono
  if (custPhone && !isValidNumbers(custPhone)) {
    showFieldFeedback(custPhoneInput, false, 'El teléfono solo debe contener números');
    alert('El teléfono de contacto solo debe contener números.');
    custPhoneInput?.focus();
    return;
  }

  const selectedBranch = state.branches.find((b) => b.id === state.selectedBranchId);
  const branchName = selectedBranch ? selectedBranch.name : 'Sucursal Sopocachi';

  let message = "*¡Hola Pollos Yack's! Quisiera realizar el siguiente pedido:*\n\n";

  if (custName) {
    message += `👤 *Cliente:* ${custName}\n`;
  }
  if (custPhone) {
    message += `📱 *Teléfono:* ${custPhone}\n`;
  }
  if (custName || custPhone) {
    message += `\n`;
  }

  let total = 0;
  state.cart.forEach((item, index) => {
    const sub = item.price * item.qty;
    total += sub;
    message += `*${index + 1}.* ${item.qty}x ${item.name} -> Bs ${sub.toFixed(2)}\n`;
  });

  message += `\n📍 *Sucursal Seleccionada:* ${branchName}`;
  message += `\n🛵 *Tipo de Servicio:* ${state.orderType}`;
  if (state.orderType === 'Delivery') {
    const address = document.getElementById('delivery-address')?.value || '';
    const ref = document.getElementById('delivery-ref')?.value || '';
    if (address) message += `\n🏠 *Dirección:* ${address}`;
    if (ref) message += ` (${ref})`;
  }
  message += `\n💳 *Método de Pago:* ${state.metodoPago}`;

  const obs = document.getElementById('order-observation')?.value || '';
  if (obs.trim()) message += `\n📝 *Observación:* ${obs.trim()}`;

  message += `\n💰 *TOTAL A PAGAR:* Bs ${total.toFixed(2)}`;
  message += `\n\n¡Quedo atento a la confirmación de mi pedido! Gracias.`;

  window.open(`https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
}

async function placeOrder() {
  if (state.cart.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  if (!state.user) {
    openAuthModal('login');
    return;
  }

  const errorBox = document.getElementById('cart-error-msg');
  const successBox = document.getElementById('cart-success-msg');
  const btn = document.getElementById('btn-confirm-order');

  if (errorBox) errorBox.style.display = 'none';
  if (successBox) successBox.style.display = 'none';

  const custNameInput = document.getElementById('order-customer-name');
  const custPhoneInput = document.getElementById('order-customer-phone');
  const custName = custNameInput?.value.trim() || '';
  const custPhone = custPhoneInput?.value.trim() || '';

  if (custName && !isValidLetters(custName)) {
    if (errorBox) {
      errorBox.textContent = 'El nombre del cliente solo debe contener letras.';
      errorBox.style.display = 'block';
    }
    showFieldFeedback(custNameInput, false, 'Solo se permiten letras');
    custNameInput?.focus();
    return;
  }

  if (custPhone && !isValidNumbers(custPhone)) {
    if (errorBox) {
      errorBox.textContent = 'El teléfono de contacto solo debe contener números.';
      errorBox.style.display = 'block';
    }
    showFieldFeedback(custPhoneInput, false, 'Solo se permiten números');
    custPhoneInput?.focus();
    return;
  }

  if (state.orderType === 'Delivery') {
    const address = document.getElementById('delivery-address')?.value || '';
    if (!address.trim()) {
      if (errorBox) {
        errorBox.textContent = 'Por favor completa tu dirección para entrega a domicilio.';
        errorBox.style.display = 'block';
      }
      return;
    }
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Procesando...';
  }

  const totalPrice = state.cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const newOrderId = Math.floor(1000 + Math.random() * 9000);
  const branchObj = state.branches.find((b) => b.id === state.selectedBranchId);

  const localOrder = {
    id_pedido: newOrderId,
    fecha_pedido: new Date().toISOString(),
    sucursal: { nombre: branchObj ? branchObj.name : 'Sopocachi' },
    id_direccion: state.orderType === 'Delivery' ? 1 : null,
    estadoPedido: { nombre: 'Pendiente' },
    pago: {
      metodo_pago: state.metodoPago,
      estado: 'Pendiente',
      monto: totalPrice,
    },
    observacion: document.getElementById('order-observation')?.value || '',
  };

  try {
    if (state.token && navigator.onLine) {
      await fetch(`${CONFIG.API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          id_sucursal: state.selectedBranchId,
          id_direccion: state.orderType === 'Delivery' ? 1 : null,
          metodo_pago: state.metodoPago,
          observacion: localOrder.observacion,
        }),
      });
    }
  } catch (e) {
    console.warn('Operación guardada en almacenamiento local.');
  }

  // Guardar pedido localmente
  state.orders.unshift(localOrder);
  localStorage.setItem(CONFIG.STORAGE_ORDERS_KEY, JSON.stringify(state.orders));

  // Vaciar carrito
  state.cart = [];
  saveCart();

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check fs-5"></i> Confirmar Pedido';
  }

  if (successBox) {
    successBox.innerHTML = `
      <i class="fa-solid fa-circle-check me-1"></i> ¡Pedido #${newOrderId} registrado con éxito!
      <button class="checkout-link-btn" onclick="openOrdersModal()">Ver mis pedidos</button>
    `;
    successBox.style.display = 'block';
  }
}

// =============================================================================
// REGLAS Y RESTRICCIONES DE VALIDACIÓN DE CAMPOS (SOLO LETRAS / SOLO NÚMEROS)
// =============================================================================

function sanitizeLettersOnly(value) {
  // Permite solo letras (con acentos, diéresis, ñ) y espacios
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
}

function sanitizeNumbersOnly(value) {
  // Permite exclusivamente dígitos numéricos (0-9)
  return value.replace(/\D/g, '');
}

function isValidLetters(text) {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(text);
}

function isValidNumbers(text) {
  return /^[0-9]+$/.test(text);
}

function showFieldFeedback(inputEl, isValid, message = '') {
  if (!inputEl) return;
  const hintEl = document.getElementById(`hint-${inputEl.id}`);
  if (isValid) {
    inputEl.classList.remove('input-invalid');
    inputEl.classList.add('input-valid');
    if (hintEl) {
      hintEl.textContent = '';
      hintEl.classList.remove('show');
    }
  } else {
    inputEl.classList.remove('input-valid');
    inputEl.classList.add('input-invalid');
    if (hintEl) {
      hintEl.textContent = message;
      hintEl.classList.add('show');
    }
  }
}

function clearFieldFeedback(inputEl) {
  if (!inputEl) return;
  inputEl.classList.remove('input-invalid', 'input-valid');
  const hintEl = document.getElementById(`hint-${inputEl.id}`);
  if (hintEl) {
    hintEl.textContent = '';
    hintEl.classList.remove('show');
  }
}

function initInputValidators() {
  // Configurar campos marcados como SOLO LETRAS
  document.querySelectorAll('[data-validate="letters"]').forEach((input) => {
    // Interceptar pulsación de tecla para evitar insertar números o símbolos
    input.addEventListener('keypress', (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/.test(e.key)) {
        e.preventDefault();
        showFieldFeedback(input, false, 'Solo se permiten letras (sin números ni símbolos)');
      }
    });

    // Sanitización en tiempo real para cualquier método de entrada
    input.addEventListener('input', (e) => {
      const original = e.target.value;
      const cleaned = sanitizeLettersOnly(original);
      if (original !== cleaned) {
        e.target.value = cleaned;
        showFieldFeedback(input, false, 'Solo se permiten letras (sin números ni símbolos)');
      } else if (cleaned.trim().length > 0) {
        showFieldFeedback(input, true);
      } else {
        clearFieldFeedback(input);
      }
    });

    // Sanitización al pegar texto
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const cleaned = sanitizeLettersOnly(pasted);
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const val = input.value;
      input.value = val.substring(0, start) + cleaned + val.substring(end);
      input.selectionStart = input.selectionEnd = start + cleaned.length;
      input.dispatchEvent(new Event('input'));
    });

    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        clearFieldFeedback(input);
      }
    });
  });

  // Configurar campos marcados como SOLO NÚMEROS
  document.querySelectorAll('[data-validate="numbers"]').forEach((input) => {
    // Interceptar pulsación de tecla para evitar letras
    input.addEventListener('keypress', (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        showFieldFeedback(input, false, 'Solo se permiten números (sin letras)');
      }
    });

    // Sanitización en tiempo real
    input.addEventListener('input', (e) => {
      const original = e.target.value;
      const cleaned = sanitizeNumbersOnly(original);
      if (original !== cleaned) {
        e.target.value = cleaned;
        showFieldFeedback(input, false, 'Solo se permiten números (sin letras)');
      } else if (cleaned.trim().length > 0) {
        showFieldFeedback(input, true);
      } else {
        clearFieldFeedback(input);
      }
    });

    // Sanitización al pegar contenido
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const cleaned = sanitizeNumbersOnly(pasted);
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const val = input.value;
      input.value = val.substring(0, start) + cleaned + val.substring(end);
      input.selectionStart = input.selectionEnd = start + cleaned.length;
      input.dispatchEvent(new Event('input'));
    });

    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        clearFieldFeedback(input);
      }
    });
  });
}

// =============================================================================
// Autenticación (Login & Registro)
// =============================================================================
function openAuthModal(tab = 'login') {
  setAuthTab(tab);
  document.getElementById('auth-backdrop')?.classList.add('show');
  document.getElementById('auth-modal')?.classList.add('show');
}

function closeAuthModal() {
  document.getElementById('auth-backdrop')?.classList.remove('show');
  document.getElementById('auth-modal')?.classList.remove('show');
}

function setAuthTab(tab) {
  state.authTab = tab;
  document.getElementById('tab-login')?.classList.toggle('active', tab === 'login');
  document.getElementById('tab-register')?.classList.toggle('active', tab === 'register');
  document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';

  const title = document.getElementById('auth-subtitle');
  if (title) {
    title.textContent = tab === 'login' ? 'Inicia sesión para pedir online' : 'Crea tu cuenta para pedir online';
  }

  const errBox = document.getElementById('auth-error-msg');
  if (errBox) errBox.style.display = 'none';

  // Limpiar estados de validación anteriores
  document.querySelectorAll('.field-error-hint').forEach((el) => {
    el.textContent = '';
    el.classList.remove('show');
  });
  document.querySelectorAll('.input-invalid, .input-valid').forEach((el) => {
    el.classList.remove('input-invalid', 'input-valid');
  });
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  const errBox = document.getElementById('auth-error-msg');
  const btn = document.getElementById('btn-submit-login');

  if (errBox) errBox.style.display = 'none';
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Ingresando...';

  try {
    const res = await fetch(`${CONFIG.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password: pass }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      setSession(data.data.token, data.data.usuario);
      closeAuthModal();
    } else {
      throw new Error(data.message || 'Credenciales inválidas.');
    }
  } catch (err) {
    // Si la API no está activa o estamos en modo offline
    if (email && pass.length >= 6) {
      const demoUser = {
        nombre: email.split('@')[0],
        apellido: 'Cliente',
        correo: email,
      };
      setSession('offline_demo_token', demoUser);
      closeAuthModal();
    } else if (errBox) {
      errBox.textContent = err.message || 'Credenciales incorrectas.';
      errBox.style.display = 'block';
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket me-2"></i> Ingresar';
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  const nombreInput = document.getElementById('reg-nombre');
  const apellidoInput = document.getElementById('reg-apellido');
  const correoInput = document.getElementById('reg-correo');
  const telefonoInput = document.getElementById('reg-telefono');
  const passInput = document.getElementById('reg-pass');
  const pass2Input = document.getElementById('reg-pass2');

  const nombre = nombreInput?.value.trim() || '';
  const apellido = apellidoInput?.value.trim() || '';
  const correo = correoInput?.value.trim() || '';
  const telefono = telefonoInput?.value.trim() || '';
  const pass = passInput?.value || '';
  const pass2 = pass2Input?.value || '';
  const errBox = document.getElementById('auth-error-msg');
  const btn = document.getElementById('btn-submit-register');

  // 1. Validación de Nombre (SOLO LETRAS)
  if (!nombre) {
    if (errBox) {
      errBox.textContent = 'Por favor ingresa tu nombre.';
      errBox.style.display = 'block';
    }
    showFieldFeedback(nombreInput, false, 'El nombre es obligatorio');
    nombreInput?.focus();
    return;
  }
  if (!isValidLetters(nombre)) {
    if (errBox) {
      errBox.textContent = 'El nombre solo debe contener letras (sin números ni símbolos).';
      errBox.style.display = 'block';
    }
    showFieldFeedback(nombreInput, false, 'Solo se permiten letras');
    nombreInput?.focus();
    return;
  }
  if (nombre.length < 2) {
    if (errBox) {
      errBox.textContent = 'El nombre debe tener al menos 2 letras.';
      errBox.style.display = 'block';
    }
    showFieldFeedback(nombreInput, false, 'Mínimo 2 letras');
    nombreInput?.focus();
    return;
  }
  showFieldFeedback(nombreInput, true);

  // 2. Validación de Apellido (SOLO LETRAS)
  if (!apellido) {
    if (errBox) {
      errBox.textContent = 'Por favor ingresa tu apellido.';
      errBox.style.display = 'block';
    }
    showFieldFeedback(apellidoInput, false, 'El apellido es obligatorio');
    apellidoInput?.focus();
    return;
  }
  if (!isValidLetters(apellido)) {
    if (errBox) {
      errBox.textContent = 'El apellido solo debe contener letras (sin números ni símbolos).';
      errBox.style.display = 'block';
    }
    showFieldFeedback(apellidoInput, false, 'Solo se permiten letras');
    apellidoInput?.focus();
    return;
  }
  if (apellido.length < 2) {
    if (errBox) {
      errBox.textContent = 'El apellido debe tener al menos 2 letras.';
      errBox.style.display = 'block';
    }
    showFieldFeedback(apellidoInput, false, 'Mínimo 2 letras');
    apellidoInput?.focus();
    return;
  }
  showFieldFeedback(apellidoInput, true);

  // 3. Validación de Correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correo || !emailRegex.test(correo)) {
    if (errBox) {
      errBox.textContent = 'Por favor ingresa un correo electrónico válido.';
      errBox.style.display = 'block';
    }
    showFieldFeedback(correoInput, false, 'Correo no válido');
    correoInput?.focus();
    return;
  }
  showFieldFeedback(correoInput, true);

  // 4. Validación de Teléfono (SOLO NÚMEROS, si se proporciona)
  if (telefono) {
    if (!isValidNumbers(telefono)) {
      if (errBox) {
        errBox.textContent = 'El teléfono solo debe contener números (sin letras ni signos).';
        errBox.style.display = 'block';
      }
      showFieldFeedback(telefonoInput, false, 'Solo se permiten números');
      telefonoInput?.focus();
      return;
    }
    if (telefono.length < 7 || telefono.length > 10) {
      if (errBox) {
        errBox.textContent = 'El teléfono debe tener entre 7 y 10 dígitos (ej. 77725603).';
        errBox.style.display = 'block';
      }
      showFieldFeedback(telefonoInput, false, 'Entre 7 y 10 dígitos');
      telefonoInput?.focus();
      return;
    }
    showFieldFeedback(telefonoInput, true);
  }

  // 5. Validación de Contraseñas
  if (pass.length < 6) {
    if (errBox) {
      errBox.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      errBox.style.display = 'block';
    }
    showFieldFeedback(passInput, false, 'Mínimo 6 caracteres');
    passInput?.focus();
    return;
  }
  showFieldFeedback(passInput, true);

  if (pass !== pass2) {
    if (errBox) {
      errBox.textContent = 'Las contraseñas no coinciden.';
      errBox.style.display = 'block';
    }
    showFieldFeedback(pass2Input, false, 'No coincide');
    pass2Input?.focus();
    return;
  }
  showFieldFeedback(pass2Input, true);

  if (errBox) errBox.style.display = 'none';
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Creando cuenta...';

  try {
    const res = await fetch(`${CONFIG.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, correo, telefono, password: pass }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      setSession(data.data.token, data.data.usuario);
      closeAuthModal();
    } else {
      throw new Error(data.message || 'Error al crear la cuenta.');
    }
  } catch (err) {
    if (nombre && correo && pass.length >= 6) {
      const demoUser = { nombre, apellido, correo, telefono };
      setSession('offline_demo_token', demoUser);
      closeAuthModal();
    } else if (errBox) {
      errBox.textContent = err.message || 'Error en los datos del registro.';
      errBox.style.display = 'block';
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-user-plus me-2"></i> Crear Cuenta';
  }
}

function setSession(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem(CONFIG.STORAGE_TOKEN_KEY, token);
  localStorage.setItem(CONFIG.STORAGE_USER_KEY, JSON.stringify(user));
  updateAuthUI();
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem(CONFIG.STORAGE_TOKEN_KEY);
  localStorage.removeItem(CONFIG.STORAGE_USER_KEY);
  updateAuthUI();
}

function updateAuthUI() {
  const container = document.getElementById('auth-nav-container');
  if (!container) return;

  if (state.user) {
    container.innerHTML = `
      <button class="btn-auth-nav" onclick="openOrdersModal()">
        <i class="fa-solid fa-receipt me-1"></i> Pedidos
      </button>
      <span class="nav-user-chip" title="${state.user.correo || ''}">
        <i class="fa-solid fa-user me-1"></i> ${state.user.nombre || 'Usuario'}
      </span>
      <button class="btn-logout-nav" onclick="logout()" title="Cerrar sesión" aria-label="Cerrar sesión">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    `;
  } else {
    container.innerHTML = `
      <button class="btn-auth-nav" onclick="openAuthModal('login')">
        <i class="fa-solid fa-right-to-bracket me-1"></i> Ingresar
      </button>
    `;
  }
}

// =============================================================================
// Modal de Mis Pedidos
// =============================================================================
function openOrdersModal() {
  renderOrders();
  document.getElementById('orders-backdrop')?.classList.add('show');
  document.getElementById('orders-modal')?.classList.add('show');
}

function closeOrdersModal() {
  document.getElementById('orders-backdrop')?.classList.remove('show');
  document.getElementById('orders-modal')?.classList.remove('show');
}

function renderOrders() {
  const list = document.getElementById('orders-list');
  const count = document.getElementById('orders-count');
  if (!list) return;

  if (count) count.textContent = `Total: ${state.orders.length}`;

  if (state.orders.length === 0) {
    list.innerHTML = `
      <div class="orders-empty">
        <i class="fa-solid fa-box-open fs-2 text-muted"></i>
        <p>Aún no tienes pedidos registrados.</p>
        <small>Agrega productos al carrito y confirma tu primer pedido online.</small>
      </div>
    `;
    return;
  }

  list.innerHTML = state.orders
    .map((ped) => {
      const dateFormatted = new Date(ped.fecha_pedido).toLocaleString('es-BO', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
      const badgeClass = getBadgeClass(ped.estadoPedido?.nombre || 'Pendiente');
      const deliveryText = ped.id_direccion
        ? '<span class="d-block"><i class="fa-solid fa-truck-fast me-1"></i> Delivery</span>'
        : '<span class="d-block"><i class="fa-solid fa-bag-shopping me-1"></i> Para Llevar</span>';

      return `
        <li class="order-card">
          <div class="order-top">
            <div>
              <span class="order-id">#${ped.id_pedido}</span>
              <span class="order-date">${dateFormatted}</span>
            </div>
            <span class="order-badge ${badgeClass}">${ped.estadoPedido?.nombre || 'Pendiente'}</span>
          </div>
          <div class="order-mid">
            <span><i class="fa-solid fa-store me-1"></i> ${ped.sucursal?.nombre || 'Sucursal Principal'}</span>
            ${deliveryText}
          </div>
          <div class="order-bottom">
            <span class="order-pay">
              <i class="fa-solid fa-wallet me-1"></i> ${ped.pago?.metodo_pago || 'Efectivo'}
            </span>
            <span class="order-badge badge-warning order-pay-status">${ped.pago?.estado || 'Pendiente'}</span>
            <span class="order-total">Bs ${Number(ped.pago?.monto || 0).toFixed(2)}</span>
          </div>
          ${ped.observacion ? `<p class="order-note"><i class="fa-solid fa-note-sticky me-1"></i> ${ped.observacion}</p>` : ''}
        </li>
      `;
    })
    .join('');
}

function getBadgeClass(status) {
  const low = status.toLowerCase();
  if (low.includes('confirmado')) return 'badge-info';
  if (low.includes('preparacion')) return 'badge-warning';
  if (low.includes('listo') || low.includes('entregado')) return 'badge-success';
  if (low.includes('cancelado')) return 'badge-danger';
  return 'badge-secondary';
}

// =============================================================================
// Inicialización Principal
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPWA();
  initInputValidators();
  renderCategoryButtons();
  renderProducts();
  renderBranches();
  renderBranchSelect();
  renderReviews();
  updateCartUI();
  updateAuthUI();

  // Vista inicial por defecto
  showView('inicio');

  // Conexión opcional a backend
  syncWithBackend();
});
