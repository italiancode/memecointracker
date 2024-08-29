import { LitElement, html, css } from "lit";
import { fetchMemeCoins } from "../utils/api";
import globalSemanticCSS from "../css/global-semanticCSS";

export class MemeCoinTracker extends LitElement {
  static styles = [globalSemanticCSS, css``];

  static properties = {
    coins: { type: Array },
    filteredCoins: { type: Array },
    searchQuery: { type: String },
    visibleCount: { type: Number },
    selectedCoinId: { type: String }, // Track selected coin
  };

  constructor() {
    super();
    this.coins = [];
    this.filteredCoins = [];
    this.searchQuery = "";
    this.visibleCount = 5; // Initially show 5 coins
    this.selectedCoinId = null; // No coin selected initially
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadCoins();
  }

  async loadCoins() {
    try {
      this.coins = await fetchMemeCoins();
      this.filteredCoins = this.coins;
    } catch (error) {
      console.error("Error loading meme coins:", error);
      this.coins = [];
      this.filteredCoins = [];
    }
  }

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.filteredCoins = this.coins.filter((coin) =>
      coin.name.toLowerCase().includes(this.searchQuery)
    );
    this.visibleCount = 5; // Reset visible count when searching
  }

  loadMore() {
    this.visibleCount += 5;
  }

  toggleDetails(coinId) {
    this.selectedCoinId = this.selectedCoinId === coinId ? null : coinId;
  }

  render() {
    return html`
      <div class="container">
        <h1>MemeCoin Tracker</h1>
        <input
          type="text"
          class="search"
          placeholder="Search MemeCoins"
          @input="${this.handleSearch}"
        />
        ${this.filteredCoins.length === 0
          ? html`<p>No MemeCoins found...</p>`
          : this.filteredCoins.slice(0, this.visibleCount).map(
              (coin) => html`
                <div class="coin" @click="${() => this.toggleDetails(coin.id)}">
                  <div class="coin-header">
                    <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
                    <span>
                      $${coin.current_price
                        ? coin.current_price.toFixed(8)
                        : "N/A"}
                    </span>
                  </div>
                  <div class="coin-analytics">
                    <span
                      >Market Cap: $${coin.market_cap.toLocaleString()}</span
                    >
                    <span
                      >24h Change:
                      ${coin.price_change_percentage_24h?.toFixed(2) ||
                      "N/A"}%</span
                    >
                    <span>Volume: $${coin.total_volume.toLocaleString()}</span>
                  </div>
                  <div
                    class="coin-details ${this.selectedCoinId === coin.id
                      ? "show"
                      : ""}"
                  >
                    <p>
                      Supply: ${coin.total_supply?.toLocaleString() || "N/A"}
                    </p>
                    <p>ATH: $${coin.ath?.toFixed(8) || "N/A"}</p>
                    <p>ATL: $${coin.atl?.toFixed(8) || "N/A"}</p>
                  </div>
                </div>
              `
            )}
        ${this.visibleCount < this.filteredCoins.length
          ? html`<button class="load-more" @click="${this.loadMore}">
              Load More
            </button>`
          : ""}
      </div>
    `;
  }
}

customElements.define("meme-coin-tracker", MemeCoinTracker);

export default MemeCoinTracker;
