'use strict'

class Cart {
    constructor() {

    }

    cartSum(itemsList) {

    }

    addToCart(){

    }

    deleteFromCart(){

    }

    getCartGoodsList(){

    }

    clearCart(){

    }
    render(){

    }

}

class GoodsItem {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
  }
}

class GoodsList {
  constructor() {
    this.goods = [];
  }

  fetchGoods() {
    this.goods = [
      { title: 'Shirt', price: 150 },
      { title: 'Socks', price: 50 },
      { title: 'Jacket', price: 350 },
      { title: 'Shoes', price: 250 },
    ];
  }

  totalSum(goodsList){
    let goodsListSum = 0;
    this.goods.forEach(good => {
      goodsListSum += good.price
    });
    return goodsListSum;
  }

  render() {
    let listHtml = '';
    this.goods.forEach(good => {
      const goodItem = new GoodsItem(good.title, good.price);
      listHtml += goodItem.render();
    });
    document.querySelector('.goods-list').innerHTML = listHtml;
  }
}

const list = new GoodsList();
list.fetchGoods();
list.render();

// const renderGoodsItem = (title = '...', price = 'Нет в наличие') => {
//     return `<div class="catalog-column">
//                 <div class="catalog-item">
//
//                     <h3 class="item-heading">${title}</h3>
//                     <p class="item-description">Lorem ipsum dolor sit amet.</p>
//                     <p class="item-price">${price} &#8381;</p>
//                     <button type="button" class="btn btn-primary item-to-cart-button">Добавить в корзину</button>
//                 </div>
//             </div>`;
// };
//
// const renderGoodsList = (list) => {
//     let goodsList = list.map(item => renderGoodsItem(item.title, item.price));
//     document.querySelector('.catalog').innerHTML = goodsList.join('');
// }
//
// renderGoodsList(goods);