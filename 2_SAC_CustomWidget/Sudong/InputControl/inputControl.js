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
      :host {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
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
        overflow-y: auto; /* 스크롤 추가 */
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
      this._list = this._shadowRoot.getElementById("list");
      this._widgetContainer =
        this._shadowRoot.getElementById("widget-container");
      this._widgetToggle = this._shadowRoot.getElementById("widget-toggle");
      this._isTreeVisible = false;
      this._treeData = [
        { id: "root1", parent: "#", text: "Aircraft" },
        { id: "root2", parent: "#", text: "Airlines" },
        { id: "root3", parent: "#", text: "Airports" },
        { id: "root4", parent: "#", text: "Routes" },
        { id: "root5", parent: "#", text: "Alliances" },
        { id: "A320", parent: "root1", text: "A320 Family" },
        { id: "A320-200", parent: "A320", text: "A320-200" },
        { id: "A321", parent: "A320", text: "A321" },
        { id: "B737", parent: "root1", text: "Boeing 737 Family" },
        { id: "B737-800", parent: "B737", text: "737-800" },
        { id: "B737-MAX", parent: "B737", text: "737 MAX" },
        { id: "SQ", parent: "root2", text: "Singapore Airlines" },
        { id: "UA", parent: "root2", text: "United Airlines" },
        { id: "LH", parent: "root2", text: "Lufthansa" },
        { id: "SIN", parent: "root3", text: "Singapore Changi" },
        { id: "LAX", parent: "root3", text: "Los Angeles International" },
        { id: "FRA", parent: "root3", text: "Frankfurt Airport" },
        { id: "SIN-LAX", parent: "root4", text: "Singapore - Los Angeles" },
        { id: "FRA-SIN", parent: "root4", text: "Frankfurt - Singapore" },
        { id: "Star", parent: "root5", text: "Star Alliance" },
        { id: "Oneworld", parent: "root5", text: "Oneworld" },
        { id: "SkyTeam", parent: "root5", text: "SkyTeam" },
      ];
    }

    onCustomWidgetResize(width, height) {
      this.adjustRootHeight();
      this.render();
    }

    onCustomWidgetAfterUpdate(changedProps) {
      this.adjustRootHeight();
      this.render();
    }

    connectedCallback() {
      this._widgetContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleTree();
      });
      this.render();

      // 컴포넌트 외부 클릭 시 트리 닫기
      document.addEventListener("click", (event) => {
        if (
          !this.contains(event.target) &&
          !this._list.contains(event.target)
        ) {
          this.hideTree();
        }
      });

      // 초기 높이 계산
      // this.adjustRootHeight();
      // window.addEventListener("resize", this.adjustRootHeight.bind(this)); // 윈도우 리사이즈 시에도 반응
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
      console.log(treedata);
      return treedata;
    }

    async render() {
      const treedata = this.databinding();
      await getScriptPromisify(
        "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/jstree.min.js"
      );

      if ($(this._list).jstree(true)) {
        $(this._list).jstree("destroy").empty(); // 트리를 제거하고 초기화
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

        // 상위 노드 처리
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

        // 하위 노드 처리
        if (data.node.state.checked) {
          tree.check_node(tree.get_node(data.node).children_d);
        } else {
          tree.uncheck_node(tree.get_node(data.node).children_d);
        }
      });
    }

    adjustRootHeight() {
      const containerHeight = this._widgetContainer.clientHeight;
      const componentHeight = this.clientHeight;

      // root의 높이를 webcomponent 높이에서 컨테이너 높이를 뺀 값으로 설정
      const rootHeight = componentHeight - containerHeight - 20; // 약간의 여백
      this._list.style.height = `${rootHeight}px`;
    }

    toggleTree() {
      this._isTreeVisible = !this._isTreeVisible;
      if (this._isTreeVisible) {
        this.showTree();
      } else {
        this.hideTree();
      }
    }

    showTree() {
      this._list.style.display = "block";
      this._widgetToggle.textContent = "▲";
      this._widgetToggle.classList.add("collapsed");
    }

    hideTree() {
      this._isTreeVisible = false;
      this._list.style.display = "none";
      this._widgetToggle.textContent = "▼";
      this._widgetToggle.classList.remove("collapsed");
    }

    getSelectedKeys() {
      const tree = $(this._list).jstree(true);
      const allChecked = tree.get_checked(true);

      // 선택된 노드 중 자식이 없는 노드(리프 노드)만 필터링
      this.selectedKeys = allChecked
        .filter((node) => tree.is_leaf(node))
        .map((node) => node.text);
      console.log(this.selectedKeys);
      return this.selectedKeys;
    }
  }

  customElements.define("com-sap-sac-inputcontrol-sample1-main", Main);
})();
