(function(){
    const metricPlotareaFormTemplate = document.createElement("template");
    metricPlotareaFormTemplate.innerHTML = `
        <form id="form">
            <fieldset>
                <legend>Plotarea Properties</legend>
                <table>
                    <tr>
                        <td>Label Color</td>
                        <td><input id="bps_label_color" type="text" size="10" maxlength="10" value="#666"></td>
                    </tr>
                    <tr style="display:none">
                        <td>Label Icon</td>
                        <td><input id="bps_labelIcon" type="checkbox"></td>
                    </tr>
                    <tr style="display:none">
                        <td>Number Bar Color</td>
                        <td><input id="bps_number_bar_color" type="text" size="10" maxlength="10" value="#488ccc"></td>
                    </tr>
                    <tr style="display:none">
                        <td>Number Track Color</td>
                        <td><input id="bps_number_track_color" type="text" size="10" maxlength="10" value="#ddd"></td>
                    </tr>
                    <tr style="display:none">
                        <td>Max Number</td>
                        <td><input id="bps_max" type="number" size="10" maxlength="10">Millian</td>
                    </tr>
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
                </table>
                <input type="submit" style="display:none;">
            </fieldset>
        </form>
        <style>
        :host {
            display: block;
            padding: 1em 1em 1em 1em;
        }
        </style>
    `;

    class MetricPlotareaBuilderPanel extends HTMLElement {

        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(metricPlotareaFormTemplate.content.cloneNode(true));
            this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
            this._shadowRoot.getElementById('bps_label_color').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('bps_number_bar_color').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('bps_number_track_color').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('bps_max').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('bps_customUnit').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('bps_customUnitNum').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('bps_customUnitName').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('bps_labelIcon').addEventListener('change', this._submit.bind(this));
            this._shadowRoot.getElementById('bps_numberFormatSelect').addEventListener('change', this._submit.bind(this));
        }

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                    detail: {
                        properties: {
                            labelColor: this.labelColor,
                            numberBarColor: this.numberBarColor,
                            numberTrackColor: this.numberTrackColor,
                            max: this.max,
                            customUnit: this.customUnit,
                            customUnitNum: this.customUnitNum,
                            customUnitName: this.customUnitName,
                            labelIcon: this.labelIcon,
                            format: this.format,
                        }
                    }
            }));
        }

        set labelColor(value) {
            (this._shadowRoot.getElementById("bps_label_color")).value = value;
        }

        get labelColor() {
            return (this._shadowRoot.getElementById("bps_label_color")).value;
        }

        set numberBarColor(value) {
            (this._shadowRoot.getElementById("bps_number_bar_color")).value = value;
        }

        get numberBarColor() {
            return (this._shadowRoot.getElementById("bps_number_bar_color")).value;
        }

        set numberTrackColor(value) {
            (this._shadowRoot.getElementById("bps_number_track_color")).value = value;
        }

        get numberTrackColor() {
            return (this._shadowRoot.getElementById("bps_number_track_color")).value;
        }

        set max(value) {
            (this._shadowRoot.getElementById("bps_max")).value = value;
        }

        get max() {
            return (this._shadowRoot.getElementById("bps_max")).value;
        }

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

        set labelIcon(value) {
            (this._shadowRoot.getElementById("bps_labelIcon")).checked = !!value;
        }
    
        get labelIcon() {
            return (this._shadowRoot.getElementById("bps_labelIcon")).checked;
        }

        set format(value) {
            $("#bps_numberFormatSelect", this._shadowRoot).val(value);
        }
    
        get format() {
            return $("#bps_numberFormatSelect", this._shadowRoot).val();
        }
    }

    customElements.define("viz-metric-plotarea-build-en", MetricPlotareaBuilderPanel);
})();