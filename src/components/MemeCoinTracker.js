import { LitElement, html, css } from "lit";
import { fetchMemeCoins } from "../utils/api";
import globalSemanticCSS from "../css/global-semanticCSS";
import { TWStyles } from "../css/twlit";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";

export class MemeCoinTracker extends LitElement {
  static styles = [TWStyles, globalSemanticCSS, css``];

  static properties = {
    coins: { type: Array },
    filteredCoins: { type: Array },
    searchQuery: { type: String },
    visibleCount: { type: Number },
    selectedCoinId: { type: String },
  };

  constructor() {
    super();
    this.coins = [];
    this.filteredCoins = [];
    this.searchQuery = "";
    this.visibleCount = 5;
    this.selectedCoinId = null;
    this.canvasClient = new CanvasClient();
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadCoins();
    window.addEventListener("resize", this.requestResize.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.requestResize.bind(this));
  }

  firstUpdated() {
    // Call requestResize after the component is rendered
    this.requestResize();
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
    this.visibleCount = 5;
  }

  loadMore() {
    this.visibleCount += 5;
  }

  toggleDetails(coinId) {
    this.selectedCoinId = this.selectedCoinId === coinId ? null : coinId;
  }

  formatPrice(price) {
    if (price >= 1) {
      return price.toFixed(2);
    } else if (price < 1 && price > 0.001) {
      return price.toFixed(3);
    } else if (price <= 0.001 && price > 0) {
      let formatted = price.toPrecision(3);
      return parseFloat(formatted).toString();
    } else {
      return "N/A";
    }
  }

  requestResize() {
    const container = this.shadowRoot.querySelector(".container");
    if (container && container.clientWidth > 0 && container.clientHeight > 0) {
      const width = container.clientWidth;
      const height = container.clientHeight;

      console.log("Resizing canvas...");
      console.log("Calculated Width:", width);
      console.log("Calculated Height:", height);
      console.log("CanvasClient Instance:", this.canvasClient);

      this.canvasClient.resize({
        height: `${height}px`,
      });

      console.log("Resize request sent to CanvasClient");
    } else {
      console.error(
        "Container element not properly sized or not found. Retrying..."
      );
      setTimeout(() => {
        this.requestResize();
      }, 100);
    }
  }

  render() {
    return html`
      <div class="container" style="background-color: #0C0F14;">
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
                    <div class="flex-div">
                      <img src="${coin.icon}" alt="${coin.name} icon" />
                      <p>${coin.name} (${coin.symbol.toUpperCase()})</p>
                    </div>
                    <span>
                      $${coin.current_price
                        ? this.formatPrice(coin.current_price)
                        : "N/A"}
                    </span>
                  </div>
                  <div
                    class="coin-details space-y-4 ${this.selectedCoinId ===
                    coin.id
                      ? "show"
                      : ""}"
                  >
                    <div class="coin-analytics flex justify-between gap-5">
                      <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
                      <p>
                        24h Change:
                        ${coin.price_change_percentage_24h
                          ? coin.price_change_percentage_24h.toFixed(2)
                          : "N/A"}%
                      </p>
                      <p>Volume: $${coin.total_volume.toLocaleString()}</p>
                    </div>
                    <p>
                      Supply: ${coin.total_supply?.toLocaleString() || "N/A"}
                    </p>
                    <p>ATH: $${this.formatPrice(coin.ath) || "N/A"}</p>
                    <p>ATL: $${this.formatPrice(coin.atl) || "N/A"}</p>
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
