'use strict';
var CartModule = (function($) {

    var cart = $('.shopping-bag');
    var cartBag = cart.find('.bag');
    var cartTotal = cart.find('.bag-price .total');
    var cartAmount = 0;
    var cartProducts = {};

    var addToCartClick = function(event) {
        event.preventDefault();
        var product = $(this).closest('.product');
        var data_product = {
            id:product.data('id'),
            price:product.data('price'),
            name:product.find('.title').text(),
            promo:product.data('promo')
        };
        addProductToBag(data_product);
        updateAmount();
        renderCart();
    };

    var getProducts = function (){
        return cartProducts;
    };

    var removeCart = function (){
        cartProducts = {}
    };

    var getCartAmount = function (){
        updateAmount();
        return cartAmount;
    };

    var addProductToBag = function(product) {
        // Add the product or update the quantity
        (product.id in cartProducts) ? cartProducts[product.id].total = cartProducts[product.id].total + 1 : cartProducts[product.id] = {idProduct: product.id, name: product.name, unitPrice: product.price, total: 1, promo: product.promo};
    };

    var renderCart = function() {
        cartBag.empty();
        $.each( cartProducts, function( id, cartProduct ) {
            var pricePromo = checkPriceProductPromo(cartProduct);
            cartBag.append('' +
                 '<div class="product">' +
                 '<span class="name">' + cartProduct.name + '</span>' +
                 '<span class="currency"> - £</span> ' +
                 '<span class="price">' + pricePromo + '</span>' +
                 '<span class="multiply"> x </span>' +
                 '<span class="number">' + cartProduct.total + '</span>' +
                 '</div>');
            cartTotal.text(cartAmount);
        });
    };

    var updateAmount = function() {
        cartAmount = 0;
        $.each( cartProducts, function( id, cartProduct ) {
            updateTotalPrice(checkPriceProductPromo(cartProduct));
        });
    };

    var checkPriceProductPromo = function(product) {

        var promoElements = 0;
        var normalElements = 0;
        var total = 0;
        var promoPrice = 0;
        var promoCounter = 0;
        switch (product.promo) {
             case 'A':
                 // 3 for 130
                 promoPrice = 130;
                 promoCounter = 3;
                 break;
             case 'B':
                 // 2 for 45
                 promoPrice = 45;
                 promoCounter = 2;
                 break;
         }
        if (typeof product.promo === 'undefined'){
         return product.unitPrice * product.total;
        }
        // Calculate the price including promotions
        promoElements = parseInt(product.total/promoCounter);
        total = promoElements * promoPrice;
        normalElements = product.total%promoCounter;
        total = total + (normalElements * product.unitPrice);

        return total;
     };

    var updateTotalPrice = function(productPrice) {
        cartAmount =  cartAmount + productPrice;
    };

    var bindFunctions = function() {
        $(".add-to-cart").on("click", addToCartClick);
    };

    var init = function() {
        bindFunctions();
    };

    return {
        init: init,
        getProducts: getProducts,
        getCartAmount: getCartAmount,
        checkPriceProductPromo: checkPriceProductPromo,
        addProductToBag: addProductToBag,
        removeCart: removeCart

    };
})(jQuery);
$(document).ready(CartModule.init());