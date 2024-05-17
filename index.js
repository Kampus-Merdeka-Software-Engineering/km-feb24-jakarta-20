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

// ###############
// ###############
// ###############

highlightContainer();

const statistikTransaksi = document.querySelector(
  ".detail-statistik-transaksi"
);
const row = statistikTransaksi.querySelector(".row");

document.querySelector(".hamburger").addEventListener("click", function () {
  this.classList.toggle("active");
});
let retrievedData;

const loadData = async () => {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

async function fetchData() {
  try {
    const data = await loadData();
    retrievedData = data;

    // Id Store Dari Keseluruhan Data
    const uniqueStoreIds = [...new Set(retrievedData.map((v) => v.store_id))];

    // Lokasi Store
    const uniqueStoreLocation = [
      ...new Set(retrievedData.map((v) => v.store_location)),
    ];

    // Tipe Product (Kopi)
    const uniqueProductType = [
      ...new Set(
        retrievedData
          .filter(
            (v) =>
              v.product_type.toLowerCase().includes("coffee") ||
              v.product_type.toLowerCase().includes("espresso")
          )
          .map((v) => v.product_type.toLowerCase())
      ),
    ];

    // filter berdasarkan tanggal transaksi dan tipe kopi
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-05-30");
    const filterTransactionByDate = retrievedData
      .filter((v) => {
        const transactionDate = new Date(v.transaction_date);
        return transactionDate >= date1 && transactionDate <= date2;
      })
      .filter(
        (v) =>
          v.product_type.toLowerCase().includes("coffee") ||
          v.product_type.toLowerCase().includes("espresso")
      )
      .map((v) => {
        return {
          transactionDate: v.transaction_date,
          productName: v.product_detail,
          productType: v.product_type,
        };
      });

    // Average Quantity Sales Per Month
    const monthlyTotalQtys = {};
    const uniqueMonths = new Set();
    retrievedData.forEach((sale) => {
      const dateParts = sale.transaction_date.split("/");
      const month = `${dateParts[2]}-${dateParts[0]}`;
      uniqueMonths.add(month);
      monthlyTotalQtys[month] =
        (monthlyTotalQtys[month] || 0) + sale.transaction_qty;
    });

    const totalMonths = uniqueMonths.size;
    const totalQtys = Object.values(monthlyTotalQtys).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const averageQtyPerMonth = totalQtys / totalMonths;

    // Average Quantity Per Transaction
    const totalQuantity = retrievedData.reduce(
      (acc, curr) => acc + curr.transaction_qty,
      0
    );
    const totalTransactionsForAverage = retrievedData.length;
    const averageQuantityPerTransaction =
      totalQuantity / totalTransactionsForAverage;

    // Average Spending Per Transaction
    const totalSpending = retrievedData.reduce(
      (acc, curr) => acc + curr.transaction_qty * curr.unit_price,
      0
    );
    const totalTransactions = retrievedData.length;
    const averageSpendingPerTransaction = totalSpending / totalTransactions;

    // Average Spending Per Transaction Quantity
    const totalSpendingForPerTransactionQty = retrievedData.reduce(
      (acc, curr) => acc + curr.transaction_qty * curr.unit_price,
      0
    );
    const totalQuantityItemSold = retrievedData.reduce(
      (acc, curr) => acc + curr.transaction_qty,
      0
    );
    const averageSpendingPerTransactionQuantity =
      totalSpendingForPerTransactionQty / totalQuantityItemSold;

    // ###############
    // ###############
    // ###############
    // Statistik Transaksi
    const listStatistikTransaksi = [
      {
        id: "1",
        title: "Average Quantity Sales Per Month",
        type: "qty",
        value: averageQtyPerMonth,
        // in hour
        updated: 1,
      },
      {
        id: "2",
        title: "Average Quantity Per Transaction",
        type: "qty",
        value: Math.round(averageQuantityPerTransaction),
        // in hour
        updated: 2,
      },
      ,
      {
        id: "3",
        title: "Average Spending Per Transaction",
        type: "transaction",
        value: averageSpendingPerTransaction,
        // in hour
        updated: 4,
      },
      {
        id: "4",
        title: "Average Spending Per Transaction Quantity",
        type: "transaction",
        value: averageSpendingPerTransactionQuantity,
        // in hour
        updated: 3,
      },
    ];

    // ###############
    // ###############
    // ###############
    // create HTML element
    listStatistikTransaksi.forEach((element, i) => {
      // Create column element
      var column = document.createElement("div");
      column.classList.add("col");

      // Create card element
      var card = document.createElement("div");
      card.classList.add("card");

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
        cardText.textContent = element.value.toLocaleString("us-US", {
          style: "currency",
          currency: "USD",
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

    // ###############
    // ###############
    // ###############
    // Calculation For Chart
    // Average qty per Transaction Per Month
    const salesByMonth = retrievedData.reduce((acc, curr) => {
      const dateParts = curr.transaction_date.split("/");
      const month = `${dateParts[2]}-${dateParts[0]}`;
      acc[month] = acc[month] || [];
      acc[month].push(curr);
      return acc;
    }, {});

    const averageQuantityPerTransactionPerMonth = Object.keys(salesByMonth).map(
      (month) => {
        const totalQuantity = salesByMonth[month].reduce(
          (acc, curr) => acc + curr.transaction_qty,
          0
        );
        const totalTransactions = salesByMonth[month].length;
        return { month, averageQuantity: totalQuantity / totalTransactions };
      }
    );

    // Chart Js
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"],
        datasets: [
          {
            label: "Average Quantity Per Transaction Per Month",
            data: averageQuantityPerTransactionPerMonth.map(
              (v) => v.averageQuantity
            ),
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
        maintainAspectRatio: false,
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
  } catch (error) {
    console.error(error);
  }
}

fetchData();
