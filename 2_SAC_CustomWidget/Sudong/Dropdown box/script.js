class MyDropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: inline-block;
                            position: relative;
                            overflow: visible;
                        }
                        .dropdown {
                            border: 1px solid #ccc;
                            padding: 5px;
                            cursor: pointer;
                        }
                        .dropdown-content {
                            display: none;
                            position: absolute;
                            background-color: #f9f9f9;
                            min-width: 160px;
                            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                            z-index: 1;
                        }
                        .dropdown-content ::slotted(*) {
                            color: black;
                            padding: 12px 16px;
                            text-decoration: none;
                            display: block;
                        }
                        .dropdown-content ::slotted(*:hover) {
                            background-color: #f1f1f1;
                        }
                    </style>
                    <div class="dropdown">
                        <span>Select an option</span>
                    </div>
                    <div class="dropdown-content">
                        <slot name="option"></slot>
                    </div>
                `;

    this.dropdown = this.shadowRoot.querySelector(".dropdown");
    this.content = this.shadowRoot.querySelector(".dropdown-content");

    this.dropdown.addEventListener("click", () => {
      this.content.style.display =
        this.content.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) {
        this.content.style.display = "none";
      }
    });
  }
}

customElements.define("my-dropdown", MyDropdown);
