(function () {
  let version = "0.2.6";
  let tmpl = document.createElement("template");
  tmpl.innerHTML = ``;

  class InputControl extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init() {
      var oData = {
        root: {
          text: "Root",
          nodes: [
            {
              text: "Node 1",
              nodes: [{ text: "Subnode 1.1" }, { text: "Subnode 1.2" }],
            },
            {
              text: "Node 2",
              nodes: [{ text: "Subnode 2.1" }, { text: "Subnode 2.2" }],
            },
          ],
        },
      };
      var oModel = new sap.ui.model.json.JSONModel(oData);
      var ctor = sap.m.Tree;
      this.DP = new ctor({
        items: {
          path: "/root/nodes",
          template: new sap.m.StandardTreeItem({
            title: "{text}",
          }),
        },
      });
      this.DP.setModel(oModel);

      this.DP.placeAt(this);
    }
  }

  customElements.define("com-sapkorea-sac-sudong-base", InputControl);
})();
