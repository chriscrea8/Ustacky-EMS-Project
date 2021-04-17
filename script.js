if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-remove')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('btn-add')
    for (i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('checkout')[0].addEventListener('click', payWithPaystack)
}

// modal
const open = document.getElementById("open");
const modalContainer = document.getElementById("modal-container");
const close = document.getElementById("close");

open.addEventListener('click', () => {
    modalContainer.classList.add('show');
});

close.addEventListener('click', () => {
    modalContainer.classList.remove('show');
});

/* cart */

var cartIconNumber = document.getElementsByClassName('cart')[0].innerText
var cartIconNumberValue = parseInt(cartIconNumber)

function purchaseClicked() {
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
    location.reload();
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        alert('You cannot have less than 1 item. If you wish to remove the item, click remove.')
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('product-price')[0].innerText
    addItemToCart(title, price)
    updateCartTotal()
}

function addItemToCart(title, price) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = document.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++)  {
        if ( cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }

    var cartNumber = document.getElementsByClassName('cart-item-number')[0]
    cartNumber = 0
    cartIconNumberValue = cartIconNumberValue + 1
    numberValue = cartIconNumberValue.toString()
    document.getElementById('open').innerText = numberValue
    cartIconNumber.innerText = numberValue

    
    var cartRowContents = `<div class="cart-number cart-column">
    <span class="cart-item-number">${cartNumber}</span>
    </div>
    <div class="cart-item cart-column">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-remove" type="button">REMOVE</button>
    </div>`
    cartNumber.innerText = cartNumber + 1
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('N', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = total
}

function payWithPaystack() {
    let handler = PaystackPop.setup({
      key: 'pk_test_6091b024802dbd8f0158775e420c0962a9b6368d', // Replace with your public key
      email: document.getElementById("email-address").value,
      amount: parseFloat(document.getElementById('amount').innerText) * 100,
      Currency: 'NGN',
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: function(){
        alert('Window closed.');
      },
      callback: function(response){
        purchaseClicked();
      }
    });
    handler.openIframe();
  }