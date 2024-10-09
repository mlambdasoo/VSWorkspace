(function () {
  let version = "0.2.6";
  let tmpl = document.createElement("template");
  tmpl.innerHTML = ``;

  class DatePicker extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init(skipChildrenCheck) {
      console.log(skipChildrenCheck);
      console.log(this.children);
      if (skipChildrenCheck !== true && this.children.length === 2) return; //constructor called during drag+drop
      if (!this.querySelector("link")) {
        this.appendChild(tmpl.content.cloneNode(true));
      }

      var ctor = sap.m.DatePicker;
      if (this._enablerange) {
        ctor = sap.m.DateRangeSelection;
      }
      this.DP = new ctor({
        change: function () {
          this.fireChanged();
          this.dispatchEvent(new Event("onChange"));
        }.bind(this),
      }).addStyleClass("datePicker");
      if (this._format) {
        this.DP.setDisplayFormat(this._format);
      }
      if (this._minDate) {
        this.updateMinDate();
      }
      if (this._maxDate) {
        this.updateMaxDate();
      }
      this.DP.placeAt(this);
    }

    fireChanged() {
      var properties = { dateVal: this.DP.getDateValue() };
      if (this._enablerange) {
        properties.secondDateVal = this.DP.getSecondDateValue();
      }
      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: properties,
          },
        })
      );
    }

    clear() {
      this.DP.setValue("");
    }

    getDateVal() {
      return this.DP.getDateValue() || undefined;
    }

    set dateVal(value) {
      if (value == undefined || !this.DP) return;
      if (typeof value === "string") value = new Date(value);
      this.DP.setDateValue(value);
    }

    set secondDateVal(value) {
      if (value == undefined || !this.DP || !this._enablerange) return;
      if (typeof value === "string") value = new Date(value);
      this.DP.setSecondDateValue(value);
    }

    set format(value) {
      if (!this.DP) return;
      this._format = value;
      this.DP.setDisplayFormat(value);
    }

    set darktheme(value) {
      this.querySelector("link").setAttribute(
        "href",
        `https://widgets.nkappler.de/datepicker/releases/${version}/${
          value ? "dark" : "light"
        }.css`
      );
    }

    set enablerange(value) {
      if (value == undefined || !this.DP) return;
      this._enablerange = value;
      this.DP.destroy();
      this.init(true);
    }

    set minDateVal(date) {
      if (!this.DP) return;
      this._minDate = date;
      this.updateMinDate();
    }

    set maxDateVal(date) {
      if (!this.DP) return;
      this._maxDate = date;
      this.updateMaxDate();
    }

    updateMaxDate() {
      if (!!this._maxDate) {
        if (this.DP.getDateValue() > this._maxDate) {
          this.DP.setDateValue(this._maxDate);
        }
        if (this._enablerange && this.DP.getSecondDateValue() > this._maxDate) {
          this.DP.setSecondDateValue(this._maxDate);
        }
      }
      this.DP.setMaxDate(this._maxDate);
    }

    updateMinDate() {
      if (!!this._maxDate) {
        if (this.DP.getDateValue() < this._minDate) {
          this.DP.setDateValue(this._minDate);
        }
        if (this._enablerange && this.DP.getSecondDateValue() < this._minDate) {
          this.DP.setSecondDateValue(this._minDate);
        }
      }
      this.DP.setMinDate(this._minDate);
    }
  }

  customElements.define("com-sapkorea-sac-sudong-base", DatePicker);
})();
