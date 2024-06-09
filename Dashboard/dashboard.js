document.addEventListener('DOMContentLoaded', async function() {
    // Fetch data from data.json
    const response = await fetch('data.json');
    const data = await response.json();

    // Function to filter data based on selected store, start date, and end date
    function filterData(storeId, startDate, endDate) {
        return data.filter(item => {
            const transactionDate = new Date(item.transaction_date);
            if (storeId !== 'all' && item.store_id !== parseInt(storeId)) {
                return false;
            }
            if (transactionDate < startDate || transactionDate > endDate) {
                return false;
            }
            return true;
        });
    }

    // Function to calculate statistics
    function calculateStatistics(filteredData) {
        const totalQuantity = filteredData.reduce((sum, item) => sum + item.transaction_qty, 0);
        const totalValue = filteredData.reduce((sum, item) => sum + (item.transaction_qty * item.unit_price), 0);
        const avgQuantityPerMonth = totalQuantity / 6; // Assuming 6 months of data
        const avgQuantityPerTransaction = filteredData.length ? totalQuantity / filteredData.length : 0;
        const avgSpendingPerTransaction = filteredData.length ? totalValue / filteredData.length : 0;
        const avgSpendingPerTransactionQuantity = totalQuantity ? totalValue / totalQuantity : 0;

        return {
            totalQuantity,
            totalValue,
            avgQuantityPerMonth,
            avgQuantityPerTransaction,
            avgSpendingPerTransaction,
            avgSpendingPerTransactionQuantity
        };
    }

    // Function to update highlight boxes
    function updateHighlightBoxes(statistics) {
        const highlightBoxes = document.querySelectorAll('.hi-box');
        highlightBoxes[0].querySelector('p').textContent = statistics.avgQuantityPerMonth.toFixed(0);
        highlightBoxes[1].querySelector('p').textContent = statistics.avgQuantityPerTransaction.toFixed(0);
        highlightBoxes[2].querySelector('p').textContent = statistics.avgSpendingPerTransaction.toFixed(2);
        highlightBoxes[3].querySelector('p').textContent = statistics.avgSpendingPerTransactionQuantity.toFixed(2);
    }

    // Function to update transaction chart
    function updateTransactionChart(filteredData) {
        const transactionData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            salesData: [0, 0, 0, 0, 0, 0]
        };

        filteredData.forEach(item => {
            const month = new Date(item.transaction_date).getMonth();
            transactionData.salesData[month] += item.transaction_qty;
        });

        const ctxLineChart = document.getElementById('transactionChart').getContext('2d');
        const gradient = ctxLineChart.createLinearGradient(0, 0, 0, ctxLineChart.canvas.height);
        gradient.addColorStop(0, 'rgba(150, 114, 89, 0.8)');
        gradient.addColorStop(0.5, 'rgba(236, 218, 205, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

        const lineChart = new Chart(ctxLineChart, {
            type: 'line',
            data: {
                labels: transactionData.labels,
                datasets: [{
                    label: 'Sales Data',
                    data: transactionData.salesData,
                    fill: true,
                    borderColor: 'rgb(99, 72, 50)',
                    backgroundColor: gradient,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function to update store table
    function updateStoreTable(filteredData) {
        const storeData = {};

        filteredData.forEach(item => {
            const storeId = item.store_id;
            const transactionQty = item.transaction_qty;
            const transactionValue = item.transaction_qty * item.unit_price;

            if (storeData[storeId]) {
                storeData[storeId].transactionQty += transactionQty;
                storeData[storeId].transactionValue += transactionValue;
            } else {
                storeData[storeId] = {
                    storeLocation: item.store_location,
                    transactionQty,
                    transactionValue
                };
            }
        });

        const storeTableBody = document.querySelector('#storeTable tbody');
        storeTableBody.innerHTML = '';

        let grandTotalQty = 0;
        let grandTotalValue = 0;

        Object.values(storeData).forEach(store => {
            const row = document.createElement('tr');
            row.classList.add('mid');
            row.innerHTML = `
                <td>${store.storeLocation}</td>
                <td>${store.transactionQty}</td>
                <td>$${store.transactionValue.toFixed(2)}</td>
            `;
            storeTableBody.appendChild(row);

            grandTotalQty += store.transactionQty;
            grandTotalValue += store.transactionValue;
        });

        const grandTotalRow = document.createElement('tr');
        grandTotalRow.classList.add('grand-total');
        grandTotalRow.innerHTML = `
            <td>Grand Total</td>
            <td>${grandTotalQty}</td>
            <td>$${grandTotalValue.toFixed(2)}</td>
        `;
        storeTableBody.appendChild(grandTotalRow);
    }

    // Function to update product table
    function updateProductTable(filteredData) {
        const productData = {};

        filteredData.forEach(item => {
            const productType = item.product_type;
            const transactionQty = item.transaction_qty;
            const transactionValue = item.transaction_qty * item.unit_price;

            if (productData[productType]) {
                productData[productType].transactionQty += transactionQty;
                productData[productType].transactionValue += transactionValue;
            } else {
                productData[productType] = {
                    productType,
                    transactionQty,
                    transactionValue
                };
            }
        });

        const productTableBody = document.querySelector('#productTable tbody');
        productTableBody.innerHTML = '';

        let grandTotalQty = 0;
        let grandTotalValue = 0;

        Object.values(productData).forEach(product => {
            const row = document.createElement('tr');
            row.classList.add('mid');
            row.innerHTML = `
                <td>${product.productType}</td>
                <td>${product.transactionQty}</td>
                <td>$${product.transactionValue.toFixed(2)}</td>
            `;
            productTableBody.appendChild(row);

            grandTotalQty += product.transactionQty;
            grandTotalValue += product.transactionValue;
        });

        const grandTotalRow = document.createElement('tr');
        grandTotalRow.classList.add('grand-total');
        grandTotalRow.innerHTML = `
            <td>Grand Total</td>
            <td>${grandTotalQty}</td>
            <td>$${grandTotalValue.toFixed(2)}</td>
        `;
        productTableBody.appendChild(grandTotalRow);
    }

    function updateStorePieChart(filteredData) {
        const storeData = {};
        
        filteredData.forEach(item => {
            const storeId = item.store_id;
            const transactionQty = item.transaction_qty;
            
            if (storeData[storeId]) {
                storeData[storeId].transactionQty += transactionQty;
            } else {
                storeData[storeId] = {
                    storeLocation: item.store_location,
                    transactionQty
                };
            }
        });
        
        const ctxPieChart = document.getElementById('storePieChart').getContext('2d');
        const pieChart = new Chart(ctxPieChart, {
            type: 'pie',
            data: {
                labels: Object.values(storeData).map(store => store.storeLocation),
                datasets: [{
                    label: 'Avg Transaction Quantity Per Store',
                    data: Object.values(storeData).map(store => store.transactionQty),
                    backgroundColor: [
                        'rgb(99, 72, 50)',
                        'rgb(150, 114, 89)',
                        'rgb(221, 170, 134)'
                    ]
                }]
            },
            options: {}
        });
    }

    // Function to update data table
    function updateDataTable(filteredData) {
        const dataTable = $('#myTable').DataTable();
        dataTable.clear();
        dataTable.rows.add(filteredData);
        dataTable.draw();
    }

    // Initial data loading and updates
    let filteredData = filterData('all', new Date('2023-01-01'), new Date('2023-06-30'));
    let statistics = calculateStatistics(filteredData);

    updateHighlightBoxes(statistics);
    updateTransactionChart(filteredData);
    updateStoreTable(filteredData);
    updateProductTable(filteredData);
    updateStorePieChart(filteredData);
    updateDataTable(filteredData);

    // Event listener for filter button
    const filterButton = document.getElementById('filterButton');
    filterButton.addEventListener('click', () => {
        const storeId = document.getElementById('store').value;
        const startDate = new Date(document.getElementsByName('startDate')[0].value);
        const endDate = new Date(document.getElementsByName('endDate')[0].value);

        filteredData = filterData(storeId, startDate, endDate);
        statistics = calculateStatistics(filteredData);

        updateHighlightBoxes(statistics);
        updateTransactionChart(filteredData);
        updateStoreTable(filteredData);
        updateProductTable(filteredData);
        updateStorePieChart(filteredData);
        updateDataTable(filteredData);
    });
});