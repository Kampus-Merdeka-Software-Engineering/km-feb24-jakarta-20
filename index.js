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

highlightContainer();

const listStatistikTransaksi = [
  {
    id: "1",
    title: "Average Quantity Sales Per Month",
    type: "qty",
    value: 10,
    // in hour
    updated:1
  },
  {
    id: "2",
    title: "Average Quantity Per Transaction",
    type: "qty",
    value: 2,
    // in hour
    updated:2
  },
  ,
  {
    id: "3",
    title: "Average Spending Per Transaction",
    type: "transaction",
    value: 49999,
    // in hour
    updated:4
  },
  {
    id: "4",
    title: "Average Spending Per Transaction Quantity",
    type: "transaction",
    value: 39999,
    // in hour
    updated:3
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

document.querySelector('.hamburger').addEventListener('click', function() {
  this.classList.toggle('active');
});