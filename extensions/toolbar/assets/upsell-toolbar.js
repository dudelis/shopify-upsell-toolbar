async function upsellToolbar() {
  //1. Obtain Information from card
  fetch("/cart.js")
    .then((response) => response.json())
    .then((cartData) => {
      console.log(cartData);
      //1.1 Check the cart and either hide OR show the progress bar

      //Checking if the selected market
      let internationalMarket =
        window.upsellToolbarMarket.toLowerCase() !==
        Shopify.country.toLowerCase();
      if (
        cartData.items.length === 0 ||
        cartData.original_total_price === 0 ||
        cartData.requires_shipping === false ||
        cartData.original_total_price / 100 >=
          upsellToolbarSettings.shippinglimit
      ) {
        document.querySelector(".upsell-toolbar").style.display = "none";
      } else {
        document.querySelector(".upsell-toolbar").style.display = "block";
      }

      //2. Calculate the amount left for free shipping
      let amountLeft =
        upsellToolbarSettings.shippinglimit -
        cartData.original_total_price / 100;
      let currency = cartData.currency;
      let percentage =
        (cartData.original_total_price /
          100 /
          upsellToolbarSettings.shippinglimit) *
        100;
      console.log("percentage", percentage);
      console.log("amountLeft", amountLeft);

      //3. Display the information on the toolbar
      document.querySelector(
        ".upsell-toolbar-bar"
      ).style.background = `linear-gradient(to right, ${upsellToolbarSettings.barcolor} ${percentage}%, #ffffff ${percentage}%)`;

      document.querySelector(
        "#upsell-toolbar-message-right"
      ).innerText = `Nur noch ${amountLeft.toFixed(2)} ${currency}`;
    });
}

//1.2 If the cart is not empty, show the progress bar and hide the loading div

//2. Obtain configuration for the free shipment

//3. Get the current country

//   const url =
//     "https://phpstack-1035961-3646380.cloudwaysapps.com/api/get-progressbar-data?shop=" +
//     Shopify.shop;

//   fetch(url)
//     .then((response) => response.json())
//     .then((localData) => {
//       if (localData.data.success) {
//         fetch("/cart.js")
//           .then((response) => response.json())
//           .then((Cartdata) => {
//             if (
//               Cartdata.total_price <= 0 &&
//               localData.data.settings?.progressbar_round_behaviour === 1
//             ) {
//               jq(".ProgressBarLoadingWrapper").hide();
//               jq(".ProgressBarMainWrapper").hide();
//               jq(".loadingDiv").show();
//             } else {
//               jq(".ProgressBarLoadingWrapper").show();
//               progressBarElements.forEach(function (div) {
//                 div.style.display = "block";
//               });
//               progressBarTimeline(localData.data);
//               offersBar(localData.data, Cartdata);
//               setUpsellData(
//                 localData.data.settings.upsell,
//                 Cartdata,
//                 localData.data.products,
//                 localData.data
//               );
//             }
//             if (localData.data.settings?.progressbar_round_corner === 1) {
//               jq(".ProgressBarTimmerBody").css({
//                 "border-top-left-radius": "12px",
//                 "border-top-right-radius": "12px",
//               });

//               jq(".ProgressBarBody").css({
//                 "border-bottom-left-radius": "12px",
//                 "border-bottom-right-radius": "12px",
//               });
//             }
//             console.log(
//               "progress bar background 22",
//               localData.data.offer?.hide_counterdown_timer,
//               localData.data.settings?.progressbar_round_corner
//             );
//             if (
//               (localData.data.offer?.hide_counterdown_timer === 1 &&
//                 localData.data.settings?.progressbar_round_corner === 1) ||
//               (localData.data.settings?.progressbar_round_corner === 1 &&
//                 localData.data.offer?.countedown_timer_status === 0)
//             ) {
//               jq(".ProgressBarBody").css({
//                 "border-top-left-radius": "12px",
//                 "border-top-right-radius": "12px",
//               });

//               console.log(
//                 "progress bar background 22 if",
//                 localData.data.offer?.hide_counterdown_timer,
//                 localData.data.settings?.progressbar_round_corner
//               );
//             }
//           })
//           .catch((error) => {
//             console.log("Error fetching cart data:", error);
//           });
//       }
//     })
//     .catch((error) => {
//       console.log("Error fetching progress bar data:", error);
//     });
// }

// progressBar();

function getCurrencySymbol(cartValue) {
  var currencySymbols = {
    BRL: "R$",
    MYR: "RM",
    AED: "AED",
    MOP: "MOP$",
    CHF: "Fr",
    PLN: "zł",
    IDR: "Rp",
    VND: "₫",
    CZK: "Kč",
    AUD: "$",
    RON: "L",
    NZD: "$",
    AWG: "ƒ",
    BDT: "৳",
    CAD: "$",
    CNY: "¥",
    CRC: "₡",
    DKK: "kr",
    EGP: "£",
    EUR: "€",
    FKP: "£",
    GBP: "£",
    GIP: "£",
    ILS: "₪",
    INR: "₹",
    ISK: "kr",
    JPY: "¥",
    KHR: "៛",
    KRW: "₩",
    KZT: "₸",
    LBP: "£",
    NGN: "₦",
    NOK: "kr",
    PHP: "₱",
    PYG: "₲",
    RUB: "₽",
    SDG: "£",
    SEK: "kr",
    SHP: "£",
    SYP: "£",
    TRY: "₺",
    UAH: "₴",
    USD: "$",
    SGD: "$",
    MXN: "$",
    HKD: "$",
    ZAR: "R",
    "": "¤",
  };
  var currencyCode = cartValue.currency;
  var currencySymbol = currencySymbols[currencyCode];
  if (currencySymbol === undefined) {
    currencySymbol = "€";
  }
  return currencySymbol;
}

if (common == undefined) {
  var common = 1;
} else {
  throw "error";
}

// Listening to Cart changes

var { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config] = args;
  // request interceptor here
  const response = await originalFetch(resource, config);
  if (args[0] == "/cart/change" || args[0].includes("/cart/add")) {
    console.log("/cart/change OR /cart/add");
    upsellToolbar();
  }
  return response;
};

var str = window.location.pathname;
var productPath = str.split("/");
if (productPath[1] == "products") {
  document
    .querySelector('[action="/cart/add"] [type="submit"]')
    .addEventListener("click", function (e) {
      console.log("products page - SUBMIT");
      upsellToolbar();
    });
}
document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".quantity__button--minus");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      console.log("minus page");
      upsellToolbar();
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".quantity__button--plus");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      console.log("plus page");
    });
  });
});
upsellToolbar();
