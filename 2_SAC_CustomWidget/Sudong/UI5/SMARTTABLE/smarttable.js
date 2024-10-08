class MySapUiComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <style>
        #sapui-container {
          width: 100%;
          height: 400px;
          border: 1px solid #ccc;
        }
      </style>
      <div id="sapui-container"></div>
    `;
  }

  connectedCallback() {
    // SAPUI5가 이미 로드되었는지 확인
    if (window.sap && sap.ui) {
      console.log("SAPUI5 is already loaded: " + sap.ui.version);
      this.initializeSapUiTable();
    } else {
      console.error("SAPUI5 is not loaded in the browser.");
    }
  }

  initializeSapUiTable() {
    // SAPUI5 라이브러리를 사용하여 테이블 생성
    sap.ui.getCore().attachInit(() => {
      const oTable = new sap.ui.table.Table({
        title: "Sample Table",
        visibleRowCount: 5,
        selectionMode: "Single",
      });

      oTable.addColumn(
        new sap.ui.table.Column({
          label: new sap.m.Label({ text: "Name" }),
          template: new sap.m.Text({ text: "{name}" }),
        })
      );

      oTable.addColumn(
        new sap.ui.table.Column({
          label: new sap.m.Label({ text: "Age" }),
          template: new sap.m.Text({ text: "{age}" }),
        })
      );

      const oModel = new sap.ui.model.json.JSONModel({
        data: [
          { name: "John Doe", age: 28 },
          { name: "Jane Smith", age: 34 },
          { name: "Mike Brown", age: 45 },
        ],
      });
      oTable.setModel(oModel);
      oTable.bindRows("/data");

      // 일반 DOM을 사용하여 테이블 렌더링
      oTable.placeAt(this.querySelector("#sapui-container"));
    });
  }
}

customElements.define("my-sapui-component", MySapUiComponent);
