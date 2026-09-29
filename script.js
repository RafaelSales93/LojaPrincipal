const products = [
  {
    name: "Miniatura Carro GEELY MONJARO 2027",
    category: "Colecionáveis",
    price: 59.9,
    rating: 5,
    description: "Miniatura detalhada do GEELY MONJARO 2027 para colecionadores e apaixonados por carros.",
    tag: "Novo",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  },
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
const MAX_ITEM_QUANTITY = 99;
const CHECKOUT_COOLDOWN_MS = 3000;
const allowedImageOrigin = "https://images.unsplash.com";

let cart = [];
let lastCheckoutAt = 0;

/**
 * Escapa strings antes de inserir em HTML para reduzir risco de XSS.
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Valida uma string simples antes de usá-la em atributos ou texto renderizado.
 * @param {string} value
 * @returns {string}
 */
function sanitizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 120);
}

/**
 * Permite somente imagens HTTPS do provedor definido no catálogo.
 * @param {string} value
 * @returns {string}
 */
function sanitizeImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.origin === allowedImageOrigin ? url.href : "";
  } catch {
    return "";
  }
}

/**
 * Evita abrir vários checkouts em sequência por engano ou automação simples.
 * @returns {boolean}
 */
function checkoutIsAvailable() {
  const now = Date.now();
  if (now - lastCheckoutAt < CHECKOUT_COOLDOWN_MS) {
    window.alert("Aguarde alguns segundos antes de tentar novamente.");
    return false;
  }

  lastCheckoutAt = now;
  return true;
}

/**
 * Formata valores em moeda brasileira.
 * @param {number} value - Valor a ser formatado.
 * @returns {string} Valor em moeda BRL.
 */
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Busca um produto pelo nome.
 * @param {string} productName - Nome do produto.
 * @returns {{ name:string, category:string, price:number, rating:number, description:string, tag:string, image:string } | undefined}
 */
function findProductByName(productName) {
  return products.find((product) => product.name === productName);
}

/**
 * Retorna a quantidade total de itens no carrinho.
 * @returns {number}
 */
function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Retorna o valor total do carrinho.
 * @returns {number}
 */
function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Adiciona um produto ao carrinho ou incrementa a quantidade caso já exista.
 * @param {string} productName - Nome do produto.
 */
function addToCart(productName) {
  const product = findProductByName(productName);
  if (!product) return;

  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem && existingItem.quantity < MAX_ITEM_QUANTITY) {
    existingItem.quantity += 1;
  } else if (!existingItem) {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

/**
 * Remove um produto do carrinho.
 * @param {string} productName - Nome do produto.
 */
function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName);
  renderCart();
}

/**
 * Ajusta a quantidade de um item no carrinho.
 * @param {string} productName - Nome do produto.
 * @param {number} delta - Variação da quantidade.
 */
function changeQuantity(productName, delta) {
  const item = cart.find((entry) => entry.name === productName);
  if (!item) return;

  item.quantity = Math.min(MAX_ITEM_QUANTITY, item.quantity + delta);

  if (item.quantity <= 0) {
    removeFromCart(productName);
    return;
  }

  renderCart();
}

/**
 * Renderiza o estado do carrinho na tela.
 */
function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();

  cartBadge.textContent = String(count);
  cartTotal.textContent = formatCurrency(total);
  checkoutButton.disabled = count === 0;
  whatsappCheckoutButton.disabled = count === 0;

  if (count === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => {
        const safeName = escapeHtml(sanitizeText(item.name));

        return `
        <div class="cart-item">
          <div>
            <strong>${safeName}</strong>
            <small>${formatCurrency(item.price)} cada</small>
          </div>

          <div class="item-controls">
            <button type="button" data-action="decrease" data-product="${safeName}" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-product="${safeName}" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
      `;
      }
    )
    .join("");

  cartItems.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const { action, product } = button.dataset;
      if (action === "increase") {
        changeQuantity(product, 1);
      }

      if (action === "decrease") {
        changeQuantity(product, -1);
      }
    });
  });
}

/**
 * Monta o resumo do pedido para WhatsApp ou e-mail.
 * @returns {{ itemsText: string, total: number, text: string }}
 */
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

/**
 * Cria o conteúdo do e-mail de pedido.
 * @returns {{ subject: string, body: string, mailtoLink: string }}
 */
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

/**
 * Copia o texto do pedido para a área de transferência.
 */
async function copyEmailText() {
  if (cart.length === 0) return;

  const { body, subject } = buildEmailMessage();
  const fullText = `Assunto: ${subject}\n\n${body}`;

  try {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
      throw new Error("Clipboard não suportado");
    }

    await navigator.clipboard.writeText(fullText);
    window.alert("Pedido copiado. Cole no e-mail para enviar.");
  } catch (error) {
    console.error("Erro ao copiar pedido:", error);
    window.alert(`Pedido pronto para copiar:\n\n${fullText}`);
  }
}

/**
 * Exibe o preview do pedido em e-mail.
 */
function showEmailPreview() {
  const { subject, body } = buildEmailMessage();
  emailPreviewText.value = `Assunto: ${subject}\n\n${body}`;
  emailPreview.classList.remove("hidden");
}

/**
 * Envia o pedido por e-mail, abrindo o cliente de e-mail quando confirmado.
 */
function sendOrderByEmail() {
  if (cart.length === 0 || !checkoutIsAvailable()) return;

  const { mailtoLink } = buildEmailMessage();
  showEmailPreview();

  if (window.confirm("Deseja abrir o seu e-mail agora para enviar o pedido?")) {
    window.location.href = mailtoLink;
  }
}

/**
 * Envia o pedido pelo WhatsApp.
 */
function openWhatsAppCart() {
  if (cart.length === 0 || !checkoutIsAvailable()) return;

  const { text } = getOrderSummary();
  const phone = "5585988635296";
  const message = encodeURIComponent(text);

  const confirmSend = window.confirm("Deseja abrir o WhatsApp para confirmar o pedido finalizado?");
  if (!confirmSend) return;

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
}

/**
 * Renderiza os produtos na grade de catálogo.
 */
function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => {
        const safeName = escapeHtml(sanitizeText(product.name));
        const safeCategory = escapeHtml(sanitizeText(product.category));
        const safeDescription = escapeHtml(sanitizeText(product.description));
        const safeTag = escapeHtml(sanitizeText(product.tag));
        const safeImage = escapeHtml(sanitizeImageUrl(product.image));

        return `
        <article class="product-card">
          <div class="product-image">
            <img src="${safeImage}" alt="${safeName}" />
            <span class="product-tag">${safeTag}</span>
          </div>

          <div class="product-body">
            <div class="product-meta">
              <span class="product-category">${safeCategory}</span>
              <span class="product-rating">★ ${product.rating}</span>
            </div>

            <h3>${safeName}</h3>
            <p>${safeDescription}</p>

            <div class="product-footer">
              <div class="product-price">${formatCurrency(product.price)}<small>à vista</small></div>
              <button class="buy-btn" data-product="${safeName}">Adicionar</button>
            </div>
          </div>
        </article>
      `;
      }
    )
    .join("");

  document.querySelectorAll(".buy-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const { product } = button.dataset;
      addToCart(product);
      cartPanel.classList.add("open");
      cartToggle.setAttribute("aria-expanded", "true");
    });
  });
}

/**
 * Garante que o carrinho e os botões relevantes tenham os eventos necessários.
 */
function bindCartEvents() {
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
}

bindCartEvents();
renderProducts();
renderCart();
