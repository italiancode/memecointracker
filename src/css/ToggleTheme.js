import { LitElement, html, css } from "lit";
import { setThemePreference } from "../../app";
import { TWStyles } from "./twlit";
import globalSemanticCSS from "./global-semanticCSS";

class ToggleTheme extends LitElement {
  static styles = [
    TWStyles,
    globalSemanticCSS,
    css`
      :host {
        display: flex;
        justify-items: center;
      }
    `,
  ];

  static properties = {
    darkMode: { type: Boolean },
  };

  constructor() {
    super();
    const storedMode = localStorage.getItem("theme");
    this.darkMode = storedMode
      ? storedMode === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      "theme-changed",
      this.handleThemeChanged.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(
      "theme-changed",
      this.handleThemeChanged.bind(this)
    );
  }

  handleThemeChanged(event) {
    this.darkMode = event.detail.darkMode;
  }

  toggleTheme() {
    const themeManager = document.querySelector("app-manager");
    if (themeManager) {
      themeManager.setTheme(!themeManager.darkMode);
    }
    this.darkMode = !this.darkMode;
    setThemePreference(this.darkMode ? "dark" : "light");
  }

  render() {
    return html`
      <button
        class="rounded-full w-8 h-8"
        @click=${this.toggleTheme}
        aria-label="Toggle Mode"
        role="button"
        tabindex="0"
      >
        ${this.darkMode
          ? html`
              <!-- Dark mode icon -->
              <svg
                class="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            `
          : html`
              <!-- Light mode icon -->
              <svg
                class="w-6 h-6 md:w-8 md:h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            `}
      </button>
    `;
  }
}

customElements.define("toggle-theme", ToggleTheme);
