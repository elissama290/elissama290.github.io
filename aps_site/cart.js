// ----------------------
// VARIÁVEIS GLOBAIS
// ----------------------
let cart = [];

// Elementos do carrinho
const cartCountElement = document.getElementById('cart-count');
const cartItemsElement = document.getElementById('cart-items');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartTotalElement = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-btn');
const clearCartButton = document.getElementById('clear-cart-btn');
const emptyCartMessage = document.getElementById('empty-cart-message');

// ----------------------
// FUNÇÕES DO CARRINHO
// ----------------------
function renderCart() {
    cartItemsElement.innerHTML = '';

    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'flex';
        checkoutButton.disabled = true;
        clearCartButton.disabled = true;
    } else {
        emptyCartMessage.style.display = 'none';
        checkoutButton.disabled = false;
        clearCartButton.disabled = false;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        totalItems += item.quantity;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <h6 class="mb-0">${item.name}</h6>
                <small class="text-muted">R$ ${item.price.toFixed(2)} x ${item.quantity}</small>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-danger me-2 remove-item" data-id="${item.id}">
                    🗑
                </button>
                <span class="fw-bold">R$ ${itemTotal.toFixed(2)}</span>
            </div>
        `;
        cartItemsElement.appendChild(li);
    });

    const formattedSubtotal = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    cartSubtotalElement.textContent = formattedSubtotal;
    cartTotalElement.textContent = formattedSubtotal;
    cartCountElement.textContent = totalItems;
}

function addToCart(productId, name, price) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, name: name, price: price, quantity: 1 });
    }

    renderCart();
}

// ----------------------
// EVENTOS
// ----------------------

// Adicionar ao carrinho
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', e => {
        const card = e.target.closest('.product-card');
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price'));

        addToCart(id, name, price);

        // Abre o carrinho (se usar offcanvas)
        const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
        cartOffcanvas.show();
    });
});

// Remover item
cartItemsElement.addEventListener('click', e => {
    if (e.target.closest('.remove-item')) {
        const idToRemove = e.target.closest('.remove-item').getAttribute('data-id');
        cart = cart.filter(item => item.id !== idToRemove);
        renderCart();
    }
});

// Esvaziar
clearCartButton.addEventListener('click', () => {
    cart = [];
    renderCart();
});

// ----------------------
// FINALIZAR COMPRA
// ----------------------
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("🛒 O carrinho está vazio!");
        return;
    }

    console.log("📦 Enviando carrinho:", cart); // <- TESTE: veja se aparece no console

    fetch('salvarpedido.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            carrinho: cart,
            total: cartTotalElement.textContent
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("📩 Resposta do servidor:", data); // <- TESTE
            if (data.status === 'sucesso') {
                alert("✅ " + data.mensagem);
                clearCart();
            } else {
                alert("⚠️ " + data.mensagem);
            }
        })
        .catch(() => alert("❌ Falha na comunicação com o servidor."));
});

renderCart();
