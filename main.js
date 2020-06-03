/* affix the navbar after scroll below header */
// $('nav').affix({
//       offset: {
//         top: $('#content').offset().top
//       }
// });


console.log('runnin');
var trays = document.querySelectorAll('.addToTray');
let flag = 0;

let products = [{
    name: 'Chocolate Croissant',
    tag: 'chocolatecroissant',
    price: 3.50,
    inTray: 0
  },
  {
    name: 'Danish',
    tag: 'danish',
    price: 4.50,
    inTray: 0
  },
  {
    name: 'Apple Pie',
    tag: 'applepie',
    price: 11.00,
    inTray: 0
  },
  {
    name: 'Chocolate Cookies',
    tag: 'chocolatecookies',
    price: 3.50,
    inTray: 0
  },
  {
    name: 'Vegan Oatmeal Cookies',
    tag: 'veganoatmealcookies',
    price: 5.50,
    inTray: 0
  },
  {
    name: 'French Baguette',
    tag: 'frenchbaguette',
    price: 3.50,
    inTray: 0
  },
  {
    name: 'Donuts',
    tag: 'donuts',
    price: 7.50,
    inTray: 0
  },
  {
    name: 'Macarons',
    tag: 'macarons',
    price: 6.50,
    inTray: 0
  },
  {
    name: 'Chocolate Cupcakes',
    tag: 'chocolatecupcakes',
    price: 9.50,
    inTray: 0
  }
];

for (let i = 0; i < trays.length; i++) {
  trays[i].addEventListener('click', () => {
    trayNumbers(products[i]);
    totalCost(products[i]);
  })
}

function onLoadTrayNumbers() {
  let productNumbers = localStorage.getItem('trayNumbers');
  if (productNumbers) {
    document.querySelector('.navbar-tray span').textContent = productNumbers;
  }
}

function trayNumbers(product, action) {
  let productNumbers = localStorage.getItem('trayNumbers');
  productNumbers = parseInt(productNumbers);
  let trayItems = localStorage.getItem('productsInTray');
  trayItems = JSON.parse(trayItems);

  if (action == "decrease") {
    localStorage.setItem('trayNumbers', productNumbers - 1);
    document.querySelector('.navbar-tray span').textContent = productNumbers - 1;
  } else if (productNumbers) {
    localStorage.setItem('trayNumbers', productNumbers + 1);
    document.querySelector('.navbar-tray span').textContent = productNumbers + 1;
  } else {
    localStorage.setItem('trayNumbers', 1);
    document.querySelector('.navbar-tray span').textContent = 1;
  }
  setItems(product);
}

function setItems(product) {
  let trayItems = localStorage.getItem('productsInTray');
  trayItems = JSON.parse(trayItems);

  if (trayItems != null) {
    if (trayItems[product.tag] == undefined) {
      trayItems = {
        ...trayItems,
        [product.tag]: product
      }
    }
    trayItems[product.tag].inTray += 1;
  } else {
    product.inTray = 1;
    trayItems = {
      [product.tag]: product
    }
  }

  localStorage.setItem("productsInTray", JSON.stringify(trayItems));
}

