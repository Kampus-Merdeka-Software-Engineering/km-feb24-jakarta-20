import datasets from "./data.json" assert { type: "json" };

let transactionQtyMonths = [];
let averageQtyAndVallueStores = [];
let averageQtyAndVallueProductType = [];
let averageTransactionQtyPerStore = [];
let averageSpendingPerTransaction = 0;
let totalTransactionQty = 0;
let totalUnitPrice = 0;
let totalSpending = 0;
let avgQtyPerTransaction = 0;

for (let i = 0; i < datasets.length; i++) {
  const dataset = datasets[i];

  // Calculate total transaction quantity
  totalTransactionQty += dataset.transaction_qty;

  // Awal Average Spending Per Transaction Quantty
  averageSpendingPerTransaction += dataset.unit_price * dataset.transaction_qty;
  // Akhir Average Spending Per Transaction Quantty

  // Calculate total unit price
  totalUnitPrice += dataset.unit_price;

  // Untuk Line Chart
  if (
    transactionQtyMonths.filter(
      (item) => item.id === dataset.transaction_date.split("-")[1]
    ).length > 0
  ) {
    transactionQtyMonths = transactionQtyMonths.map((item) => {
      if (item.id === dataset.transaction_date.split("-")[1]) {
        return {
          ...item,
          value: item.value + dataset.transaction_qty * dataset.unit_price,
        };
      }
      return item;
    });
  } else {
    transactionQtyMonths.push({
      id: dataset.transaction_date.split("-")[1],
      value: dataset.transaction_qty * dataset.unit_price,
    });
  }
  // Akhir Line Chart

  // Untuk Average Transaction Quantity And Value Per Store
  if (
    averageQtyAndVallueStores.filter((item) => item.id === dataset.store_id)
      .length > 0
  ) {
    averageQtyAndVallueStores = averageQtyAndVallueStores.map((item) => {
      if (item.id === dataset.store_id) {
        return {
          ...item,
          transaction_qty: item.transaction_qty + dataset.transaction_qty,
          price: item.price + dataset.unit_price,
          value: item.value + dataset.unit_price * dataset.transaction_qty
        };
      }
      return item;
    });
  } else {
    averageQtyAndVallueStores.push({
      id: dataset.store_id,
      name: dataset.store_location,
      transaction_qty: dataset.transaction_qty,
      price: dataset.unit_price,
      value: dataset.unit_price * dataset.transaction_qty
    });
  }
  // Akhir Average Transaction Quantity And Value Per Store

  // Untuk Average Transaction Quantity Per Store
  if (
    averageTransactionQtyPerStore.filter((item) => item.id === dataset.store_id)
      .length > 0
  ) {
    averageTransactionQtyPerStore = averageTransactionQtyPerStore.map(
      (item) => {
        if (item.id === dataset.store_id) {
          return {
            ...item,
            value: item.value + 1,
          };
        }
        return item;
      }
    );
  } else {
    averageTransactionQtyPerStore.push({
      id: dataset.store_id,
      name: dataset.store_location,
      value: 1,
    });
  }
  // Akhir Average Transaction Quantity Per Store

  // Awal Average Quantity And Value Per Product Type
  if (
    averageQtyAndVallueProductType.filter(
      (item) => item.id === dataset.product_type
    ).length > 0
  ) {
    averageQtyAndVallueProductType = averageQtyAndVallueProductType.map(
      (item) => {
        if (item.id === dataset.product_type) {
          return {
            ...item,
            transaction_qty: item.transaction_qty + dataset.transaction_qty,
            price: item.price + dataset.unit_price,
            value: item.value + dataset.unit_price*dataset.transaction_qty
          };
        }
        return item;
      }
    );
  } else {
    averageQtyAndVallueProductType.push({
      id: dataset.product_type,
      name: dataset.product_type,
      transaction_qty: dataset.transaction_qty,
      price: dataset.unit_price,
      value: dataset.unit_price*dataset.transaction_qty
    });
  }
  // Akhir Average Quantity And Value Per Product Type

  // Awal Average Quantity Per Transaction
  avgQtyPerTransaction = (totalTransactionQty / datasets.length).toFixed(2);
  // Akhir Average Quantity Per Transaction

  // Awal Average Spending Per Transaction (4.65)
  let transactionValue = dataset.unit_price * dataset.transaction_qty;
  totalSpending += transactionValue;
  // Akhir Average Spending Per Transaction
}

