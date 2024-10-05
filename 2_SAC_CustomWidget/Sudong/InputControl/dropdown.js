(function () {
  const template = document.createElement("template");
  template.innerHTML = `
                    <style>
                        :host {
                            display: inline-block;
                            border: 2px dashed #ff6b6b;
                            padding: 20px;
                            border-radius: 8px;
                        }
                        .dropdown-button {
                            background-color: #4CAF50;
                            color: white;
                            padding: 12px 20px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 16px;
                        }
                        .dropdown-button:hover {
                            background-color: #45a049;
                        }
                        #dropdown-list {
                            background-color: white;
                            min-width: 160px;
                            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                            display: none;
                            border-radius: 4px;
                        }
                        #dropdown-list div {
                            padding: 12px 16px;
                            cursor: pointer;
                        }
                        #dropdown-list div:hover {
                            background-color: #f1f1f1;
                        }
                    </style>
                    <div class='dropdown'>
                        <button id='dropdown-toggle' class='dropdown-button'>드롭다운 메뉴</button>
                        <div id='dropdown-list'>
                            <div>옵션 1</div>
                            <div>옵션 2</div>
                            <div>옵션 3</div>
                        </div>
                    </div>
                `;
  class Main extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._toggle = this._shadowRoot.getElementById("dropdown-toggle");
      this._list = this._shadowRoot.getElementById("dropdown-list");
      //this._list.style.display = "none";
    }

    connectedCallback() {
      this.setupListeners();
    }

    setupListeners() {
      this._toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = this._toggle.getBoundingClientRect();
        this._list.style.top = `${rect.bottom + 5}px`;
        this._list.style.left = `${rect.left}px`;
        this._list.style.display =
          this._list.style.display === "none" ? "block" : "none";
      });

      document.addEventListener("click", (e) => {
        if (!this._shadowRoot.contains(e.target)) {
          this._list.style.display = "none";
        }
      });

      this._list.addEventListener("click", (e) => {
        if (e.target.tagName === "DIV") {
          console.log("선택된 옵션:", e.target.textContent);
          this._list.style.display = "none";
        }
      });
    }
  }

  customElements.define("com-sap-sac-dropdown-sample1-main", Main);
})();