function totalCost(product, action) {
  // console.log("The product price is ", product.price);
  let trayCost = localStorage.getItem('totalCost');

  console.log("My tray cost is ", trayCost);
  console.log(typeof trayCost);
  if (action == "decrease") {
    trayCost = parseFloat(trayCost);
    localStorage.setItem("totalCost", trayCost - product.price);
  } else if (trayCost != null) {
    trayCost = parseFloat(trayCost);
    localStorage.setItem("totalCost", trayCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayTray() {
  let trayItems = localStorage.getItem("productsInTray");
  trayItems = JSON.parse(trayItems);
  let productContainer = document.querySelector(".products");
  let trayCost = localStorage.getItem('totalCost');

  if (trayItems && productContainer) {
    document.getElementById('promo-container').style.visibility = "visible";
    productContainer.innerHTML = '';
    Object.values(trayItems).map(item => {
      productContainer.innerHTML += `
      <div class="card mb-3" style="background-color: #d27548; font-size: 1.2rem;">
        <div class="row no-gutters trayRow">

          <div class="trayImage col-md-4">
            <div class="product">
              <img src="./Images/${item.tag}.png" style="width: 150px; height: 150px;">
              <span>${item.name}</span>
              <br>
              <i class="fas fa-trash-alt" style="color: #fff; padding: 2% 30%; "></i>
            </div>
          </div>
          <div class="details col-md-8" style="text-align: center;">
            <div class="price" style = "margin: 4% 1%;">Price: $${item.price}</div>
            <div class="quantity" style = "margin: 4% 1%;">
              <i class="fas fa-minus-circle decrease" style="color: #fff; padding: 1% 1%;"></i>
              <span>${item.inTray}</span>
              <i class="fas fa-plus-circle increase" style="color: #fff; padding: 1% 1%;"></i>
            </div>
            <div class="total" style = "margin: 4% 1%;">
              Total: $${item.inTray * item.price}
            </div>
          </div>
        </div>
      </div>
      `;


    });
    productContainer.innerHTML += `
      <div class = "basketTotalContainer" style="float: right; padding: 0 2%;">
      <h4 class="basketTotalTitle">Basket Total</h4>
      <h4 class="basketTotal">$${trayCost}</h4>
      </div>
    `;
  }
  deleteButtons();
  quantityControl();
  checkPromoCode();
  placeOrder();
}

function deleteButtons() {
  let deleteButtons = document.querySelectorAll('.product i');
  let productName
  let productNumbers = localStorage.getItem('trayNumbers');
  let trayItems = localStorage.getItem('productsInTray');
  trayItems = JSON.parse(trayItems);
  let trayCost = localStorage.getItem('totalCost');


  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', () => {
      productName = deleteButtons[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');
      localStorage.setItem('trayNumbers', productNumbers - trayItems[productName].inTray);
      localStorage.setItem('totalCost', trayCost - (trayItems[productName].price * trayItems[productName].inTray));
      delete trayItems[productName];
      localStorage.setItem('productsInTray', JSON.stringify(trayItems));
      displayTray();
      onLoadTrayNumbers();
    });
  }
}

function quantityControl() {
  let decreaseButtons = document.querySelectorAll('.decrease');
  let increaseButtons = document.querySelectorAll('.increase');
  let trayItems = localStorage.getItem('productsInTray');
  trayItems = JSON.parse(trayItems);
  let currentQuantity = 0;
  let currentProduct = "";
  let trayCost = localStorage.getItem('totalCost');

  for (let i = 0; i < decreaseButtons.length; i++) {
    decreaseButtons[i].addEventListener('click', () => {
      currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
      console.log(currentQuantity);
      currentProduct = decreaseButtons[i].parentElement.previousElementSibling.parentElement.previousElementSibling.querySelector('span').textContent.trim().toLowerCase().replace(/ /g, '');
      console.log(currentProduct);
      if (trayItems[currentProduct].inTray > 1) {

        trayItems[currentProduct].inTray -= 1;
        trayNumbers(trayItems[currentProduct], "decrease");
        totalCost(trayItems[currentProduct], "decrease");
        localStorage.setItem('productsInTray', JSON.stringify(trayItems));

        displayTray();
      }

    })
  }
  for (let i = 0; i < increaseButtons.length; i++) {
    increaseButtons[i].addEventListener('click', () => {
      currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
      console.log(currentQuantity);
      currentProduct = increaseButtons[i].parentElement.previousElementSibling.parentElement.previousElementSibling.querySelector('span').textContent.trim().toLowerCase().replace(/ /g, '');
      console.log(currentProduct);
      if (trayItems[currentProduct].inTray < 30) {

        trayItems[currentProduct].inTray += 1;
        trayNumbers(trayItems[currentProduct], "increase");
        totalCost(trayItems[currentProduct], "increase");
        localStorage.setItem('productsInTray', JSON.stringify(trayItems));

        displayTray();
      }
    })
  }
}

function checkPromoCode() {
  let applyCodeBtn = document.querySelector('.applyCode');
  let input = document.querySelector('input');
  input.value = input.value.trim().toUpperCase();
  let trayCost = localStorage.getItem('totalCost');

  applyCodeBtn.addEventListener('click', () => {
    if (input.value == "DONUT50" && flag == 0) {
      trayCost -= trayCost / 2;
      localStorage.setItem("totalCost", trayCost);
      console.log(trayCost);
      flag = 1;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Promo code applied successfully',
        showConfirmButton: false,
        timer: 1500
      })
      displayTray();
    } else if (input.value == "") {
      displayTray();
    } else if (flag == 1) {
      alert("You can't enter the same code again!");
    } else {
      alert("Invalid promo code!");
      displayTray();
    }
  })
}

function placeOrder() {
  let placeOrderBtn = document.querySelector('.placeOrderBtn');
  placeOrderBtn.addEventListener('click', () => {
    console.log('bello');
    Swal.fire({
      title: 'Order placed!',
      text: 'Delicious food is on the way!',
      imageUrl: 'https://media0.giphy.com/media/He4wudo59enf2/giphy.gif',
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
    localStorage.clear();
    flag = 0;
  })
}

function forceInputUppercase(e)
  {
    var start = e.target.selectionStart;
    var end = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(start, end);
  }
  document.getElementById('code').addEventListener("keyup", forceInputUppercase, false);




onLoadTrayNumbers();
displayTray();
