let cryptoData = [];

const gridContainer = document.getElementById('crypto-grid');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

const globalMcapEl = document.getElementById('global-mcap');
const globalVolumeEl = document.getElementById('global-volume');
const topGainerEl = document.getElementById('top-gainer');
const totalCoinsEl = document.getElementById('total-coins');

async function fetchCryptoData() {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true';

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

function formatLargeNumber(num) {
    if (!num) return 'N/A';
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    return '$' + num.toLocaleString();
}

function updateSummary() {
    totalCoinsEl.textContent = cryptoData.length;
    
    if (cryptoData.length > 0) {
        const totalMcap = cryptoData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
        globalMcapEl.textContent = formatLargeNumber(totalMcap);

        const totalVolume = cryptoData.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
        globalVolumeEl.textContent = formatLargeNumber(totalVolume);

        const topGainer = [...cryptoData].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))[0];
        topGainerEl.textContent = topGainer ? `${topGainer.name} (+${topGainer.price_change_percentage_24h.toFixed(1)}%)` : 'N/A';
        topGainerEl.style.color = 'var(--color-positive)';
    }
}

function renderCards(data) {
    gridContainer.innerHTML = '';

    data.forEach(coin => {
        const change = coin.price_change_percentage_24h || 0;
        const isPositive = change >= 0;
        const changeClass = isPositive ? 'positive' : 'negative';
        const changeSign = isPositive ? '+' : '';
        const arrow = isPositive ? '▲' : '▼';

        const card = document.createElement('div');
        card.className = 'card glass';

        const sparklineSvg = generateSparkline(coin.sparkline_in_7d?.price || [], isPositive);

        card.innerHTML = `
            <div class="card-header">
                <div class="coin-info">
                    <img class="coin-icon" src="${coin.image}" alt="${coin.name} logo">
                    <div class="coin-names">
                        <h2>${coin.name}</h2>
                        <span>${coin.symbol}</span>
                    </div>
                </div>
                <div class="pill ${changeClass}">
                    ${arrow} ${Math.abs(change).toFixed(2)}%
                </div>
            </div>
            
            <div class="card-price">$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
            
            <div class="sparkline-container">
                ${sparklineSvg}
            </div>

            <div class="card-metrics">
                <div class="metric">
                    <span class="metric-label">Market Cap</span>
                    <span class="metric-value">${formatLargeNumber(coin.market_cap)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">24h Volume</span>
                    <span class="metric-value">${formatLargeNumber(coin.total_volume)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">24h High</span>
                    <span class="metric-value">$${coin.high_24h?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) || '-'}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">24h Low</span>
                    <span class="metric-value">$${coin.low_24h?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) || '-'}</span>
                </div>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

function generateSparkline(data, isPositive) {
    if (!data || data.length === 0) return '';
    
    const width = 300;
    const height = 50;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const stepX = width / (data.length - 1);
    
    const points = data.map((price, index) => {
        const x = index * stepX;
        const y = height - ((price - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const color = isPositive ? 'var(--color-positive)' : 'var(--color-negative)';
    const strokeColor = color;
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    const pathD = `M 0,${height} L ${points.split(' ')[0]} L ${points} L ${width},${height} Z`;

    return `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
            <path d="${pathD}" fill="${fillColor}" />
            <polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
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
        } else if (sortValue === 'volume_desc') {
            return b.total_volume - a.total_volume;
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

setInterval(fetchCryptoData, 60000);

fetchCryptoData();