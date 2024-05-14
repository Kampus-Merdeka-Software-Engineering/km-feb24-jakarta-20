function highlightContainer() {
  var sidebarItems = document.querySelectorAll(".sidebars");
  sidebarItems.forEach((item) => {
    item.addEventListener("click", function () {
      sidebarItems.forEach((item) => {
        item.classList.remove("highlight");
      });
      this.classList.add("highlight");
    });
  });
}

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40, 99, 103, 100, 120, 100],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.5,
      },
    ],
  },
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      y: {
        position: "right",
      },
    },
  },
});

var ctx1 = document.getElementById("myChart1").getContext("2d");
var myChart1 = new Chart(ctx1, {
  type: "pie",
  data: {
    labels: ["Lower Manhattan", "Hell's Kitchen", "Astoria"],
    datasets: [
      {
        data: [70, 10, 6],
        borderColor: ["#967259", "#634832", "#DDAA86"],
        backgroundColor: ["#967259", "#634832", "#DDAA86"],
        borderWidth: 2,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        position: "right",
      },
    },
  },
});

highlightContainer();

const listStatistikTransaksi = [
  {
    id: "1",
    title: "Average Quantity Sales Per Month",
    type: "qty",
    value: 10,
    // in hour
    updated: 1,
  },
  {
    id: "2",
    title: "Average Quantity Per Transaction",
    type: "qty",
    value: 2,
    // in hour
    updated: 2,
  },
  ,
  {
    id: "3",
    title: "Average Spending Per Transaction",
    type: "transaction",
    value: 49999,
    // in hour
    updated: 4,
  },
  {
    id: "4",
    title: "Average Spending Per Transaction Quantity",
    type: "transaction",
    value: 39999,
    // in hour
    updated: 3,
  },
];

const statistikTransaksi = document.querySelector(
  ".detail-statistik-transaksi"
);
const row = statistikTransaksi.querySelector(".row");
const insertDashboardStatistikTransaski = () => {
  listStatistikTransaksi.forEach((element, i) => {
    // Create column element
    var column = document.createElement("div");
    column.classList.add("col");

    // Create card element
    var card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "15rem";

    // Create card body
    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Create card title
    var cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = element.title;

    // Create card text
    var cardText = document.createElement("h2");
    cardText.classList.add("card-text");
    if (element.type == "transaction") {
      cardText.textContent = element.value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      });
    } else {
      cardText.textContent = element.value + " (pcs) ";
    }

    // Create card link div
    var cardLinkDiv = document.createElement("div");
    cardLinkDiv.classList.add("card-link-div");
    cardLinkDiv.style.display = "flex";
    cardLinkDiv.style.alignItems = "center";
    cardLinkDiv.style.textAlign = "left";

    // Create card subtitle
    var cardSubtitle = document.createElement("h6");
    cardSubtitle.classList.add("card-subtitle");
    cardSubtitle.textContent = `Diperbaharui ${element.updated} jam yang lalu`;

    // Create card link
    var cardLink = document.createElement("a");
    cardLink.classList.add("card-link");
    cardLink.href = "#";

    // Create arrow icon
    var arrowIcon = document.createElement("i");
    arrowIcon.classList.add("fa-solid", "fa-arrow-right");

    // Append elements
    cardLink.appendChild(arrowIcon);
    cardLinkDiv.appendChild(cardSubtitle);
    cardLinkDiv.appendChild(cardLink);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardLinkDiv);
    card.appendChild(cardBody);
    column.appendChild(card);

    // Append column to the parent element
    row.appendChild(column);
  });
};

insertDashboardStatistikTransaski();

document.querySelector(".hamburger").addEventListener("click", function () {
  this.classList.toggle("active");
});
let retrievedData;

const loadData = async () => {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

async function fetchData() {
  try {
    const data = await loadData();
    retrievedData = data;
    console.log(retrievedData);
  } catch (error) {
    console.error(error);
  }
}

