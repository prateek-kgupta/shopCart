<template>
  <div class="main">
    <navBar />
    <table>
      <tr>
        <th></th>
        <th>NAME</th>
        <th>QUANTITY</th>
        <th>PRICE</th>
        <th>AMOUNT</th>
      </tr>
      <tr v-for="order in orders" :key="order.sale_id">
        <td>
          <img
            :src="getImageUrl(order.product_image)"
            alt="Image of the product"
          />
        </td>
        <td>{{order.product_name}}</td>
        <td>{{order.quantity_purchased}}</td>
        <td>{{order.price_paid / order.quantity_purchased}}</td>
        <td>{{order.price_paid}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import navBar from "./userNav.vue";
import axios from "axios";
import authenticate from "../authenticate.js";
import { Buffer } from "buffer";

export default {
  name: "orderHistory",
  data() {
    return {
      orders: [],
    };
  },
  mixins: [authenticate],
  components: {
    navBar,
  },
  methods: {
    getImageBuffer(image) {
      return Buffer.from(image.data);
    },
    getImageUrl(image) {
      const blob = new Blob([this.getImageBuffer(image)]);
      return URL.createObjectURL(blob);
    },
  },
  created() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    axios.defaults.headers.common["Authorization"] = token;
    const url = `http://localhost:3030/user/orderHistory/${email}`;
    axios
      .get(url)
      .then((response) => {
        this.orders = [...response.data];
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
.main{
    width: 100vw;
}
table{
    /* align-self: center; */
    margin: 0 auto;
}
td{
    text-align: center;
    font-weight: bold;
    padding: 5px;
}
table,th,td,tr{
    border: 1px solid black;
    border-collapse: collapse;
}
td img{
    max-width: 200px;
    max-height: 200px;
}
</style>