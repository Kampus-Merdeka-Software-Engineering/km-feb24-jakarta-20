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

function convertDate(originalDate) {
  // Parse the original date
  const dateParts = originalDate.split("-");
  const year = dateParts[0];
  const month = dateParts[1] - 1;
  const day = dateParts[2] > 10 ? dateParts[2] : dateParts[2] - 1;

  // Convert to the target format DD/MM/YYYY
  const newDate = `${month + 1}/${day > 10 ? day : day + 1}/${year}`;
  return newDate;
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
    // 3 (Astoria)
    // 5 (Lower Manhattan)
    // 8 (Hell's Kitchen)

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

    const form = document.getElementById("myForm");
    form.addEventListener("submit", (e) => {
      const data = new FormData(e.target);
      const store = data.get("store") == null ? 8 : data.get("store");
      const startDate =
        data.get("startDate") == null
          ? new Date("2023-1-1")
          : convertDate(data.get("startDate"));
      const endDate =
        data.get("endDate") == null
          ? new Date("2023-6-30")
          : convertDate(data.get("endDate"));

      localStorage.setItem("storeId", store);
      localStorage.setItem("startDate", startDate);
      localStorage.setItem("endDate", endDate);
    });

    // endDate sampai bulan 6 karena yang product type coffee hanya ada
    // sampai bulan 6
    let storeId = localStorage.getItem("storeId");
    let startDate = localStorage.getItem("startDate");
    let endDate = localStorage.getItem("endDate");

    // Average Quantity Sales Per Month
    const monthlyTotalQtys = {};
    const uniqueMonths = new Set();
    const filteredData = retrievedData.filter(
      (v) =>
        v.store_id == storeId &&
        v.transaction_date >= startDate &&
        v.transaction_date <= endDate
    );

    filteredData.forEach((sale) => {
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
    const totalQuantity = filteredData.reduce(
      (acc, curr) => acc + curr.transaction_qty,
      0
    );
    const totalTransactionsForAverage = filteredData.length;
    const averageQuantityPerTransaction =
      totalQuantity / totalTransactionsForAverage;

    // Average Spending Per Transaction
    const totalSpending = filteredData.reduce(
      (acc, curr) => acc + curr.transaction_qty * curr.unit_price,
      0
    );
    const totalTransactions = filteredData.length;
    const averageSpendingPerTransaction = totalSpending / totalTransactions;

    // Average Spending Per Transaction Quantity
    const totalSpendingForPerTransactionQty = filteredData.reduce(
      (acc, curr) => acc + curr.transaction_qty * curr.unit_price,
      0
    );
    const totalQuantityItemSold = filteredData.reduce(
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
    const salesByMonth = filteredData.reduce((acc, curr) => {
      const dateParts = curr.transaction_date.split("/");
      const month = `${dateParts[2]}-${dateParts[0]}`;
      acc[month] = acc[month] || [];
      acc[month].push(curr);
      return acc;
    }, {});

    // Average Quantity Per Transaction Per Month
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

    // Average Quantity Per Transaction Per Store
    const storeTransactionMap = {};
    const averageQuantityPerTransactionPerStore = [];

    // Group data by store and transaction
    retrievedData.forEach(
      ({ store_location, transaction_id, transaction_qty }) => {
        if (!storeTransactionMap[store_location]) {
          storeTransactionMap[store_location] = {};
        }
        if (!storeTransactionMap[store_location][transaction_id]) {
          storeTransactionMap[store_location][transaction_id] = 0;
        }
        storeTransactionMap[store_location][transaction_id] += transaction_qty;
      }
    );

    // Calculate the average quantity per transaction per store
    for (const store in storeTransactionMap) {
      const transactions = storeTransactionMap[store];
      const transactionQuantities = Object.values(transactions);
      const totalQuantity = transactionQuantities.reduce(
        (acc, qty) => acc + qty,
        0
      );
      const averageQuantity = totalQuantity / transactionQuantities.length;
      averageQuantityPerTransactionPerStore.push({ store, averageQuantity });
    }

    // Average Quantity and Value per Store
    const storeDataMap = {};
    filteredData.forEach(({ store_location, transaction_qty, unit_price }) => {
      if (!storeDataMap[store_location]) {
        storeDataMap[store_location] = {
          totalQuantity: 0,
          totalValue: 0,
          transactionCount: 0,
        };
      }
      storeDataMap[store_location].totalQuantity += transaction_qty;
      storeDataMap[store_location].totalValue += unit_price;
      storeDataMap[store_location].transactionCount += 1;
    });

    const averageQuantityAndValuePerStore = [];
    for (const store in storeDataMap) {
      const { totalQuantity, totalValue, transactionCount } =
        storeDataMap[store];
      const averageQuantity = totalQuantity / transactionCount;
      const averageValue = totalValue / transactionCount;
      averageQuantityAndValuePerStore.push({
        store,
        averageQuantity,
        averageValue,
      });
    }

    const transactionQtyDetails = document.querySelector(
      ".col .transaction-qty table"
    );
    averageQuantityAndValuePerStore.forEach((v) => {
      var tableRow = document.createElement("tr");

      var tdStoreName = document.createElement("td");
      tdStoreName.textContent = v.store.toUpperCase();

      var tdAeverageQty = document.createElement("td");
      tdAeverageQty.textContent = Math.round(v.averageQuantity * 100) / 100;

      var tdAverageValue = document.createElement("td");
      tdAverageValue.textContent = (
        Math.round(v.averageValue * 100) / 100
      ).toLocaleString("en-us", {
        style: "currency",
        currency: "USD",
      });

      tableRow.appendChild(tdStoreName);
      tableRow.appendChild(tdAeverageQty);
      tableRow.appendChild(tdAverageValue);
      transactionQtyDetails.appendChild(tableRow);
    });

    // Product Type By Transaction Quantity and Value

    // Group data by product type and transaction
    const productTransactionMap = {};

    filteredData.forEach(({ product_type, transaction_qty, unit_price }) => {
      const lowerCaseProductType = product_type.toLowerCase();
      if (
        lowerCaseProductType.includes("coffee") ||
        lowerCaseProductType.includes("espresso")
      ) {
        if (!productTransactionMap[lowerCaseProductType]) {
          productTransactionMap[lowerCaseProductType] = {
            totalQuantity: 0,
            totalValue: 0,
          };
        }
        productTransactionMap[lowerCaseProductType].totalQuantity +=
          transaction_qty;
        productTransactionMap[lowerCaseProductType].totalValue += unit_price;
      }
    });

    // Step 2: Transform the result into an array
    const productTypeArray = Object.keys(productTransactionMap).map(
      (productType) => ({
        productType,
        totalQuantity: productTransactionMap[productType].totalQuantity,
        totalValue: productTransactionMap[productType].totalValue,
      })
    );

    const productTypeTransactionDetails = document.querySelector(
      ".col .product-type-transaction table"
    );
    productTypeArray.forEach((v) => {
      const tableRow = document.createElement("tr");

      var tdStoreName = document.createElement("td");
      tdStoreName.textContent = v.productType.toUpperCase();

      var tdTransactionQty = document.createElement("td");
      tdTransactionQty.textContent = Math.round(v.totalQuantity * 100) / 100;

      var tdTransactionValue = document.createElement("td");
      tdTransactionValue.textContent = (
        Math.round(v.totalValue * 100) / 100
      ).toLocaleString("en-us", {
        style: "currency",
        currency: "USD",
      });

      tableRow.appendChild(tdStoreName);
      tableRow.appendChild(tdTransactionQty);
      tableRow.appendChild(tdTransactionValue);
      productTypeTransactionDetails.appendChild(tableRow);
    });
    //

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
            data: averageQuantityPerTransactionPerStore.map(
              (v) => v.averageQuantity
            ),
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
