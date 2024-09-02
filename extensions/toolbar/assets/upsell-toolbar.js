document.addEventListener("DOMContentLoaded", function () {
  var toolbar = document.getElementById("upsell-toolbar");
  var toolbarOffsetTop = toolbar.offsetTop;

  window.addEventListener("scroll", function () {
    if (window.scrollY > toolbarOffsetTop) {
      toolbar.classList.add("fixed");
    } else {
      toolbar.classList.remove("fixed");
    }
  });
});

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
      ).innerText = `Nur noch ${amountLeft.toLocaleString(
        Shopify.country.toLowerCase(),
        {
          style: "currency",
          currency: currency,
        }
      )}`;
    });
}

//Function to get the currency symbol
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
