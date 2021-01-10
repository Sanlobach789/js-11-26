'use strict'

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const sendRequest = (path) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.timeout = 10000;

        xhr.ontimeout = () => {
            console.log('timeout!');
        }

        xhr.onreadystatechange = () => {
            // console.log('ready state change', xhr.readyState);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    console.log('Error!', xhr.responseText);
                    reject(xhr.responseText);
                }
            }
        }

        xhr.open('GET', `${API_URL}/${path}`);

        // xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send();
    });
}


class GoodsItem {
    constructor({id_product, product_name, price}) {
        this.id = id_product;
        this.title = product_name;
        this.price = price;
    }

    render() {
        return `<div class="goods-item" data-id="${this.id}"><h3>${this.title}</h3><p>${this.price}</p>
                <button type="button" name="add-to-basket">В корзину</button></div>
        `;
    }
}

class GoodsList {
    constructor(basket) {
        this.goods = [];
        this.basket = basket;

        document.querySelector('.goods-list').addEventListener('click', (event) => {
            if (event.target.name === 'add-to-basket') {
                const id = event.target.parentElement.dataset.id;
                const item = this.goods.find((goodsItem) => goodsItem.id_product === parseInt(id));
                if (item) {
                    this.addToBasket(item);
                } else {
                    console.error(`Can't find element with id ${id}`)
                }
            }
        });
    }

    fetchData() {
        return new Promise((resolve, reject) => {
            sendRequest('catalogData.json')
                .then((data) => {
                    this.goods = data;
                    console.log(this.goods);
                    resolve();
                });
        });
    }

    newFetchData(callback) {
        fetch(`${API_URL}/catalogData.json`)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.goods = data;
                callback();
            });
    }

    addToBasket(item) {
        this.basket.addItem(item);
    }

    getTotalPrice() {
        return this.goods.reduce((acc, curVal) => {
            return acc + curVal.price;
        }, 0);
    }

    render() {
        const goodsList = this.goods.map(item => {
            const goodsItem = new GoodsItem(item);
            return goodsItem.render();
        });
        document.querySelector('.goods-list').innerHTML = goodsList.join('');
    }
}

class Basket {
    constructor() {
        this.basketGoods = [];
        this.amount = 0;
        this.countGoods = 0;
    }

    addItem(item) {
        this.basketGoods.push(item);
        console.log(this.basketGoods);
    }

    removeItem(id) {
        this.basketGoods = this.basketGoods.filter((goodsItem) => goodsItem.id_product !== parseInt(id));
        console.log(this.basketGoods);
    }

    changeQuantity() {

    }

    clear() {

    }

    fetchData() {
        return new Promise((resolve, reject) => {
            sendRequest('getBasket.json')
                .then((data) => {
                    this.basketGoods = data.contents;
                    this.amount = data.amount;
                    this.countGoods = data.countGoods;
                    console.log(this);
                    resolve();
                });
        });
    }

    applyPromoCode() {

    }

    getDeliveryPrice() {

    }

    createOrder() {

    }

    getTotalPrice() {

    }

    render() {
        document.getElementById('basketButton').addEventListener('click', (event) => {
            let basketListElement = document.getElementById('userBasketItems');
            const goodsList = this.basketGoods.map(item => {
                const basketItem = new BasketItem(item);
                return basketItem.render();
            });
            basketListElement.innerHTML = goodsList.join('')
        })
    }
}

class BasketItem {

    constructor(item) {
        this.id = item.id_product;
        this.title = item.product_name;
        this.price = item.price;
    }

    render() {
        return '<li class="list-group-item"></li>';
    }

    changeQuantity() {

    }

    removeItem() {
    }

    changeType() {
    }


}

const basket = new Basket();
basket.fetchData();
basket.render();
const goodsList = new GoodsList(basket);
goodsList.fetchData()
    .then(() => {
        goodsList.render();
        goodsList.getTotalPrice();
    });


