// =======================================================
// 1. CONFIGURAÇÕES INICIAIS E ESTADO
// =======================================================
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// =======================================================
// 2. CONTROLE DE MODAIS (ABRIR E FECHAR)
// =======================================================
function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

// Funções globais chamadas pelo HTML (onclick)
window.fecharLogin = () => fecharModal("loginModal");
window.fecharRegister = () => fecharModal("registerModal");
window.fecharForgot = () => fecharModal("forgotModal");

window.abrirRegister = () => { fecharModal("loginModal"); abrirModal("registerModal"); };
window.abrirForgot = () => { fecharModal("loginModal"); abrirModal("forgotModal"); };
window.abrirLogin = () => abrirModal("loginModal");

// Fechar ao clicar fora do modal
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
});

// =======================================================
// 3. LÓGICA DE AUTENTICAÇÃO (SEM SERVIDOR / LOCALSTORAGE)
// =======================================================

// REGISTRO DE USUÁRIO
document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const nome = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const senha = document.getElementById('regPassword').value;
    const feedback = document.getElementById("regFeedback");

    const usuario = { nome, email, senha };
    localStorage.setItem("usuarioCadastro", JSON.stringify(usuario));

    if (feedback) feedback.innerHTML = "<span style='color:green'>✔ Conta criada! Faça login.</span>";

    setTimeout(() => {
        fecharRegister();
        abrirLogin();
    }, 1000);
});

// LOGIN DE USUÁRIO
document.getElementById('logForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInformado = document.getElementById('loginEmail').value;
    const senhaInformada = document.getElementById('loginPassword').value;
    const feedback = document.getElementById("logFeedback");

    const dadosSalvos = localStorage.getItem("usuarioCadastro");

    if (!dadosSalvos) {
        if (feedback) feedback.innerHTML = "<span style='color:red'>❌ Conta não encontrada!</span>";
        return;
    }

    const usuario = JSON.parse(dadosSalvos);

    if (emailInformado === usuario.email && senhaInformada === usuario.senha) {
        localStorage.setItem("usuarioLogado", "true");
        localStorage.setItem("nomeUsuario", usuario.nome);
        if (feedback) feedback.innerHTML = "<span style='color:green'>✔ Bem-vindo(a)!</span>";

        setTimeout(() => window.location.reload(), 800);
    } else {
        if (feedback) feedback.innerHTML = "<span style='color:red'>❌ E-mail ou senha incorretos!</span>";
    }
});

// VERIFICAÇÃO DE LOGIN AO CARREGAR PÁGINA
window.addEventListener('load', () => {
    const logado = localStorage.getItem("usuarioLogado");
    const loginBtn = document.getElementById("loginBtn");

    if (logado === "true" && loginBtn) {
        const nome = localStorage.getItem("nomeUsuario") || "Usuário";
        loginBtn.innerHTML = `Olá, ${nome.split(' ')[0]} (Sair)`;
        loginBtn.style.background = "#6b4513";

        loginBtn.onclick = () => {
            localStorage.removeItem("usuarioLogado");
            window.location.reload();
        };
    } else if (loginBtn) {
        loginBtn.onclick = abrirLogin;
    }
});

// =======================================================
// 4. CARRINHO DE COMPRAS
// =======================================================
document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
        const nome = btn.getAttribute('data-name');
        const preco = parseFloat(btn.getAttribute('data-price'));
        const id = btn.getAttribute('data-id') || nome;

        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        const itemExistente = carrinho.find(item => item.nome === nome);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ id, nome, preco, quantidade: 1 });
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        // Feedback visual no botão
        const textoOriginal = btn.innerText;
        btn.innerText = "Adicionado! ✓";
        btn.style.background = "#28a745";

        setTimeout(() => {
            window.location.href = "carrinho.html";
        }, 600);
    });
});

// =======================================================
// 5. FORMULÁRIO DE CONTATO E AVALIAÇÕES
// =======================================================
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const reviewsContainer = document.getElementById('reviewsContainer');

    if (reviewsContainer) {
        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.style.border = "2px solid #b88a50";
        newCard.innerHTML = `<p>"${message}"</p><span>- ${name} (Agora mesmo)</span>`;
        reviewsContainer.prepend(newCard);
        newCard.scrollIntoView({ behavior: 'smooth' });
    }

    alert("Obrigado pela sua mensagem!");
    this.reset();
});
function abrirLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

function abrirRegister() {
    fecharLogin(); // Fecha o de login antes
    document.getElementById('registerModal').style.display = 'flex';
}

function abrirForgot() {
    fecharLogin();
    document.getElementById('forgotModal').style.display = 'flex';
}

// Para fechar, pode manter o 'none'
function fecharLogin() {
    document.getElementById('loginModal').style.display = 'none';
}
function fecharRegister() {
    document.getElementById('registerModal').style.display = 'none';
}
function fecharForgot() {
    document.getElementById('forgotModal').style.display = 'none';
}