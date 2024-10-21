const plotareaFormTemplate = document.createElement("template");
plotareaFormTemplate.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Plotarea Properties</legend>
            <table>
                <tr style="position: static">
                    <td><b>Data Marker</b></td>
                </tr>



                <tr>
                    <td>Data Marker Size</td>
                    <td><input id="bps_dataMarkerSize" type="number" value="100">%</td>
                </tr>
                <tr>
                    <td>Fill with Picture</td>
                    <td><input id="bps_imgFill" type="checkbox"></td>
                </tr>
                <tr id="bps_imgFillArea">
                    <td>Select Picture</td>
                    <td><input id="bps_imgSelect" type="file" accept="image/*"></td>
                </tr>
                <tr style="position: static">
                    <td><b>Data Label</b></td>
                </tr>
                <tr>
                    <td>Donut Data Label(Bar Chart)</td>
                    <td><input id="bps_donutDataLabel" type="checkbox"></td>
                </tr>
                <tr>
                    <td>Donut Data Label Size</td>
                    <td><input id="bps_donutDataLabelSize" type="number" value="100">%</td>
                </tr>
                <tr>
                    <td>Staggered Data Label(Line Chart)</td>
                    <td><input id="bps_inclined" type="checkbox"></td>
                </tr>
                <tr>
                    <td>Absolute Data Label(Stacked Bar Chart)</td>
                    <td><input id="bps_absolute" type="checkbox"></td>
                </tr>
                



                <tr style="position:static; display:none">
                    <td><b>Axis Label</b></td>
                </tr>
                <tr style="display:none">
                    <td>Axis Label Icon</td>
                    <td><input id="bps_axisLabelIcon" type="checkbox"></td>
                </tr>
                <tr style="display:none">
                    <td>Axis Label Color</td>
                    <td><input id="bps_axis_label_color" type="text" size="10" maxlength="10" value="#333"></td>
                </tr>
            </table>
            <input type="submit" style="display:none;">
        </fieldset>
    </form>
    <style>
    :host {
        display: block;
        padding: 1em 1em 1em 1em;
    }
    :host tr{
        position: relative;
        left: 10px;
    }
    </style>
