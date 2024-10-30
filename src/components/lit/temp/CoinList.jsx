// src/components/CoinList.jsx
import { html } from "lit";

export const CoinList = ({ filteredCoins, visibleCount, toggleDetails, formatPrice, selectedCoinId }) => {
  return html`
    ${filteredCoins.length === 0
      ? html`<p>No MemeCoins found...</p>`
      : filteredCoins.slice(0, visibleCount).map(
          (coin) => html`
            <div class="coin" @click="${() => toggleDetails(coin.id)}">
              <div class="coin-header">
                <div class="flex-div">
                  <img src="${coin.icon}" alt="${coin.name} icon" />
                  <p>${coin.name} (${coin.symbol.toUpperCase()})</p>
                </div>
                <span>
                  $${coin.current_price ? formatPrice(coin.current_price) : "N/A"}
                </span>
              </div>
              <div class="coin-details space-y-4 ${selectedCoinId === coin.id ? "show" : ""}">
                <div class="coin-analytics flex justify-between gap-5">
                  <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
                  <p>
                    24h Change:
                    ${coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : "N/A"}%
                  </p>
                  <p>Volume: $${coin.total_volume.toLocaleString()}</p>
                </div>
                <div class="coin-analytics flex justify-between gap-5">
                  <div class="grid justify-center gap-3">
                    <p>Supply: ${coin.total_supply?.toLocaleString() || "N/A"}</p>
                    <p>ATH: $${formatPrice(coin.ath) || "N/A"}</p>
                    <p>ATL: $${formatPrice(coin.atl) || "N/A"}</p>
                  </div>
                  <div>
                    <buy-sell-buttons .contractAddress="${coin.contract_address}"></buy-sell-buttons>
                  </div>
                </div>
              </div>
            </div>
          `
        )}
  `;
};

