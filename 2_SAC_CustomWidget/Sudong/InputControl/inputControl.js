var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

var parseMetadata = (metadata) => {
  const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } =
    metadata;
  const dimensions = [];
  for (const key in dimensionsMap) {
    const dimension = dimensionsMap[key];
    dimensions.push({ key, ...dimension });
  }
  const measures = [];
  for (const key in measuresMap) {
    const measure = measuresMap[key];
    measures.push({ key, ...measure });
  }
  return { dimensions, measures, dimensionsMap, measuresMap };
};

var transformData = (inputData) => {
  return inputData.map((item) => {
    const dim = item.dimensions_0;
    return {
      id: dim.id,
      parent: dim.parentId || "#",
      text: dim.label,
    };
  });
};

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      @import "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/themes/default/style.min.css";
      #widget-container {
        font-family: Arial, sans-serif;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
      }
      #widget-title {
        font-weight: bold;
        flex-grow: 1;
      }
      #list {
        display: none;
        background-color: white;
        border: 1px solid #ccc;
        overflow-y: auto;
        margin-top: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
      }
    </style>
    <div id="widget-container">
      <div id="widget-title">Airline Code</div>
      <div id="widget-toggle">▼</div>
    </div>
    <div id="list"></div>
  `;

  class Main extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.addEventListener("click", (event) => {
        var event = new Event("onClick");
        this.dispatchEvent(event);
      });
      this._props = {};

      this._list = this._shadowRoot.getElementById("list");
      this._widgetContainer =
        this._shadowRoot.getElementById("widget-container");
      this._widgetToggle = this._shadowRoot.getElementById("widget-toggle");
      this._isTreeVisible = false;
      this.selectedKey = [];
      this.selectedText = [];
      this._originalHeight = null;
    }

    onCustomWidgetBeforeUpdate(changedProps) {
      this._props = { ...this._props, ...changedProps };
    }

    onCustomWidgetAfterUpdate(changedProps) {
      this._originalHeight = this.style.height;
      this.adjustComponentHeight();
      this.render();

      this._widgetContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleTree();
      });

      document.addEventListener("click", (event) => {
        if (
          !this.contains(event.target) &&
          !this._list.contains(event.target)
        ) {
          this.hideTree();
        }
      });
    }

    onCustomWidgetResize(width, height) {
      // 내용 삭제
    }

    onCustomWidgetDestroy() {}

    databinding() {
      const dataBinding = this.dataBinding;
      if (!dataBinding || dataBinding.state !== "success") {
        return;
      }
      const { feed, data, metadata } = dataBinding;
      const { dimensions, measures } = parseMetadata(metadata);
      const treedata = transformData(data);
      return treedata;
    }

    async render() {
      const treedata = this.databinding();
      await getScriptPromisify(
        "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/jstree.min.js"
      );

      if ($(this._list).jstree(true)) {
        $(this._list).jstree("destroy").empty();
      }

      $(this._list).jstree({
        core: {
          data: treedata,
          themes: {
            icons: false,
          },
        },
        plugins: ["checkbox"],
        checkbox: {
          three_state: true,
          whole_node: false,
          tie_selection: false,
        },
      });

      $(this._list).on("check_node.jstree uncheck_node.jstree", (e, data) => {
        const tree = $(this._list).jstree(true);
        const node = data.node;

        let parent = tree.get_node(node.parent);
        while (parent && parent.id !== "#") {
          const siblings = tree.get_children_dom(parent);
          const allChecked =
            siblings.length ===
            siblings.filter(function () {
              return tree.is_checked(this);
            }).length;

          if (allChecked) {
            tree.check_node(parent, true);
          } else {
            tree.uncheck_node(parent, true);
          }
          parent = tree.get_node(parent.parent);
        }

        if (data.node.state.checked) {
          tree.check_node(tree.get_node(data.node).children_d);
        } else {
          tree.uncheck_node(tree.get_node(data.node).children_d);
        }
      });
    }

    adjustComponentHeight() {
      if (!this._originalHeight) {
        this._originalHeight = this.style.height;
      }

      if (this._isTreeVisible) {
        this.style.height = this._originalHeight;
      } else {
        const containerHeight = this._widgetContainer.offsetHeight;
        this.style.height = `${containerHeight}px`;
      }

      if (this._isTreeVisible) {
        const componentHeight = this.offsetHeight;
        const containerHeight = this._widgetContainer.offsetHeight;
        const listHeight = componentHeight - containerHeight - 20;
        this._list.style.height = `${listHeight}px`;
      }
    }

    toggleTree() {
      this._isTreeVisible = !this._isTreeVisible;
      if (this._isTreeVisible) {
        this.showTree();
      } else {
        this.hideTree();
      }
      this.adjustComponentHeight();
    }

    showTree() {
      this._list.style.display = "block";
      this._widgetToggle.textContent = "▲";
      this._widgetToggle.classList.add("collapsed");
      this.style.height = this._originalHeight;
    }

    hideTree() {
      this._isTreeVisible = false;
      this._list.style.display = "none";
      this._widgetToggle.textContent = "▼";
      this._widgetToggle.classList.remove("collapsed");
      this.adjustComponentHeight();
    }

    getSelectedList() {
      const tree = $(this._list).jstree(true);
      const allChecked = tree.get_checked(true);
      return allChecked.filter((node) => tree.is_leaf(node));
    }

    getSelectedKey() {
      this.selectedKey = this.getSelectedList().map((node) => node.id);
      return this.selectedKey;
    }

    getSelectedText() {
      this.selectedText = this.getSelectedList().map((node) => node.text);
      return this.selectedText;
    }
  }

  customElements.define("com-sap-sac-inputcontrol-sample1-main", Main);
})();