`;

class VizPlotareaBuilderPanel extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(plotareaFormTemplate.content.cloneNode(true));
    this._shadowRoot
      .getElementById("form")
      .addEventListener("submit", this._submit.bind(this));
    // Rounded에 대한 EventListener 추가
    this._shadowRoot
      .getElementById("bps_donutDataLabel")
      .addEventListener("change", this._submit.bind(this));
    this._shadowRoot
      .getElementById("bps_donutDataLabelSize")
      .addEventListener("change", this._submit.bind(this));
    this._shadowRoot
      .getElementById("bps_dataMarkerSize")
      .addEventListener("change", this._submit.bind(this));
    this._shadowRoot
      .getElementById("bps_axis_label_color")
      .addEventListener("change", this._submit.bind(this));
    this._shadowRoot
      .getElementById("bps_inclined")
      .addEventListener("change", this._submit.bind(this));
    // Custom scale에 대한 EventListener 추가
    this._shadowRoot
      .getElementById("bps_imgFill")
      .addEventListener("change", this._submit.bind(this));
    this._shadowRoot
      .getElementById("bps_imgSelect")
      .addEventListener("change", this.showImg.bind(this));
    this.img = "";
    this._shadowRoot
      .getElementById("bps_axisLabelIcon")
      .addEventListener("change", this._submit.bind(this));
    this._shadowRoot
      .getElementById("bps_absolute")
      .addEventListener("change", this._submit.bind(this));
  }

  _submit(e) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent("propertiesChanged", {
        detail: {
          properties: {
            // property 변경--rounded
            donutDataLabel: this.donutDataLabel,
            dataMarkerSize: this.dataMarkerSize,
            axisLabelColor: this.axisLabelColor,
            donutDataLabelSize: this.donutDataLabelSize,
            inclined: this.inclined,
            // property 변경--custom scale
            midDataLabel: this.midDataLabel,
            imgFill: this.imgFill,
            img: this.img,
            axisLabelIcon: this.axisLabelIcon,
            absolute: this.absolute,
          },
        },
      })
    );
  }

  showImg() {
    var file = this._shadowRoot.getElementById("bps_imgSelect").files[0];
    var reader = new FileReader();
    reader.onload = (e) => {
      this.img = e.target.result;
      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              // property 변경--rounded
              donutDataLabel: this.donutDataLabel,
              dataMarkerSize: this.dataMarkerSize,
              axisLabelColor: this.axisLabelColor,
              donutDataLabelSize: this.donutDataLabelSize,
              inclined: this.inclined,
              // property 변경--custom scale
              midDataLabel: this.midDataLabel,
              imgFill: this.imgFill,
              img: this.img,
              axisLabelIcon: this.axisLabelIcon,
              absolute: this.absolute,
            },
          },
        })
      );
    };
    reader.readAsDataURL(file);
  }

  // rounded에 대한 getter, setter 만들기

  set donutDataLabel(value) {
    this._shadowRoot.getElementById("bps_donutDataLabel").checked = !!value;
  }

  get donutDataLabel() {
    return this._shadowRoot.getElementById("bps_donutDataLabel").checked;
  }

  set donutDataLabelSize(value) {
    this._shadowRoot.getElementById("bps_donutDataLabelSize").value = value;
  }

  get donutDataLabelSize() {
    return this._shadowRoot.getElementById("bps_donutDataLabelSize").value;
  }

  set dataMarkerSize(value) {
    this._shadowRoot.getElementById("bps_dataMarkerSize").value = value;
  }

  get dataMarkerSize() {
    return this._shadowRoot.getElementById("bps_dataMarkerSize").value;
  }

  set axisLabelColor(value) {
    this._shadowRoot.getElementById("bps_axis_label_color").value = value;
  }

  get axisLabelColor() {
    return this._shadowRoot.getElementById("bps_axis_label_color").value;
  }

  set inclined(value) {
    this._shadowRoot.getElementById("bps_inclined").checked = !!value;
  }

  get inclined() {
    return this._shadowRoot.getElementById("bps_inclined").checked;
  }

  /*
    set customUnit(value) {
        (this._shadowRoot.getElementById("bps_customUnit")).checked = !!value;
        if(!!value){
            (this._shadowRoot.getElementById("bps_customUnitArea1")).style.display = "";
            (this._shadowRoot.getElementById("bps_customUnitArea2")).style.display = "";
            (this._shadowRoot.getElementById("bps_customUnitArea3")).style.display = "";
        } else {
            (this._shadowRoot.getElementById("bps_customUnitArea1")).style.display = "none";
            (this._shadowRoot.getElementById("bps_customUnitArea2")).style.display = "none";
            (this._shadowRoot.getElementById("bps_customUnitArea3")).style.display = "none";
        }
    }

    get customUnit() {
        return (this._shadowRoot.getElementById("bps_customUnit")).checked;
    }

    set customUnitNum(value) {
        (this._shadowRoot.getElementById("bps_customUnitNum")).value = value;
    }

    get customUnitNum() {
        return (this._shadowRoot.getElementById("bps_customUnitNum")).value;
    }

    set customUnitName(value) {
        (this._shadowRoot.getElementById("bps_customUnitName")).value = value;
    }

    get customUnitName() {
        return (this._shadowRoot.getElementById("bps_customUnitName")).value;
    }

    set format(value) {
        $("#bps_numberFormatSelect", this._shadowRoot).val(value);
    }

    get format() {
        return $("#bps_numberFormatSelect", this._shadowRoot).val();
    }
*/
  set imgFill(value) {
    this._shadowRoot.getElementById("bps_imgFill").checked = !!value;
    if (!!value) {
      this._shadowRoot.getElementById("bps_imgFillArea").style.display = "";
    } else {
      this._shadowRoot.getElementById("bps_imgFillArea").style.display = "none";
    }
  }

  get imgFill() {
    return this._shadowRoot.getElementById("bps_imgFill").checked;
  }

  set axisLabelIcon(value) {
    this._shadowRoot.getElementById("bps_axisLabelIcon").checked = !!value;
  }

  get axisLabelIcon() {
    return this._shadowRoot.getElementById("bps_axisLabelIcon").checked;
  }

  set absolute(value) {
    this._shadowRoot.getElementById("bps_absolute").checked = !!value;
  }

  get absolute() {
    return this._shadowRoot.getElementById("bps_absolute").checked;
  }
}

customElements.define("viz-plotarea-build-en", VizPlotareaBuilderPanel);

/*

                <tr>
                    <td>Custom Scale</td>
                    <td><input id="bps_customUnit" type="checkbox"></td>
                </tr>
                <tr id="bps_customUnitArea1" style="display:none;">
                    <td>Scale Value</td>
                    <td><input id="bps_customUnitNum" type="number" oninput="if(value<1)value=1"></td>
                </tr>
                <tr id="bps_customUnitArea2" style="display:none;">
                    <td>Scale Symbol</td>
                    <td><input id="bps_customUnitName" type="text"></td>
                </tr>
                <tr id="bps_customUnitArea3" style="display:none;">
                    <td>Number Formatting</td>
                    <td>
                        <select id="bps_numberFormatSelect">
                            <option value="typeA">1,234.56</option>
                            <option value="typeB">1.234,56</option>
                            <option value="typeC">1 234,56</option>
                        </select>
                    </td>
                </tr>

*/
