import { LitElement, html, css } from "lit";
import { fetchMemeCoins } from "../utils/api";
import { log, error, warn } from "../utils/logger";
import globalSemanticCSS from "../css/global-semanticCSS";
import { TWStyles } from "../css/twlit";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";

import "./BuySellButtons"; // Import the new component
import HeaderReactComponent from "./react/HeaderReactComponent";
import { createRoot } from "react-dom/client";
import { CoinList } from "./lit/temp/CoinList";

export class MemeCoinTracker extends LitElement {
  static styles = [TWStyles, globalSemanticCSS, css``];

  static properties = {
    coins: { type: Array },
    filteredCoins: { type: Array },
    searchQuery: { type: String },
    visibleCount: { type: Number },
    selectedCoinId: { type: String },
    isLoading: { type: Boolean },
  };

  constructor() {
    super();
    this.coins = [];
    this.filteredCoins = [];
    this.searchQuery = "";
    this.visibleCount = 5;
    this.selectedCoinId = null;
    this.isLoading = false; // Initialize loading state
    this.canvasClient = null; // Initialize canvasClient as null
  }

  componentDidMount() {
    // Ensure referrer is defined before initializing CanvasClient
    const referrer =
      typeof window !== "undefined" && window.location.href
        ? window.location.href
        : "defaultReferrer"; // Provide a default if needed
    this.canvasClient = new CanvasClient({ referrer }); // Pass the referrer
  }

  async initializeCanvas() {
    if (!this.canvasClient) {
      error("CanvasClient is not initialized.");
      return; // Exit if canvasClient is null
    }

    try {
      const response = await this.canvasClient.ready();

      if (response) {
        const user = response.untrusted.user;
        const content = response.untrusted.content;

        log("User Info:", user);
        log("Content Info:", content);
      }
    } catch (err) {
      error("Error during CanvasClient initialization:", err);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadCoins();

    // Initialize CanvasClient once iframe is available
    this.initializeCanvas(); // Call initializeCanvas directly, as it will handle null case

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
    this.isLoading = true; // Set loading state to true
    try {
      this.coins = await fetchMemeCoins();
      this.filteredCoins = this.coins;
    } catch (error) {
      error("Error loading meme coins:", error);
      this.coins = [];
      this.filteredCoins = [];
    } finally {
      this.isLoading = false; // Reset loading state
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
        ${this.isLoading
          ? html`<p>Loading coins...</p>` // Show loading message
          : CoinList({
              filteredCoins: this.filteredCoins,
              visibleCount: this.visibleCount,
              toggleDetails: this.toggleDetails.bind(this),
              formatPrice: this.formatPrice.bind(this),
              selectedCoinId: this.selectedCoinId,
            })}
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
