const products = [
  {
    name: "Fone Bluetooth Pro",
    category: "Eletrônicos",
    price: 189.9,
    rating: 4.9,
    description: "Audio imersivo com bateria de longa duração e conexão estável para celular e notebook.",
    tag: "Mais vendido",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Smartwatch Active X",
    category: "Acessórios",
    price: 249.9,
    rating: 4.8,
    description: "Monitore passos, frequência cardíaca e notificações em um visual elegante e leve.",
    tag: "Novo",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Caixa de Som Portátil",
    category: "Eletrônicos",
    price: 299.0,
    rating: 4.9,
    description: "Som potente com bateria de longa duração, ideal para casa, praia e viagens.",
    tag: "Top review",
    image:
      "https://images.unsplash.com/photo-1556451196-0ccbac5d2f74?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Ventilador de Mesa",
    category: "Utilidades",
    price: 129.9,
    rating: 4.7,
    description: "Perfuração silenciosa e design compacto para manter o ambiente fresco e confortável.",
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mini Projetor HD",
    category: "Eletrônicos",
    price: 699.0,
    rating: 4.9,
    description: "Transforme qualquer parede em uma tela com imagem nítida e fácil conexão.",
    tag: "Destaque",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kit de Organização Desk",
    category: "Utilidades",
    price: 99.9,
    rating: 4.6,
    description: "Organize seu espaço com praticidade, estilo e funcionalidade para rotina diária.",
    tag: "Oferta",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
];

const productGrid = document.getElementById("productGrid");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartBadge = document.getElementById("cartBadge");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const whatsappCheckoutButton = document.getElementById("whatsappCheckoutButton");
const emailPreview = document.getElementById("emailPreview");
const emailPreviewText = document.getElementById("emailPreviewText");
const closeEmailPreview = document.getElementById("closeEmailPreview");
const copyEmailButton = document.getElementById("copyEmailButton");
const openMailButton = document.getElementById("openMailButton");
const orderEmail = "rafael.sales@sct.ce.gov.br";

let cart = [];

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(productName) {
  const product = products.find((item) => item.name === productName);
  if (!product) return;

  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName);
  renderCart();
}

function changeQuantity(productName, change) {
  const item = cart.find((entry) => entry.name === productName);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productName);
    return;
  }

  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();

  cartBadge.textContent = count;
  cartTotal.textContent = formatCurrency(total);
  checkoutButton.disabled = count === 0;
  whatsappCheckoutButton.disabled = count === 0;

  if (count === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <small>${formatCurrency(item.price)} cada</small>
          </div>

          <div class="item-controls">
            <button type="button" data-action="decrease" data-product="${item.name}" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-product="${item.name}" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
      `
    )
    .join("");

  cartItems.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const { action, product } = button.dataset;
      if (action === "increase") changeQuantity(product, 1);
      if (action === "decrease") changeQuantity(product, -1);
    });
  });
}

function getOrderSummary() {
  const itemsText = cart
    .map((item) => `${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`)
    .join("\n");

  const total = getCartTotal();

  return {
    itemsText,
    total,
    text: `Olá! Meu pedido foi finalizado:\n\n${itemsText}\n\nTotal: ${formatCurrency(total)}`,
  };
}

function buildEmailMessage() {
  const { itemsText, total } = getOrderSummary();
  const subject = "Pedido finalizado - Gemi Tech";
  const body = `Olá,\n\nSegue meu pedido finalizado:\n\n${itemsText}\n\nTotal: ${formatCurrency(total)}\n\nObrigado!`;

  return {
    subject,
    body,
    mailtoLink: `mailto:${orderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

async function copyEmailText() {
  const { body, subject } = buildEmailMessage();
  const fullText = `Assunto: ${subject}\n\n${body}`;

  try {
    await navigator.clipboard.writeText(fullText);
    alert("Pedido copiado. Cole no e-mail para enviar.");
  } catch (error) {
    alert(`Pedido pronto para copiar:\n\n${fullText}`);
  }
}

function showEmailPreview() {
  const { subject, body } = buildEmailMessage();
  emailPreviewText.value = `Assunto: ${subject}\n\n${body}`;
  emailPreview.classList.remove("hidden");
}

function sendOrderByEmail() {
  if (cart.length === 0) return;

  const { mailtoLink } = buildEmailMessage();
  showEmailPreview();

  if (window.confirm("Deseja abrir o seu e-mail agora para enviar o pedido?")) {
    window.location.href = mailtoLink;
  }
}

function openWhatsAppCart() {
  if (cart.length === 0) return;

  const { text } = getOrderSummary();
  const phone = "5585988635296";
  const message = encodeURIComponent(text);

  const confirmSend = window.confirm("Deseja abrir o WhatsApp para confirmar o pedido finalizado?");
  if (!confirmSend) return;

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-tag">${product.tag}</span>
          </div>

          <div class="product-body">
            <div class="product-meta">
              <span class="product-category">${product.category}</span>
              <span class="product-rating">★ ${product.rating}</span>
            </div>

            <h3>${product.name}</h3>
            <p>${product.description}</p>

            <div class="product-footer">
              <div class="product-price">${formatCurrency(product.price)}<small>à vista</small></div>
              <button class="buy-btn" data-product="${product.name}">Adicionar</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  const buttons = document.querySelectorAll(".buy-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.product);
      cartPanel.classList.add("open");
      cartToggle.setAttribute("aria-expanded", "true");
    });
  });
}

cartToggle.addEventListener("click", () => {
  const isOpen = cartPanel.classList.toggle("open");
  cartToggle.setAttribute("aria-expanded", String(isOpen));
});

closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartToggle.setAttribute("aria-expanded", "false");
});

closeEmailPreview.addEventListener("click", () => {
  emailPreview.classList.add("hidden");
});

copyEmailButton.addEventListener("click", copyEmailText);
openMailButton.addEventListener("click", () => {
  const { mailtoLink } = buildEmailMessage();
  window.location.href = mailtoLink;
});

checkoutButton.addEventListener("click", sendOrderByEmail);
whatsappCheckoutButton.addEventListener("click", openWhatsAppCart);

renderProducts();
renderCart();
