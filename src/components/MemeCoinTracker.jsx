import { LitElement, html, css } from "lit";
import { fetchMemeCoins } from "../utils/api";
import { log, error, warn } from "../utils/logger";
import globalSemanticCSS from "../css/global-semanticCSS";
import { TWStyles } from "../css/twlit";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";

import "./BuySellButtons"; // Import the new component
import HeaderReactComponent from "./react/HeaderReactComponent";
import { createRoot } from "react-dom/client";

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

    // Initialize CanvasClient
    this.canvasClient = new CanvasClient();
  }

  async initializeCanvas() {
    try {
      const response = await this.canvasClient.ready();

      if (response) {
        const user = response.untrusted.user;
        const content = response.untrusted.content;

        log("User Info:", user);
        log("Content Info:", content);

        // You can now use user and content information in your app logic
      }
    } catch (error) {
      error("Error during CanvasClient initialization:", error);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadCoins();

    // Initialize CanvasClient once iframe is available
    this.initializeCanvas();

    // Set up ResizeObserver
    this.resizeObserver = new ResizeObserver(() => {
      this.requestResize();
    });

    // Delay the observation to ensure the element is available
    setTimeout(() => {
      const container = this.shadowRoot.querySelector(".container");
      if (container) {
        this.resizeObserver.observe(container);
        log("ResizeObserver is now observing the container.");
      } else {
        error("Container element not found for ResizeObserver.");
      }
    }, 0); // Delay by 0ms, adjust if needed
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      log("ResizeObserver disconnected.");
    }
    this.canvasClient = undefined; // Cleanup CanvasClient reference
  }

  async requestResize() {
    try {
      log("Requesting resize...");

      if (this.canvasClient) {
        const container = this.shadowRoot.querySelector(".container");
        if (container) {
          const width = container.clientWidth;
          const height = container.clientHeight;

          log(`Resizing canvas to ${width}px x ${height}px`);

          // Adjust the method to check if CanvasClient resize has a specific format or handling
          const resizeResult = await this.canvasClient.resize({
            width: width,
            height: height,
          });

          log("Resize result:", resizeResult);
        } else {
          warn("Container element not found for ResizeObserver.");
        }
      }
    } catch (error) {
      error("Error during CanvasClient resize:", error);
    }
  }

  async loadCoins() {
    try {
      this.coins = await fetchMemeCoins();
      this.filteredCoins = this.coins;
    } catch (error) {
      error("Error loading meme coins:", error);
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

  render() {
    return html`
      <div class="container bg-[#0C0F14]">
        <div id="react-root"></div>
        <input
          type="text"
          class="search mt-4 p-2 w-full rounded bg-gray-800 text-white"
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

                    <div class="coin-analytics flex justify-between gap-5">
                      <div class="grid justify-center gap-3">
                        <p>
                          Supply:
                          ${coin.total_supply?.toLocaleString() || "N/A"}
                        </p>
                        <p>ATH: $${this.formatPrice(coin.ath) || "N/A"}</p>
                        <p>ATL: $${this.formatPrice(coin.atl) || "N/A"}</p>
                      </div>
                      <div class="">
                        <buy-sell-buttons
                          .contractAddress="${coin.contract_address}"
                        ></buy-sell-buttons>
                        <!-- Use the new component -->
                      </div>
                    </div>
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

  firstUpdated() {
    const reactRoot = this.renderRoot.querySelector("#react-root");
    if (reactRoot) {
      const root = createRoot(reactRoot);
      root.render(<HeaderReactComponent />);
    }
  }
}

customElements.define("meme-coin-tracker", MemeCoinTracker);

export default MemeCoinTracker;
