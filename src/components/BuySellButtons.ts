// BuySellButtons.ts
import { LitElement, html, css } from "lit";

export class BuySellButtons extends LitElement {
  static properties = {
    contractAddress: { type: String },
  };

  static styles = [
    css`
      .buttons-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 10px 0;
        flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
      }
      .button {
        display: inline-flex; /* Ensure buttons use flexbox to manage text */
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        font-size: 0.875rem; /* Smaller font size */
        border: none;
        border-radius: 5px;
        color: #fff;
        cursor: not-allowed;
        opacity: 0.6; /* Slightly transparent to indicate disabled state */
        transition: background-color 0.3s, opacity 0.3s, box-shadow 0.3s;
        width: auto; /* Allow width to adjust based on content */
        max-width: 150px; /* Set a max-width to prevent excessive growth */
        white-space: nowrap; /* Prevent text from wrapping */
        overflow: hidden; /* Hide overflow text */
        text-align: center; /* Center text within buttons */
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5); /* Neon text shadow */
      }
      .button.buy {
        background-color: #39ff14; /* Neon green for Buy */
        border: 2px solid #39ff14; /* Neon green border */
      }
      .button.sell {
        background-color: #ff073a; /* Neon red for Sell */
        border: 2px solid #ff073a; /* Neon red border */
      }
      .button.active {
        cursor: not-allowed;
        opacity: 0.6; /* Keep the same opacity for the disabled state */
      }
      @media (min-width: 600px) {
        .button {
          font-size: 1rem; /* Slightly increase font size on larger screens */
        }
      }
    `,
  ];

  render() {
    return html`
      <div class="buttons-container">
        <button class="button buy">Buy</button>
        <button class="button sell">Sell</button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "buy-sell-buttons": BuySellButtons;
  }
}

customElements.define("buy-sell-buttons", BuySellButtons);
