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

new Vue({
    el: '#app',
    data: {
        goods: [],
        basketGoods: [],
        searchValue: '',
        isVisible: false,
    },
    mounted() {
        this.fetchData();
        this.fetchBasketData();
    },
    methods: {
        fetchData() {
            return new Promise((resolve, reject) => {
                sendRequest('catalogData.json')
                    .then((data) => {
                        this.goods = data;
                        resolve();
                    });
            });
        },
        fetchBasketData() {
            return new Promise((resolve, reject) => {
                sendRequest('getBasket.json')
                    .then((data) => {
                        this.basketGoods = data.contents;
                        // this.amount = data.amount;
                        // this.countGoods = data.countGoods;
                        resolve();
                    });
            });
        },
        addToBasket(item) {
            const index = this.basketGoods.findIndex((basketItem) => basketItem.id_product === item.id_product);
            if (index > -1) {
                this.basketGoods[index].quantity += 1;
                // this.basketGoods[index] = { ...this.basketGoods[index], quantity: this.basketGoods[index].quantity + 1 };
            } else {
                this.basketGoods.push(item);
            }
            console.log(this.basketGoods);
        },
        removeItem(id) {
            this.basketGoods = this.basketGoods.filter((goodsItem) => goodsItem.id_product !== parseInt(id));
            console.log(this.basketGoods);
        },

        openBasket() {
            this.isVisible = true
            console.log('Корзина открыта')

        },
        closeBasket() {
            this.isVisible = false
            console.log('Корзина закрыта')
        }
    },
    computed: {
        filteredGoods() {
            const regexp = new RegExp(this.searchValue.trim(), 'i');
            return this.goods.filter((goodsItem) => regexp.test(goodsItem.product_name));
        },
        totalPrice() {
            return this.goods.reduce((acc, curVal) => {
                return acc + curVal.price;
            }, 0);
        },
        // someComputedProp: {
        //   get() {
        //     return this.name.toUpperCaes();
        //   },
        //   set(value) {
        //     this.name = value.split('/');
        //   }
        // }
    },
})