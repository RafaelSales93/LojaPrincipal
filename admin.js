const DEFAULT_CONFIG = {
  url: "http://127.0.0.1:54321",
  anonKey: "",
};

const config = {
  ...DEFAULT_CONFIG,
  ...window.__SUPABASE_CONFIG__,
};

const authForm = document.getElementById("authForm");
const authCard = document.getElementById("authCard");
const dashboard = document.getElementById("dashboard");
const statusMessage = document.getElementById("statusMessage");
const ordersCount = document.getElementById("ordersCount");
const revenueTotal = document.getElementById("revenueTotal");
const viewedCount = document.getElementById("viewedCount");
const latestOrder = document.getElementById("latestOrder");
const ordersList = document.getElementById("ordersList");
const topViewsList = document.getElementById("topViewsList");
const signupButton = document.getElementById("signupButton");
const logoutButton = document.getElementById("logoutButton");

let supabaseClient = null;

function createSupabaseClient() {
  if (!window.__SUPABASE_CONFIG__) {
    return null;
  }

  return import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm").then(({ createClient }) =>
    createClient(config.url, config.anonKey || "", {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  );
}

async function initializeAdminClient() {
  try {
    const client = await createSupabaseClient();

    if (!client) {
      return null;
    }

    supabaseClient = client;
    window.__SUPABASE_ADMIN_CLIENT__ = client;

    client.auth.onAuthStateChange(async () => {
      await evaluateSecurity();
    });

    await evaluateSecurity();
    return client;
  } catch (error) {
    console.error("Erro ao inicializar cliente Supabase:", error);
    window.__SUPABASE_ADMIN_CLIENT__ = null;
    showStatus("Não foi possível iniciar o cliente do Supabase. Verifique a conexão e a URL local.", "error");
    return null;
  }
}

initializeAdminClient();

function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = "status-message";
  if (type) {
    statusMessage.classList.add(type);
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function renderOrders(rows = []) {
  ordersCount.textContent = String(rows.length);
  const total = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
  revenueTotal.textContent = formatCurrency(total);

  const latest = rows[0];
  latestOrder.textContent = latest ? new Date(latest.created_at).toLocaleDateString("pt-BR") : "-";

  if (!rows.length) {
    ordersList.innerHTML = "<li>Nenhum pedido registrado ainda.</li>";
    return;
  }

  ordersList.innerHTML = rows
    .slice(0, 5)
    .map(
      (row) =>
        `<li><strong>${escapeHtml(row.customer_name || "Cliente")}</strong><br>${escapeHtml(row.address || "Sem endereço")}<br>${formatCurrency(row.total)}</li>`
    )
    .join("");
}

function renderTopViews(rows = []) {
  viewedCount.textContent = String(rows.reduce((sum, row) => sum + Number(row.view_count || 0), 0));

  if (!rows.length) {
    topViewsList.innerHTML = "<li>Nenhuma visualização registrada.</li>";
    return;
  }

  topViewsList.innerHTML = rows
    .slice(0, 5)
    .map(
      (row) => `<li><strong>${escapeHtml(row.product_name || "Produto")}</strong><br>${row.view_count || 0} visualizações</li>`
    )
    .join("");
}

async function evaluateSecurity() {
  if (!supabaseClient) {
    showStatus("O SDK do Supabase não está disponível. Configure a URL e a anon key do backend local.", "error");
    return;
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    authCard.classList.remove("hidden");
    dashboard.classList.add("hidden");
    return;
  }

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error || !profile || !profile.is_admin) {
    showStatus("Sessão ativa, mas este usuário não tem acesso administrativo. Crie um perfil com is_admin = true no Supabase Studio.", "error");
    authCard.classList.remove("hidden");
    dashboard.classList.add("hidden");
    return;
  }

  authCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
  await loadDashboardData();
}

async function loadDashboardData() {
  if (!supabaseClient) return;

  const [{ data: orders, error: ordersError }, { data: views, error: viewsError }] = await Promise.all([
    supabaseClient.from("orders").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("product_views").select("*").order("view_count", { ascending: false }),
  ]);

  if (ordersError) {
    showStatus(`Não foi possível carregar os pedidos: ${ordersError.message}`, "error");
    return;
  }

  if (viewsError) {
    showStatus(`Não foi possível carregar as visualizações: ${viewsError.message}`, "error");
    return;
  }

  renderOrders(orders || []);
  renderTopViews(views || []);
}

async function handleSignIn(event) {
  event.preventDefault();

  if (!supabaseClient) {
    showStatus("Configure o Supabase antes de continuar.", "error");
    return;
  }

  const formData = new FormData(event.currentTarget);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    showStatus("Preencha email e senha para entrar.", "error");
    return;
  }

  showStatus("Entrando...");

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    showStatus(`Erro ao entrar: ${error.message}`, "error");
    return;
  }

  await evaluateSecurity();
}

async function handleSignUp() {
  if (!supabaseClient) {
    showStatus("Configure o Supabase antes de criar o usuário.", "error");
    return;
  }

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (!email || !password) {
    showStatus("Informe email e senha para criar a conta.", "error");
    return;
  }

  showStatus("Criando conta...");

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: email.split("@")[0],
      },
    },
  });

  if (error) {
    showStatus(`Erro ao criar conta: ${error.message}`, "error");
    return;
  }

  if (data.user && !data.session) {
    showStatus("Conta criada. Verifique o e-mail para confirmar antes do acesso administrativo.", "success");
    return;
  }

  await evaluateSecurity();
}

async function handleLogout() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  authCard.classList.remove("hidden");
  dashboard.classList.add("hidden");
  showStatus("Sessão encerrada.", "success");
}

if (authForm) {
  authForm.addEventListener("submit", handleSignIn);
}

if (signupButton) {
  signupButton.addEventListener("click", handleSignUp);
}

if (logoutButton) {
  logoutButton.addEventListener("click", handleLogout);
}

