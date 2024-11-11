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
        font-size: 17px;
      }
    </style>
    <div id="widget-container">
      <div id="widget-title"></div>
      <div id="widget-toggle">▼</div>
    </div>
    <div id="list"></div>
  `;

  class Main extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};

      this._list = this._shadowRoot.getElementById("list");
      this._widgetContainer =
        this._shadowRoot.getElementById("widget-container");
      this._widgetToggle = this._shadowRoot.getElementById("widget-toggle");
      this._widgetTitle = this._shadowRoot.getElementById("widget-title");
      this._isTreeVisible = false;
      this.selectedKey = [];
      this.selectedText = [];
      this._clickListenerAdded = false;
      console.log("constructor");
    }

    onCustomWidgetBeforeUpdate(changedProps) {
      console.log("onCustomWidgetBeforeUpdate");
      console.log(changedProps);
      this._props = { ...this._props, ...changedProps };
    }

    onCustomWidgetAfterUpdate(changedProps) {
      console.log("onCustomWidgetAfterUpdate");
      console.log(changedProps);
      this.adjustRootHeight();
      this.render();
    }

    connectedCallback() {
      console.log("connectedCallback");
      this._widgetContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("click");
        this.toggleTree();
      });

      this._list.addEventListener("treeExpanded", (e) => {
        e.stopPropagation();
        console.log("treeExpanded");
      });
      this._list.addEventListener("treeCollapsed", (e) => {
        e.stopPropagation();
        console.log("treeCollapsed");
      });
    }

    onCustomWidgetResize(width, height) {
      console.log("onCustomWidgetResize");
    }

    onCustomWidgetDestroy() {}

    async render() {
      console.log("render");
      const dataBinding = this.dataBinding;
      if (!dataBinding || dataBinding.state !== "success") {
        return;
      }
      const { feed, data, metadata } = dataBinding;
      const { dimensions, measures } = parseMetadata(metadata);
      this._dimensionId = dimensions[0].id;
      const treedata = transformData(data);
      this._widgetTitle.textContent = dimensions[0].description;
      await getScriptPromisify(
        "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/jstree.min.js"
      );

      // 컴포넌트 외부 클릭 시 트리 닫기
      document.addEventListener("click", (event) => {
        if (
          !this.contains(event.target) &&
          !this._list.contains(event.target) &&
          this._isTreeVisible
        ) {
          this.hideTree();
        }
      });

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

        if (
          this.dataBindings
            .getDataBinding()
            .getLinkedAnalysis()
            .isDataPointSelectionEnabled()
        ) {
          const selected = this.getSelectedKey();
          const selections = selected.map((item) => ({
            [this._dimensionId]: item,
          }));

          this.dataBindings
            .getDataBinding()
            .getLinkedAnalysis()
            .setFilters(selections);
        }

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
      this.dispatchEvent(new CustomEvent("treeExpanded"));
    }

    // hideTree 메소드 수정
    hideTree() {
      this._isTreeVisible = false;
      this._list.style.display = "none";
      this._widgetToggle.textContent = "▼";
      this._widgetToggle.classList.remove("collapsed");

      // treeCollapsed 이벤트 디스패치
      this.dispatchEvent(new CustomEvent("treeCollapsed"));
    }

    getSelectedList() {
      const tree = $(this._list).jstree(true);
      const allChecked = tree.get_checked(true);

      // 선택된 노드 중 자식이 없는 노드(리프 노드)만 필터링
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

    isCollapsed() {
      return !this._isTreeVisible; // true면 트리가 접혀 있음, false면 열려 있음
    }
    getICHeight() {
      return this._widgetContainer.clientHeight;
    }
  }

  customElements.define("com-sap-sac-exercise-lsd-linkedanalysis", Main);
})();
