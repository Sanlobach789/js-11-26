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

Vue.component('v-basket', {
    props: ['basketItems', 'isVisibleFlag'],
    template: `
          <div class="Basket-component">
            <button type="button" class="btn btn-primary"
                    id="basketButton" @click="changeBasketVisibility">
                Корзина
            </button>
            <div class="basket-modal" v-if="isVisibleFlag===true" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Корзина</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group" id="userBasketItems">
                                <v-basket-good 
                                v-for="item in basketItems"
                                :basketItem=item
                                :key="item.product_name"
                                ></v-basket-good>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="changeBasketVisibility">Закрыть</button>
                            <button type="button" class="btn btn-primary">Оформить заказ</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
    `,
    methods: {
        changeBasketVisibility() {
            this.$emit('change-is-cart-visible')
        },

    }
});

Vue.component('v-basket-good', {
    props: ['basketItem'],
    template: `
        <li class="list-group-item">{{basketItem.product_name}} Цена:{{basketItem.price}} Количество: {{basketItem.quantity}}</li>
    `,
});

Vue.component('v-goods', {
    props: ['goodsList'],
    template: `   
        <div class="goods-list">
            <v-good
            v-for="good in goodsList"
            :item=good
            :key=good.product_name
            @addToBasket="handleAddToBasket">
            <div v-if="!goodsList.length" class="goods-empty"
                Нет данных
            </v-good>
        </div>
    `,
    methods: {
        handleAddToBasket(data) {
            this.$emit('add', data);
        },
    }
});

Vue.component('v-good', {
    props: ['item'],
    template: `   
        <div class="goods-item"><h3>{{item.product_name}}</h3>
                <p>{{item.price}}</p>
                <button type="button" :click="addToBasket">В корзину</button>
            </div>
    `,

    methods: {
        addToBasket() {
            this.$emmit('addToBasket', this.item)
        }
    }
});

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