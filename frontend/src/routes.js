import { createRouter, createWebHistory } from "vue-router";
import admin from './components/admin.vue'
import loginPage from './components/loginPage.vue'
import pageNotFound from './components/pageNotFound.vue'
import addProduct from './components/addProduct.vue'
import user from './components/user.vue'
import userInfo from './components/userInfo'
import viewUsersOrder from './components/viewUsersOrder.vue'
import updateProducts from './components/updateProducts.vue'
import productDetail from './components/productDetail.vue'
import userCart from './components/userCart.vue'
import orderHistory from './components/orderHistory.vue'

const routes = [
    {
       path: '/',
       name: 'loginPage',
       component: loginPage
    },
    {
        path: '/admin',
        name: 'admin',
        component: admin
    },
    {
        path: '/addproduct',
        name: 'addProduct',
        component: addProduct,
    },
    {
        path: '/user',
        name: 'user',
        component: user,
    },
    {
        path: '/userInfo',
        name: 'userInfo',
        component: userInfo,
    },
    {
        path: '/viewUsersOrder/:email',
        name: 'viewUsersOrder',
        component: viewUsersOrder
    },
    {
        path: '/updateProducts/:product_id',
        name: 'updateProducts',
        component: updateProducts
    },
    {
        path: '/productDetail/:product_id',
        name: 'productDetail',
        component: productDetail
    },
    {
        path: '/userCart',
        name: 'userCart',
        component: userCart
    },
    {
        path: '/orderHistory',
        name: 'orderHistory',
        component: orderHistory
    },
    {
        name: 'pageNotFound',
        component: pageNotFound,
        path: '/:pathMatch(.*)*'
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router