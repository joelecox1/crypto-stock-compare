var cryptoUrl = "https://api.coinlore.net/api/tickers/";
var stockModal = document.getElementById("myStockModal");
var cryptoModal = document.getElementById("myCryptoModal");
var stockModalContent = document.getElementsByClassName("stockModalContent");
var cryptoModalContent = document.getElementsByClassName("cryptoModalContent");
var cryptoArr = JSON.parse(localStorage.getItem("crypto")) || [];
var stockArr = JSON.parse(localStorage.getItem("stock")) || [];

$(".cryptoBtn").click(function () {
  //define variable of crypto search input
  var crypto = $("#cryptoInput").val().trim();
  $("#cryptoInput").val("");
  cryptoSearch(crypto);
  console.log(crypto.toLowerCase());
});

var cryptoSearch = function (crypto) {
  // fetch crypto data
  fetch(cryptoUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (cryptoInfo) {
        // loop thru cryptoInfo.data to find the entry matching the user input
        for (var i = 0; i < cryptoInfo.data.length; i++) {
          // if the currently indexed entry matches the user input, declare the desired data as a variable
          if (
            cryptoInfo.data[i].symbol === crypto ||
            cryptoInfo.data[i].name === crypto ||
            cryptoInfo.data[i].symbol === crypto.toUpperCase() ||
            cryptoInfo.data[i].name.toLowerCase() === crypto
          ) {
            var target = cryptoInfo.data[i];
          }
        }
        // declare variable for current price
        console.log(target);
        var price = target.price_usd;
        var changeHour = target.percent_change_1h;
        var changeWeek = target.percent_change_7d;
        console.log(changeWeek);

        // clears modal before appending new data
        $(cryptoModalContent).html("");

        // prepends data readout to modal div
        $(cryptoModalContent).prepend(
          `<h3>Change In Past Hour:  ${changeHour}%</h3>`
        );
        $(cryptoModalContent).prepend(
          `<h3>Change In Past Week:  ${changeWeek}%</h3>`
        );

        // Clears container div before appending new search
        $(".crypto-data").html(" ");

        //appends data from search
        $(".crypto-data").append(
          `<div class="search-return">
             <h1>
               ${target.symbol}<i class="chart bar icon"></i>
             </h1>
             <h3 class="amount">Current Price: $${price}</h3>
             <button id ='modalBtnCrypto' class='ui inverted button'> more info </button>
           </div>`
        );

        // If the searched symbol does not appear already in storage, svae button and push to local storage
        if (!cryptoArr.includes(target.symbol)) {
          cryptoArr.unshift(target.symbol);
          localStorage.setItem(
            "crypto",
            JSON.stringify(cryptoArr).toUpperCase()
          );
          $(".cryptoSearches").append(
            `<button class='savedBtn ui inverted button'>
               ${target.symbol}
             </button>`
          );
        }
      });
    }
  });
};

// stock search button is clicked
$(".stockBtn").click(function () {
  var stock = $("#stockInput").val().trim().toUpperCase();
  $("#stockInput").val("");
  console.log(stock);
  stockSearch(stock);
});

var stockSearch = function (stock) {
  var alphaUrl =
    "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
    stock +
    "&apikey=CTVQQ6247M8QOVM6";
  // Fetch stock data
  fetch(alphaUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (stockInfo) {
        var obj = stockInfo["Time Series (Daily)"];
        //convert returned object to array to find latest entry
        var arr = Object.entries(obj);
        // variable for closing price of most recent business day
        var dailyHigh = arr[0][1]["2. high"];
        var dailyLow = arr[0][1]["3. low"];
        var close = arr[0][1]["4. close"];

        console.log(dailyHigh);

        // clears modal before appending new data
        $(stockModalContent).html("");

        // prepends data readout to modal div
        $(stockModalContent).append(`<h3>Daily High: $${dailyHigh}</h3>`);
        $(stockModalContent).append(`<h3>Daily Low: $${dailyLow}</h3>`);

        // Clears container div before appending new search
        $(".stock-data").html(" ");

        //appends data from search
        $(".stock-data").append(
          `<div class="search-return">
            <h1>${stock}
              <i class="chart bar icon"></i>
            </h1>
            <h3 class="amount">Closing Price: $${close}</h3>
            <button id ='modalBtnStock' class='ui inverted button'> more info </button>
          </div>`
        );
        // If the searched symbol does not appear already in storage, save button and push to local storage
        if (!stockArr.includes(stock)) {
          stockArr.unshift(stock);
          localStorage.setItem("stock", JSON.stringify(stockArr).toUpperCase());
          $(".stockSearches").append(
            `<button class='savedBtn ui inverted button'>
                    ${stock.toUpperCase()}
                  </button>`
          );
        }
      });
    }
  });
};

renderBtns(cryptoArr);

function renderBtns() {
  for (var i = 0; i < cryptoArr.length; i++) {
    $(".cryptoSearches").append(
      `<button class='savedBtn ui inverted button'>
         ${cryptoArr[i]}
       </button>`
    );
  }
}

renderStockBtns();

function renderStockBtns() {
  for (var i = 0; i < stockArr.length; i++) {
    $(".stockSearches").append(
      `<button class='savedBtn ui inverted button'>
        ${stockArr[i]}
      </button>`
    );
  }
}

$(".stockSearches").on("click", "button", function (event) {
  var stock = $(event.target).html().trim();
  stockSearch(stock);
});

$(".cryptoSearches").on("click", "button", function (event) {
  var crypto = $(event.target).html().trim();
  cryptoSearch(crypto);
});

$(".stock-data").on("click", "button", function (event) {
  $(".modalStockDiv").modal("show");
});

$(".crypto-data").on("click", "button", function (event) {
  $(".modalCryptoDiv").modal("show");
});
