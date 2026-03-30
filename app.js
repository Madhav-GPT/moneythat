const container = document.getElementById("container");
const loading = document.getElementById("loading");

async function getData() {
    try {
        const response = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
        );

        const data = await response.json();

        displayData(data);
    } catch (error) {
        loading.innerText = "Failed to load data";
        console.log(error);
    }
}

function displayData(coins) {
    loading.style.display = "none";

    container.innerHTML = coins.map(coin => `
        <div class="card">
            <img src="${coin.image}" alt="${coin.name}">
            <h3>${coin.name}</h3>
            <p>Price: $${coin.current_price}</p>
        </div>
    `).join("");
}

getData();