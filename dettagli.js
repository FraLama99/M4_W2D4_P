document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const productAsin = urlParams.get('asin');

    if (!productAsin) {
        console.error('ASIN non trovato nella query string');
        return;
    }


    fetch('https://striveschool-api.herokuapp.com/books')
        .then(response => response.json())
        .then(books => {
            const product = books.find(p => p.asin === productAsin);
            if (!product) {
                throw new Error('Prodotto non trovato');
            }
            renderBookDetails(product);
        })
        .catch(error => {
            console.error('Errore:', error);
            document.getElementById('dettagliLibro').innerHTML =
                '<div class="alert alert-danger">Errore nel caricamento dei dettagli</div>';
        });
});

function renderBookDetails(product) {
    const detailsContainer = document.getElementById('dettagliLibro');
    detailsContainer.innerHTML = `
        <div class="container-fluid m-4">
            <div class="container d-flex gap-3 ">
                <div class="col-md-4">
                    <img src="${product.img}" alt="${product.title}" 
                         style="max-width: 100%; object-fit: contain;">
                </div>
                <div class="col-md-8 d-flex flex-column justify-content-between">
                    <h2 class="mb-3">${product.title}</h2>
                    <div class="mb-3">
                        <span class="badge bg-secondary">${product.category}</span>
                    </div>
                    <p>
                        <strong>ASIN:</strong> ${product.asin}
                    </p>
                    <p>
                        <strong>Prezzo:</strong> €${product.price.toFixed(2)}
                    </p>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-start mt-4">
                        <button class="btn btn-primary" onclick="addToCart('${product.asin}')">
                            <i class="bi bi-cart-plus"></i> Aggiungi al Carrello
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.href='index.html'">
                            Torna alla Lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