// Awal Average Quantity Sales Per Month
let avgQtySalesPerMonth = 0;
let totalQtySalesPerMonth = 0;
for (let i = 0; i < transactionQtyMonths.length; i++) {
  const transactionQtyMonth = transactionQtyMonths[i];
  totalQtySalesPerMonth += transactionQtyMonth.value;
}
avgQtySalesPerMonth = totalTransactionQty / transactionQtyMonths.length;
document.querySelector("#avgQtySalesPerMonth").innerHTML =
  avgQtySalesPerMonth.toFixed(2);
// Akhir Average Quantity Sales Per Month

// Average Quantity Per Transaction
document.querySelector("#averageQtyPerTransaction").innerHTML =
  avgQtyPerTransaction;

// Average Spending Per Transaction
document.querySelector("#averageSpendingPerTransaction").innerHTML =
  "$" + (totalSpending / datasets.length).toFixed(2);

// Average Spending Per Transaction Quantity
document.querySelector("#averageSpendingPerTransactionQty").innerHTML =
  "$" + (totalSpending / totalTransactionQty).toFixed(2);
// Akhir Average Quantity Sales Per Month

// Awal Average Quantity And Value Per Product Category
const productTable = document.querySelector("#productTable tbody");
let totalQtyProductTable = 0;
let totalPriceProductTable = 0;
for (let i = 0; i < averageQtyAndVallueProductType.length; i++) {
  const productType = averageQtyAndVallueProductType[i];
  totalPriceProductTable += productType.value;
  totalQtyProductTable += productType.transaction_qty;
  productTable.innerHTML += `
        <tr class="mid">
            <td>${productType.name}</td>
            <td>${productType.transaction_qty}</td>
            <td>${(productType.value).toFixed(
              2
            )}</td>
        </tr>`;
}
productTable.innerHTML += `
        <tr class="grand-total">
            <td>Grand Total</td>
            <td>${totalQtyProductTable}</td>
            <td>${totalPriceProductTable.toFixed(2)}</td>
    </tr>`;
// Akhir Average Quantity And Value Per Product Category

// Awal Average Quantity And Value Per Store
const storeTable = document.querySelector("#storeTable tbody");
let totalQty = 0;
let totalPrice = 0;

for (let i = 0; i < averageQtyAndVallueStores.length; i++) {
  const store = averageQtyAndVallueStores[i];
  totalPrice += store.value;
  totalQty += store.transaction_qty;
  storeTable.innerHTML += `
        <tr class="mid">
            <td>${store.name}</td>
            <td>${store.transaction_qty}</td>
            <td>${(store.value).toFixed(2)}</td>
        </tr>`;
}
storeTable.innerHTML += `
        <tr class="grand-total">
            <td>Grand Total</td>
            <td>${totalQty}</td>
            <td>${totalPrice.toFixed(2)}</td>
    </tr>`;
// Akhir Average Quantity And Value Per Store

// Line Chart
function getDataTransactionQuantityMonth(rows) {
  const labels = ["January", "February", "March", "April", "May", "June"];
  const data = {
    data: [],
    labels: "My first Website",
  };
  for (let i = 0; i < labels.length; i++) {
    const row = rows.filter((item) => item.id == i + 1);
    data.data.push(row[0] ? row[0].value : 0);
  }
  return {
    labels,
    data,
  };
}

const ctxLineChart = document
  .getElementById("transactionChart")
  .getContext("2d");
