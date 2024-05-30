document.addEventListener('DOMContentLoaded', function() {
    const transactionData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        salesData: [1200, 1500, 1700, 1400, 1800, 1600],
        productData: [
            { label: 'Gourmet brewed coffee', quantity: 25973 },
            { label: 'Barista Espresso', quantity: 24943 },
            { label: 'Organic brewed coffee', quantity: 13012 },
            { label: 'Drip Coffee', quantity: 12891 },
            { label: 'Premium brewed Coffee', quantity: 12431 }
        ]
    };
    const transactionData2 = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        salesData: [1200, 1500, 1700, 1400, 1800, 1600],
        productData: [
            { label: 'Lower Manhattan', quantity: 25973 },
            { label: 'Hells Kitchen', quantity: 24943 },
            { label: 'Astoria', quantity: 13012 }
        ]
    };

    // Line Chart
    const ctxLineChart = document.getElementById('transactionChart').getContext('2d');
    // Create gradient
    const gradient = ctxLineChart.createLinearGradient(0, 0, 0, ctxLineChart.canvas.height);
    gradient.addColorStop(0, 'rgba(150, 114, 89, 0.8)');  // Dark color at the top with 80% opacity
    gradient.addColorStop(0.5, 'rgba(236, 218, 205, 0.5)'); // Mid color with 50% opacity
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');  // Light color at the bottom with 20% opacity

    const lineChart = new Chart(ctxLineChart, {
        type: 'line',
        data: {
            labels: transactionData.labels,
            datasets: [{
                label: 'Sales Data',
                data: transactionData.salesData,
                fill: true, // Enable fill
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


    // Pie Chart
    const ctxPieChart = document.getElementById('storePieChart').getContext('2d');
    const pieChart = new Chart(ctxPieChart, {
        type: 'pie',
        data: {
            labels: transactionData2.productData.map(product => product.label),
            datasets: [{
                label: '  Avg Transaction Quantity Per Store',
                data: transactionData2.productData.map(product => product.quantity),
                backgroundColor: [
                    'rgb(99, 72, 50)',
                    'rgb(150, 114, 89)',
                    'rgb(221, 170, 134)',
                ]                
            }]
        },
        options: {}
    });
});