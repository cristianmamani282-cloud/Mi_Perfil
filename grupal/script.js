document.addEventListener('DOMContentLoaded', () => {

  const productsData = [
    {
      id: 1,
      name: "Cappuccino",
      price: 18,
      img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Latte",
      price: 17,
      img: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Cheesecake",
      price: 22,
      img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Croissant",
      price: 15,
      img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Americano Clásico",
      price: 14,
      img: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Mocha Artesanal",
      price: 20,
      img: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 7,
      name: "Muffin de Arándanos",
      price: 16,
      img: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 8,
      name: "Tiramisú Tradicional",
      price: 25,
      img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop"
    }
  ];

  let cart = [
    { id: 1, name: "Cappuccino", price: 18, qty: 1, img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Cheesecake", price: 22, qty: 1, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop" }
  ];

  let isShowingAllProducts = false;

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const drawerThemeBtn = document.getElementById('drawerThemeBtn');
  const themeLabelMode = document.querySelector('.theme-label-mode');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('brew_theme', theme);
    if (themeLabelMode) {
      themeLabelMode.textContent = theme === 'dark' ? 'Modo Noche' : 'Modo Claro';
    }
  }

  const savedTheme = localStorage.getItem('brew_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Modo ${newTheme === 'dark' ? 'Noche' : 'Día'} activado`);
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (drawerThemeBtn) drawerThemeBtn.addEventListener('click', toggleTheme);

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMobileDrawer() {
    mobileDrawer.classList.add('active');
    mobileDrawerOverlay.classList.add('active');
    hamburgerBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('active');
    mobileDrawerOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('active')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  const mobNavCart = document.getElementById('mobNavCart');
  const mobNavProfile = document.getElementById('mobNavProfile');
  const drawerCartBtn = document.getElementById('drawerCartBtn');

  if (mobNavCart) {
    mobNavCart.addEventListener('click', () => {
      openModal(modalCart);
    });
  }

  if (drawerCartBtn) {
    drawerCartBtn.addEventListener('click', () => {
      closeMobileDrawer();
      openModal(modalCart);
    });
  }

  if (mobNavProfile) {
    mobNavProfile.addEventListener('click', () => {
      showToast("Perfil de cliente: Invitado");
    });
  }

  const heroImage = document.getElementById('heroImage');
  const heroDots = document.querySelectorAll('.hero-carousel-dots .dot');
  const heroOrderNowBtn = document.getElementById('heroOrderNowBtn');

  const heroSlides = [
    "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop"
  ];

  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      heroDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      if (heroImage && heroSlides[index]) {
        heroImage.style.opacity = '0.4';
        setTimeout(() => {
          heroImage.src = heroSlides[index];
          heroImage.style.opacity = '1';
        }, 180);
      }
    });
  });

  if (heroOrderNowBtn) {
    heroOrderNowBtn.addEventListener('click', () => {
      openModal(modalCart);
    });
  }

  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const cartBadge = document.getElementById('cartBadge');
  const mobileCartBadge = document.getElementById('mobileCartBadge');
  const drawerCartBadge = document.getElementById('drawerCartBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalAmount = document.getElementById('cartTotalAmount');

  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCart = document.getElementById('modalCart');
  const modalInvoice = document.getElementById('modalInvoice');
  const modalSuccess = document.getElementById('modalSuccess');

  const closeCartBtn = document.getElementById('closeCartBtn');
  const keepShoppingBtn = document.getElementById('keepShoppingBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const closeInvoiceBtn = document.getElementById('closeInvoiceBtn');
  const backToHomeBtn = document.getElementById('backToHomeBtn');

  function openModal(modalToOpen) {
    modalCart.classList.remove('active');
    modalInvoice.classList.remove('active');
    modalSuccess.classList.remove('active');

    modalBackdrop.classList.add('active');
    modalToOpen.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    modalBackdrop.classList.remove('active');
    modalCart.classList.remove('active');
    modalInvoice.classList.remove('active');
    modalSuccess.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartTriggerBtn) cartTriggerBtn.addEventListener('click', () => openModal(modalCart));
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeAllModals);
  if (keepShoppingBtn) keepShoppingBtn.addEventListener('click', closeAllModals);
  if (closeInvoiceBtn) closeInvoiceBtn.addEventListener('click', closeAllModals);
  if (backToHomeBtn) backToHomeBtn.addEventListener('click', () => {
    closeAllModals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeAllModals();
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast("Tu carrito está vacío. Agrega un producto primero.");
        return;
      }
      openModal(modalInvoice);
    });
  }

  function renderCart() {
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    [cartBadge, mobileCartBadge, drawerCartBadge].forEach(badge => {
      if (badge) {
        badge.textContent = totalQty;
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 200);
      }
    });

    if (cartTotalAmount) {
      cartTotalAmount.textContent = `Bs. ${totalPrice}`;
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-message">
          <p>Tu carrito está actualmente vacío.</p>
          <p style="margin-top: 6px; font-size: 0.82rem; color: var(--text-muted);">¡Elige un delicioso café o postre para comenzar!</p>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <div class="cart-item-thumb">
          <img src="${item.img}" alt="${item.name}" />
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">Bs. ${item.price}</p>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button class="qty-btn btn-minus" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn btn-plus" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
          </div>
          <button class="btn-remove-item" data-id="${item.id}" aria-label="Eliminar ${item.name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    cartItemsList.querySelectorAll('.btn-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        modifyQuantity(id, 1);
      });
    });

    cartItemsList.querySelectorAll('.btn-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        modifyQuantity(id, -1);
      });
    });

    cartItemsList.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        removeFromCart(id);
      });
    });
  }

  function modifyQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      renderCart();
    }
  }

  function removeFromCart(id) {
    const removedItem = cart.find(i => i.id === id);
    cart = cart.filter(i => i.id !== id);
    renderCart();
    if (removedItem) {
      showToast(`Se quitó "${removedItem.name}" del pedido`);
    }
  }

  function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty: 1
      });
    }
    renderCart();
    showToast(`¡${product.name} agregado a tu pedido!`);
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      if (!card) return;
      const id = parseInt(card.getAttribute('data-id'), 10);
      const name = card.getAttribute('data-name');
      const price = parseFloat(card.getAttribute('data-price'));
      const img = card.getAttribute('data-img');

      addToCart({ id, name, price, img });
    });
  });

  const viewAllLink = document.getElementById('viewAllLink');
  const productsGrid = document.getElementById('productsGrid');

  if (viewAllLink && productsGrid) {
    viewAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isShowingAllProducts) {
        const extraProducts = productsData.slice(4);
        extraProducts.forEach(prod => {
          const card = document.createElement('div');
          card.className = 'product-card';
          card.setAttribute('data-id', prod.id);
          card.setAttribute('data-name', prod.name);
          card.setAttribute('data-price', prod.price);
          card.setAttribute('data-img', prod.img);
          card.innerHTML = `
            <div class="product-img-box">
              <img src="${prod.img}" alt="${prod.name}" loading="lazy" />
            </div>
            <div class="product-info">
              <h3 class="product-name">${prod.name}</h3>
              <p class="product-price">Bs. ${prod.price}</p>
              <button class="add-to-cart-btn" data-id="${prod.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-cart-icon">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Agregar</span>
              </button>
            </div>
          `;
          card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            addToCart(prod);
          });
          productsGrid.appendChild(card);
        });
        viewAllLink.textContent = 'Ver menos ↑';
        isShowingAllProducts = true;
      } else {
        const allCards = productsGrid.querySelectorAll('.product-card');
        allCards.forEach((card, idx) => {
          if (idx >= 4) card.remove();
        });
        viewAllLink.textContent = 'Ver todo →';
        isShowingAllProducts = false;
      }
    });
  }

  renderCart();

  const invoiceForm = document.getElementById('invoiceForm');
  const inputFullName = document.getElementById('fullName');
  const inputNitCi = document.getElementById('nitCi');
  const inputEmail = document.getElementById('email');
  const inputPhone = document.getElementById('phone');

  const groupFullName = document.getElementById('groupFullName');
  const groupNit = document.getElementById('groupNit');
  const groupEmail = document.getElementById('groupEmail');
  const groupPhone = document.getElementById('groupPhone');

  const nameError = document.getElementById('nameError');
  const nitError = document.getElementById('nitError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  inputFullName.value = "";
  inputNitCi.value = "";
  inputEmail.value = "";
  inputPhone.value = "";

  inputFullName.addEventListener('beforeinput', (e) => {
    if (e.data && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(e.data)) {
      e.preventDefault();
      showInlineError(groupFullName, nameError, "Solo se permiten letras y espacios");
    }
  });

  inputFullName.addEventListener('input', (e) => {
    const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    if (e.target.value !== cleaned) {
      e.target.value = cleaned;
      showInlineError(groupFullName, nameError, "Solo se permiten letras");
    } else if (e.target.value.trim().length > 0) {
      validateFullName();
    } else {
      resetFieldState(groupFullName, nameError);
    }
  });

  inputFullName.addEventListener('blur', () => {
    if (inputFullName.value.trim().length > 0) {
      validateFullName();
    }
  });

  function validateFullName() {
    const val = inputFullName.value.trim();
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,60}$/;
    if (!val) {
      showInlineError(groupFullName, nameError, "Ingresa tu nombre completo");
      return false;
    }
    if (!regex.test(val)) {
      showInlineError(groupFullName, nameError, "Mínimo 3 letras, solo letras y espacios");
      return false;
    }
    showInlineSuccess(groupFullName, nameError);
    return true;
  }

  inputNitCi.addEventListener('beforeinput', (e) => {
    if (e.data && !/^[0-9]+$/.test(e.data)) {
      e.preventDefault();
      showInlineError(groupNit, nitError, "Solo se permiten números");
    }
  });

  inputNitCi.addEventListener('input', (e) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value !== cleaned) {
      e.target.value = cleaned;
      showInlineError(groupNit, nitError, "Solo se permiten dígitos numéricos (0-9)");
    } else if (e.target.value.trim().length > 0) {
      validateNitCi();
    } else {
      resetFieldState(groupNit, nitError);
    }
  });

  inputNitCi.addEventListener('blur', () => {
    if (inputNitCi.value.trim().length > 0) {
      validateNitCi();
    }
  });

  function validateNitCi() {
    const val = inputNitCi.value.trim();
    const regex = /^[0-9]{5,15}$/;
    if (!val) {
      showInlineError(groupNit, nitError, "Ingresa tu número de NIT o CI");
      return false;
    }
    if (!regex.test(val)) {
      showInlineError(groupNit, nitError, "Debe tener entre 5 y 15 dígitos numéricos");
      return false;
    }
    showInlineSuccess(groupNit, nitError);
    return true;
  }

  inputEmail.addEventListener('input', (e) => {
    if (e.target.value.trim().length > 0) {
      validateEmail();
    } else {
      resetFieldState(groupEmail, emailError);
    }
  });

  inputEmail.addEventListener('blur', () => {
    if (inputEmail.value.trim().length > 0) {
      validateEmail();
    }
  });

  function validateEmail() {
    const val = inputEmail.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) {
      showInlineError(groupEmail, emailError, "Ingresa tu correo electrónico");
      return false;
    }
    if (!emailRegex.test(val)) {
      showInlineError(groupEmail, emailError, "Ingresa un formato válido (ejemplo@correo.com)");
      return false;
    }
    showInlineSuccess(groupEmail, emailError);
    return true;
  }

  inputPhone.addEventListener('beforeinput', (e) => {
    if (e.data && !/^[0-9]+$/.test(e.data)) {
      e.preventDefault();
      showInlineError(groupPhone, phoneError, "Solo se permiten números");
    }
  });

  inputPhone.addEventListener('input', (e) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value !== cleaned) {
      e.target.value = cleaned;
      showInlineError(groupPhone, phoneError, "Solo se permiten dígitos numéricos (0-9)");
    } else if (e.target.value.trim().length > 0) {
      validatePhone();
    } else {
      resetFieldState(groupPhone, phoneError);
    }
  });

  inputPhone.addEventListener('blur', () => {
    if (inputPhone.value.trim().length > 0) {
      validatePhone();
    }
  });

  function validatePhone() {
    const val = inputPhone.value.trim();
    const regex = /^[0-9]{7,12}$/;
    if (!val) {
      showInlineError(groupPhone, phoneError, "Ingresa tu número de teléfono");
      return false;
    }
    if (!regex.test(val)) {
      showInlineError(groupPhone, phoneError, "Debe tener entre 7 y 12 dígitos numéricos");
      return false;
    }
    showInlineSuccess(groupPhone, phoneError);
    return true;
  }

  function showInlineError(groupElement, messageElement, text) {
    groupElement.classList.add('has-error');
    groupElement.classList.remove('has-success');
    if (messageElement) {
      messageElement.textContent = text;
      messageElement.style.display = 'block';
    }
  }

  function showInlineSuccess(groupElement, messageElement) {
    groupElement.classList.remove('has-error');
    groupElement.classList.add('has-success');
    if (messageElement) {
      messageElement.style.display = 'none';
    }
  }

  function resetFieldState(groupElement, messageElement) {
    groupElement.classList.remove('has-error');
    groupElement.classList.remove('has-success');
    if (messageElement) {
      messageElement.style.display = 'none';
    }
  }

  const summaryOrderId = document.getElementById('summaryOrderId');
  const summaryCustomer = document.getElementById('summaryCustomer');
  const summaryTotal = document.getElementById('summaryTotal');
  const summaryInvoiceStatus = document.getElementById('summaryInvoiceStatus');
  const summaryPayment = document.getElementById('summaryPayment');

  if (invoiceForm) {
    invoiceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateFullName();
      const isNitValid = validateNitCi();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();

      if (!isNameValid || !isNitValid || !isEmailValid || !isPhoneValid) {
        showToast("Por favor completa los campos requeridos.");
        if (!isNameValid) inputFullName.focus();
        else if (!isNitValid) inputNitCi.focus();
        else if (!isEmailValid) inputEmail.focus();
        else if (!isPhoneValid) inputPhone.focus();
        return;
      }

      const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
      const paymentMethod = selectedPayment ? selectedPayment.value : 'Efectivo';
      const orderTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      const randomOrderNum = Math.floor(100 + Math.random() * 900);
      const generatedOrderId = `Pedido #00${randomOrderNum}`;

      if (summaryOrderId) summaryOrderId.textContent = generatedOrderId;
      if (summaryCustomer) summaryCustomer.textContent = inputFullName.value.trim();
      if (summaryTotal) summaryTotal.textContent = `Bs. ${orderTotal}`;
      if (summaryPayment) summaryPayment.textContent = paymentMethod;
      if (summaryInvoiceStatus) summaryInvoiceStatus.textContent = "Pendiente de emisión";

      openModal(modalSuccess);

      cart = [];
      renderCart();
      invoiceForm.reset();
      [groupFullName, groupNit, groupEmail, groupPhone].forEach(g => resetFieldState(g));

      showToast("¡Pedido completado con éxito!");
    });
  }

  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2800);
  }

});