const dataLineChart = getDataTransactionQuantityMonth(transactionQtyMonths);
const linechart = new Chart(ctxLineChart, {
  type: "line",
  data: {
    labels: dataLineChart.labels,
    datasets: [dataLineChart.data],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
// Akhir Line Chart

// Awal Pie Chart
function getDataPieChart(rows, totalTransactionQty) {
  const labels = [];
  const data = {
    data: [],
    backgroundColor: [],
  };
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    labels.push(row.name);
    data.data.push(totalTransactionQty / row.value);
    if (row.id == "8") {
      data.backgroundColor.push("#967259");
    } else if (row.id == "5") {
      data.backgroundColor.push("#634832");
    } else if (row.id == "3") {
      data.backgroundColor.push("#DDAA86");
    }
  }
  return {
    labels,
    data,
  };
}
const dataPieChart = getDataPieChart(
  averageTransactionQtyPerStore,
  totalTransactionQty
);
const ctxPieChart = document.getElementById("storePieChart").getContext("2d");
const pieChart = new Chart(ctxPieChart, {
  type: "pie",
  data: {
    labels: dataPieChart.labels,
    datasets: [dataPieChart.data],
  },
  options: {},
});
// Akhir Pie Chart

// DataTable
const dataTable = new DataTable("#myTable", {
  columns: [
    { data: "transaction_id" },
    { data: "transaction_date" },
    { data: "transaction_time" },
    { data: "transaction_qty" },
    { data: "store_id" },
    { data: "store_location" },
    { data: "product_id" },
    { data: "unit_price" },
    { data: "product_category" },
    { data: "product_type" },
    { data: "product_detail" },
  ],
  data: datasets,
});
// Akhir DataTable

// Filter
function convertToDateFormat(dateStr) {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const store = document.getElementById("store");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

let localStoreId =
  localStorage.getItem("storeId") == null ? 8 : localStorage.getItem("storeId");
let localStartDate =
  localStorage.getItem("startDate") == null
    ? new Date("2023-01-01")
    : convertToDateFormat(new Date(localStorage.getItem("startDate")));
let localEndDate =
  localStorage.getItem("endDate") == null
    ? new Date("2023-06-30").toISOString().split("T")[0]
    : convertToDateFormat(new Date(localStorage.getItem("endDate")));

store.value = localStoreId;
startDate.value = localStartDate;
endDate.value = localEndDate;

document.querySelector("#filterButton").addEventListener("click", (event) => {
  const store = document.querySelector("#store");
  const startDate = document.querySelector("#startDate");
  const endDate = document.querySelector("#endDate");
  const valueStore = store.value;
  const valueStartDate = startDate.value;
  const valueEndDate = endDate.value;
  const dateStart = new Date(valueStartDate).setHours(0, 0, 0, 0);
  const dateEnd = new Date(valueEndDate).setHours(0, 0, 0, 0);

  localStorage.setItem("storeId", valueStore);
  localStorage.setItem("startDate", valueStartDate);
  localStorage.setItem("endDate", valueEndDate);

  const newDatasets = datasets.filter((dataset) => {
    const dateTransaction = new Date(dataset.transaction_date).setHours(
      0,
      0,
      0,
      0
    );

    if (valueStore !== "all" && valueStartDate !== "" && valueEndDate !== "") {
      return (
        valueStore == dataset.store_id &&
        dateTransaction >= dateStart &&
        dateTransaction <= dateEnd
      );
    } else if (
      valueStore !== "all" &&
      valueStartDate !== "" &&
      valueEndDate === ""
    ) {
      return valueStore == dataset.store_id && dateTransaction >= dateStart;
    } else if (
      valueStore !== "all" &&
      valueStartDate === "" &&
      valueEndDate !== ""
    ) {
      return valueStore == dataset.store_id && dateTransaction <= dateEnd;
    } else if (
      valueStore !== "all" &&
      valueStartDate === "" &&
      valueEndDate === ""
    ) {
      return valueStore == dataset.store_id;
    } else if (
      valueStore === "all" &&
      valueStartDate === "" &&
      valueEndDate !== ""
    ) {
      return dateTransaction <= dateEnd;
    } else if (
      valueStore === "all" &&
      valueStartDate !== "" &&
      valueEndDate === ""
    ) {
      return dateTransaction >= dateStart;
    }else if (
        valueStore === "all" &&
        valueStartDate !== "" &&
        valueEndDate !== ""
      ) {
        return dateTransaction<=dateEnd&&dateTransaction >= dateStart ;
      }
    return true;
  });

  let transactionQtyMonths = [];
  let averageQtyAndVallueStores = [];
  let averageQtyAndVallueProductType = [];
  let averageTransactionQtyPerStore = [];
  let averageSpendingPerTransaction = 0;
  let totalTransactionQty = 0;
  let totalUnitPrice = 0;

  for (let i = 0; i < newDatasets.length; i++) {
    const dataset = newDatasets[i];

    // Awal Average Spending Per Transaction Quantty
    totalTransactionQty += dataset.transaction_qty;
    // Akhir Average Spending Per Transaction Quantty

    // Untuk Line Chart
    if (
      transactionQtyMonths.filter(
        (item) => item.id === dataset.transaction_date.split("-")[1]
      ).length > 0
    ) {
      transactionQtyMonths = transactionQtyMonths.map((item) => {
        if (item.id === dataset.transaction_date.split("-")[1]) {
          return {
            ...item,
            value: item.value + dataset.transaction_qty * dataset.unit_price,
          };
        }
        return item;
      });
    } else {
      transactionQtyMonths.push({
        id: dataset.transaction_date.split("-")[1],
        value: dataset.transaction_qty * dataset.unit_price,
      });
    }
    // Akhir Line Chart

    // Untuk Average Transaction Quantity And Value Per Store
    if (
      averageQtyAndVallueStores.filter((item) => item.id === dataset.store_id)
        .length > 0
    ) {
      averageQtyAndVallueStores = averageQtyAndVallueStores.map((item) => {
        if (item.id === dataset.store_id) {
          return {
            ...item,
            transaction_qty: item.transaction_qty + dataset.transaction_qty,
            price: item.price + dataset.unit_price,
            value:item.value + dataset.unit_price * dataset.transaction_qty
          };
        }
        return item;
      });
    } else {
      averageQtyAndVallueStores.push({
        id: dataset.store_id,
        name: dataset.store_location,
        transaction_qty: dataset.transaction_qty,
        price: dataset.unit_price,
        value: dataset.unit_price * dataset.transaction_qty
      });
    }
    // Akhir Average Transaction Quantity And Value Per Store

    // Untuk Average Transaction Quantity Per Store
    if (
      averageTransactionQtyPerStore.filter(
        (item) => item.id === dataset.store_id
      ).length > 0
    ) {
      averageTransactionQtyPerStore = averageTransactionQtyPerStore.map(
        (item) => {
          if (item.id === dataset.store_id) {
            return {
              ...item,
              value: item.value + 1,
            };
          }
          return item;
        }
      );
    } else {
      averageTransactionQtyPerStore.push({
        id: dataset.store_id,
        name: dataset.store_location,
        value: 1,
      });
    }
    // Akhir Average Transaction Quantity Per Store

    // Awal Average Quantity And Value Per Product Type
    if (
      averageQtyAndVallueProductType.filter(
        (item) => item.id === dataset.product_type
      ).length > 0
    ) {
      averageQtyAndVallueProductType = averageQtyAndVallueProductType.map(
        (item) => {
          if (item.id === dataset.product_type) {
            return {
              ...item,
              transaction_qty: item.transaction_qty + dataset.transaction_qty,
              price: item.price + dataset.unit_price,
              value: item.value + dataset.unit_price * dataset.transaction_qty
            };
          }
          return item;
        }
      );
    } else {
      averageQtyAndVallueProductType.push({
        id: dataset.product_type,
        name: dataset.product_type,
        transaction_qty: dataset.transaction_qty,
        price: dataset.unit_price,
        value: dataset.unit_price * dataset.transaction_qty
      });
    }
    // Akhir Average Quantity And Value Per Product Type

    // Awal Average Spending Per Transaction
    averageSpendingPerTransaction +=
      dataset.unit_price * dataset.transaction_qty;
    // Akhir Average Spending Per Transaction

    // Awal Average Quantity Per Transaction
    totalUnitPrice += dataset.unit_price;
    // Akhir Average Quantity Per Transaction
  }
  console.log(averageSpendingPerTransaction)
  // Awal Average Quantity Sales Per Month
  let avgQtySalesPerMonth = 0;
  let totalQtySalesPerMonth = 0;
  for (let i = 0; i < transactionQtyMonths.length; i++) {
    const transactionQtyMonth = transactionQtyMonths[i];
    totalQtySalesPerMonth += transactionQtyMonth.value;
  }
  avgQtySalesPerMonth = totalTransactionQty / transactionQtyMonths.length;
  document.querySelector("#avgQtySalesPerMonth").innerHTML =
    avgQtySalesPerMonth.toFixed(2);
  document.querySelector("#averageQtyPerTransaction").innerHTML =
    avgQtyPerTransaction 
  document.querySelector("#averageSpendingPerTransaction").innerHTML =
    "$" + (totalSpending / newDatasets.length).toFixed(2);
  document.querySelector("#averageSpendingPerTransactionQty").innerHTML =
    "$" + (totalSpending / totalTransactionQty).toFixed(2);
  // Akhir Average Quantity Sales Per Month

  // Awal Average Quantity And Value Per Product Category
  const productTable = document.querySelector("#productTable tbody");
  productTable.innerHTML = "";
  let totalQtyProductTable = 0;
  let totalPriceProductTable = 0;
  for (let i = 0; i < averageQtyAndVallueProductType.length; i++) {
    const productType = averageQtyAndVallueProductType[i];
    totalPriceProductTable += productType.value;
    totalQtyProductTable += productType.transaction_qty;
    productTable.innerHTML += `
        <tr class="mid">
            <td>${productType.name}</td>
            <td>${productType.transaction_qty}</td>
            <td>${(productType.value).toFixed(
              2
            )}</td>
        </tr>`;
  }
  productTable.innerHTML += `
        <tr class="grand-total">
            <td>Grand Total</td>
            <td>${totalQtyProductTable}</td>
            <td>${totalPriceProductTable.toFixed(2)}</td>
    </tr>`;
  // Akhir Average Quantity And Value Per Product Category

  // Awal Average Quantity And Value Per Store
  const storeTable = document.querySelector("#storeTable tbody");

  storeTable.innerHTML = "";
  let totalQty = 0;
  let totalPrice = 0;
  for (let i = 0; i < averageQtyAndVallueStores.length; i++) {
    const store = averageQtyAndVallueStores[i];
    totalPrice += store.value;
    totalQty += store.transaction_qty;
    storeTable.innerHTML += `
        <tr class="mid">
            <td>${store.name}</td>
            <td>${store.transaction_qty}</td>
            <td>${(store.value).toFixed(2)}</td>
        </tr>`;
  }
  storeTable.innerHTML += `
        <tr class="grand-total">
            <td>Grand Total</td>
            <td>${totalQty}</td>
            <td>${totalPrice.toFixed(2)}</td>
    </tr>`;
  // Akhir Average Quantity And Value Per Store

  dataTable.clear();
  dataTable.rows.add(newDatasets);
  dataTable.draw();

  const dataLineChart = getDataTransactionQuantityMonth(transactionQtyMonths);
  linechart.data.datasets = [dataLineChart.data];
  linechart.update();

  const dataPieChart = getDataPieChart(
    averageTransactionQtyPerStore,
    totalTransactionQty
  );
  pieChart.data.labels = [dataPieChart.labels];
  pieChart.data.datasets = [dataPieChart.data];
  pieChart.update();
});
// Akhir Filter