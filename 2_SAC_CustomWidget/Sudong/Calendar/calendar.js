class CalendarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.date = new Date();
    this.data = [
      { id: "1", from: "2024-09-16", to: "2024-10-01", value: 40 },
      { id: "2", from: "2024-07-04", to: "2024-09-03", value: 20 },
      { id: "3", from: "2024-10-01", to: "2024-10-15", value: 10 },
    ];
    this.colors = {
      1: "#3498db",
      2: "#e74c3c",
      3: "#2ecc71",
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.renderCalendar();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          box-sizing: border-box;
        }

        .calendar {
          width: 600px;
          margin: 0px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .year-month {
          font-size: 35px;
        }

        .nav {
          display: flex;
          border: 1px solid #333333;
          border-radius: 5px;
        }

        .nav-btn {
          width: 28px;
          height: 30px;
          border: none;
          font-size: 16px;
          line-height: 34px;
          background-color: transparent;
          cursor: pointer;
        }

        .go-today {
          width: 75px;
          border-left: 1px solid #333333;
          border-right: 1px solid #333333;
        }

        .days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px; /* 그리드 아이템 사이의 간격 */
            margin-bottom: 5px; /* 요일과 날짜 사이의 간격 */
            padding: 5px; /* 내부 여백 */
        }

        .day {
          border: 1px solid #333333;
          text-align: center;
          border-radius: 5px
        }
        .dates {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
        }

        .date {
          padding: 5px;
          text-align: right;
          border: 1px solid #333333;
          position: relative;
          height: 80px;
          
          overflow: hidden;
        }

        .date:nth-child(7n) {
          border-right: none;
          color: #d13e3e;
        }
        .date:nth-child(7n+1) {
          color: #396ee2;
        }

        .date:nth-last-child(-n+7) {
          border-bottom: none;
        }

        .other {
          opacity: 0.3;
        }

        .today {
        position: relative;
        color: #ffffff;
        }

        .today::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        width: 30px;
        height: 30px;
        display: block;
        background-color: #000080; /* 남색으로 변경 */
        border-radius: 5px; /* 모서리를 둥글게 만듦 */
        content: "";
        }

        .value-bar {
          position: absolute;
          left: 0;
          width: 100%;
          height: 15px;
          opacity: 0.7;
        }

        .value-text {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: #333;
          z-index: 1;
        }
      </style>
      <div class="calendar">
        <div class="header">
          <div class="year-month"></div>
          <div class="nav">
            <button class="nav-btn go-prev">&lt;</button>
            <button class="nav-btn go-today">TODAY</button>
            <button class="nav-btn go-next">&gt;</button>
          </div>
        </div>
        <div class="main">
          <div class="days">
            <div class="day">SUN</div>
            <div class="day">MON</div>
            <div class="day">TUE</div>
            <div class="day">WED</div>
            <div class="day">THU</div>
            <div class="day">FRI</div>
            <div class="day">SAT</div>
          </div>
          <div class="dates"></div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot
      .querySelector(".go-prev")
      .addEventListener("click", () => this.prevMonth());
    this.shadowRoot
      .querySelector(".go-next")
      .addEventListener("click", () => this.nextMonth());
    this.shadowRoot
      .querySelector(".go-today")
      .addEventListener("click", () => this.goToday());
  }

  renderCalendar() {
    const viewYear = this.date.getFullYear();
    const viewMonth = this.date.getMonth();

    this.shadowRoot.querySelector(".year-month").textContent = `${viewYear}년 ${
      viewMonth + 1
    }월`;

    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth + 1, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    if (PLDay !== 6) {
      for (let i = 0; i < PLDay + 1; i++) {
        prevDates.unshift(PLDate - i);
      }
    }

    for (let i = 1; i < 7 - TLDay; i++) {
      nextDates.push(i);
    }

    const dates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(TLDate);

    const datesHtml = dates
      .map((date, i) => {
        const condition =
          i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
        const currentDate = new Date(viewYear, viewMonth, date);
        const dateString = this.formatDate(currentDate);
        const valuesForDate = this.getValuesForDate(dateString);

        let valueHtml = "";
        if (valuesForDate.length > 0 && condition === "this") {
          valueHtml = valuesForDate
            .map(
              (value, index) => `
          <div class="value-bar" style="background-color: ${
            this.colors[value.id]
          }; top: ${30 + index * 15}px;">
            <span class="value-text">${value.value}</span>
          </div>
        `
            )
            .join("");
        }

        return `
        <div class="date">
          <span class=${condition}>${date}</span>
          ${valueHtml}
        </div>
      `;
      })
      .join("");

    this.shadowRoot.querySelector(".dates").innerHTML = datesHtml;

    const today = new Date();
    if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
      for (let date of this.shadowRoot.querySelectorAll(".this")) {
        if (+date.innerText === today.getDate()) {
          date.classList.add("today");
          break;
        }
      }
    }
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  getValuesForDate(dateString) {
    const currentDate = new Date(dateString);
    return this.data
      .filter((item) => {
        const fromDate = new Date(item.from);
        const toDate = new Date(item.to);
        return currentDate >= fromDate && currentDate <= toDate;
      })
      .sort((a, b) => new Date(a.from) - new Date(b.from));
  }

  prevMonth() {
    this.date.setDate(1);
    this.date.setMonth(this.date.getMonth() - 1);
    this.renderCalendar();
  }

  nextMonth() {
    this.date.setDate(1);
    this.date.setMonth(this.date.getMonth() + 1);
    this.renderCalendar();
  }

  goToday() {
    this.date = new Date();
    this.renderCalendar();
  }
}

customElements.define("calendar-component", CalendarComponent);
