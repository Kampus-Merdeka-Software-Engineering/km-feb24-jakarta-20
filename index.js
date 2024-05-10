// function highlightContainer() {
//     var container = document.getElementById('container');
//     container.classList.remove('highlight'); // Remove highlight from any previously selected item
//     container.classList.add('highlight'); // Add highlight to the container
//   }
function highlightContainer() {
  var sidebarItems = document.querySelectorAll(".sidebars");
  sidebarItems.forEach(item => {
    item.addEventListener("click", function() {
      sidebarItems.forEach(item => {
        item.classList.remove("highlight");
      });
      this.classList.add("highlight");
    });
  });
}

highlightContainer();

const insertDashboardStatistikTransaski = () => {
  const detailStatistikTransaksi = document.querySelector(".detail-statistik-transaksi");
for (let i = 0; i < 4; i++) {
    
}
}
