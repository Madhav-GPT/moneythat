let cryptoData = [];

const gridContainer = document.getElementById('crypto-grid');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const totalCoinsEl = document.getElementById('total-coins');
const topCoinEl = document.getElementById('top-coin-name');

async function fetchCryptoData() {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        cryptoData = await response.json();

        loadingMessage.classList.add('hidden');
        gridContainer.classList.remove('hidden');

        updateSummary();

        renderCards(cryptoData);

    } catch (error) {
        console.error('Error fetching data:', error);
        loadingMessage.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}

function renderCards(data) {
    gridContainer.innerHTML = '';

    data.forEach(coin => {
        const changeClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
        const changeSign = coin.price_change_percentage_24h >= 0 ? '+' : '';

        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <img src="${coin.image}" alt="${coin.name} logo">
            <h2>${coin.name} <span class="symbol">(${coin.symbol})</span></h2>
            <p class="price">$${coin.current_price.toLocaleString()}</p>
            <p class="change ${changeClass}">
                ${changeSign}${coin.price_change_percentage_24h.toFixed(2)}% (24h)
            </p>
        `;

        gridContainer.appendChild(card);
    });
}

function updateSummary() {
    totalCoinsEl.textContent = cryptoData.length;
    if (cryptoData.length > 0) {
        topCoinEl.textContent = cryptoData[0].name;
    }
}

function handleSearchAndSort() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    let filteredData = cryptoData.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm) ||
        coin.symbol.toLowerCase().includes(searchTerm)
    );

    filteredData.sort((a, b) => {
        if (sortValue === 'market_cap_desc') {
            return b.market_cap - a.market_cap;
        } else if (sortValue === 'price_desc') {
            return b.current_price - a.current_price;
        } else if (sortValue === 'price_asc') {
            return a.current_price - b.current_price;
        } else if (sortValue === 'name_asc') {
            return a.name.localeCompare(b.name);
        }
    });

    renderCards(filteredData);
}

searchInput.addEventListener('input', handleSearchAndSort);
sortSelect.addEventListener('change', handleSearchAndSort);

fetchCryptoData();