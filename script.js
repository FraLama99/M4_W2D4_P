let negozio = {
    nomeNegozio: "negozio di libracci",
    indirizzo: "Piazza la Bomba e scabba 12, 10091 Alpignano (TO)",
    metodiPagamento: ["Carta di Credito", "PayPal", "Bonifico Bancario", "Contrassegno"],
    speseSpedizione: 5.99,
    sogliaSpedizioneGratuita: 50.00,
    codiciSconto: [
        { nomeCodice: "WELCOME10", percentualeSconto: 10 },
        { nomeCodice: "DICEBRE30", percentualeSconto: 30 },
        { nomeCodice: "BLACKFRIDAY", percentualeSconto: 20 }
    ]
};

const API_KEY = 'https://striveschool-api.herokuapp.com/books';
document.addEventListener('DOMContentLoaded', function () {
    initializeUI();
    fetchBook();
    initializeEvents();
    initializeSearch();

    document.getElementById('svuotaCarrello').addEventListener('click', removeAllCart);
});
function initializeUI() {

    document.getElementById('nomeNegozio').textContent = negozio.nomeNegozio;
    document.getElementById('indirizzoNegozio').textContent = negozio.indirizzo;
    const metodiPagamentoList = document.getElementById('metodiPagamento');
    for (let i = 0; i < negozio.metodiPagamento.length; i++) {
        const li = document.createElement('li');
        li.textContent = negozio.metodiPagamento[i];
        metodiPagamentoList.appendChild(li);
    }

    document.getElementById('infoSpedizione').textContent =
        `Spese di spedizione: €${negozio.speseSpedizione}\nSpedizione gratuita per ordini superiori a €${negozio.sogliaSpedizioneGratuita}`;
}
let books = [];
let cart = [];



function fetchBook() {
    return fetch(API_KEY)
        .then(response => response.json())
        .then(data => {
            books = data;
            renderBooks(books);
        })
        .catch(error => console.error('Errore:', error));
}

function renderBooks(books) {
    const container = document.getElementById('containerCard');
    if (!container) return;

    container.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'row g-4';

    books.forEach(book => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-3 ';
        col.innerHTML = `
            <div class="card h-100" id="cardBook" data-asin="${book.asin}">
                <img src="${book.img}" class="card-img-top" alt="${book.title}" style="height: 300px; object-fit: cover;">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">
                        <span class="badge bg-secondary">${book.category}</span>
                    </p>
                    <p class="card-text">
                        <strong>Prezzo: €${book.price.toFixed(2)}</strong>
                    </p>
                       
                    <div class="card-footer  d-flex flex-column justify-content-end align-items-center gap-2">
                    <div>
                    <button class="btn btn-primary px-1 " onclick="addToCart('${book.asin}')">
                        <i class="bi bi-bag-plus"> Aggiungi al Carrello</i>
                    </button>
                    </div>
                    <div>
                     <button class="btn btn-danger my-auto bottoneCancella" onclick="saltaCard('${book.asin}')">
                        <i class="bi bi-folder-minus"> Nascondi </i>
                    </button>
                    <button class="btn btn-success my-auto dettagli" onclick="dettagliCard('${book.asin}')">
                        <i class="bi bi-view-list"> Dettagli </i>
                    </button>
                    </div>
                </div>
            </div>
        `;
        row.appendChild(col);
    });

    container.appendChild(row);
}

function dettagliCard(productAsin) {

    const queryString = `dettagli.html?asin=${productAsin}`;
    window.location.href = queryString;
}

function saltaCard(productAsin) {
    const cardElement = document.querySelector(`[data-asin="${productAsin}"]`);

    if (cardElement) {

        cardElement.style.transition = 'all 0.3s ease';
        cardElement.classList.add('d-none');


        const container = document.getElementById('containerCard');
        const row = container.querySelector('.row');


        setTimeout(() => {
            cardElement.closest('.col-12').remove();


            const remainingCards = row.querySelectorAll('.col-12');
            remainingCards.forEach((card, index) => {
                card.style.transition = 'all 0.3s ease';

                card.style.transform = 'translateX(0)';
            });
        }, 300);

        console.log('Card nascosta:', productAsin);
    } else {
        console.error('Card non trovata:', productAsin);
    }
}

function addToCart(productAsin) {
    console.log('ASIN Prodotto Aggiunto', productAsin);


    const product = books.find(p => p.asin === productAsin);
    if (!product) {
        console.error('Prodotto non trovato:', productAsin);
        return;
    }

    const existingItem = cart.find(item => item.asin === productAsin);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            asin: product.asin,
            title: product.title,
            price: product.price,
            quantity: 1
        });

    }

    const cardElement = document.querySelector(`[data-asin="${productAsin}"]`);
    if (cardElement) {
        cardElement.classList.add('inCart');
    }

    updateCartBadge();
    showCartNotification(product.title);
}

function removeFromCart(productAsin) {
    cart = cart.filter(item => item.asin !== productAsin);


    const cardElement = document.querySelector(`[data-asin="${productAsin}"]`);
    if (cardElement) {
        cardElement.classList.remove('inCart');
    }

    updateCartBadge();
    updateCartModal();
}

function removeAllCart() {

    cart = [];


    const cardsInCart = document.querySelectorAll('.inCart');
    cardsInCart.forEach(card => {
        card.classList.remove('inCart');
    });


    document.getElementById('cartItems').innerHTML = '';


    updateCartBadge();
    updateCartModal();
}


function initializeEvents() {

    document.querySelector('.btn-outline-dark').addEventListener('click', function () {
        updateCartModal();
        new bootstrap.Modal(document.getElementById('cartModal')).show();
    });
}




function updateCartBadge() {
    const badge = document.querySelector('.badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}


function showCartNotification(productTitle) {

    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;


    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }


    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Carrello aggiornato</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${productTitle} è stato aggiunto al carrello
        </div>
    `;


    toastContainer.appendChild(toastElement);


    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });


    toast.show();
}
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItems.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <h6 class="mb-0">${item.title}</h6>
                    <small class="text-muted">Quantità: ${item.quantity}</small>
                </div>
                <div class="text-end">
                    <div>€${itemTotal.toFixed(2)}</div>
                    <button class="btn btn-sm btn-danger" 
                            onclick="removeFromCart('${item.asin}')">
                        Rimuovi
                    </button>
                </div>
            </div>
        `;
    });

    cartTotal.textContent = total.toFixed(2);
}
function initializeSearch() {
    const searchInput = document.getElementById('ricercaTitolo');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const campoRicerca = e.target.value.toLowerCase();


        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(campoRicerca)

        );
        console.log(filteredBooks)

        renderBooks(filteredBooks);
    });
}
