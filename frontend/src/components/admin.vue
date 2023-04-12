<template>
  <div class="main">
    <nav-bar>
      <div>
        <input type="search" placeholder="Search Products" v-model="searchKey"/>
        <input type="button" value="Search" @click="searchProduct"/>
      </div>
    </nav-bar>
    <div class="products">
      <div
        class="card"
        v-for="product in products"
        :key="product.product_id"
        @click="
          () =>
            this.$router.push({ path: `/updateProducts/${product.product_id}` })
        "
        :class = "{'outOfStock' : product.stock === 0}"
      >
        <img
          v-if="product.product_image"
          :src="getImageUrl(product.product_image)"
          alt="Image of the product"
        />
        <div class="details">
          <div class="prodName">
            {{ product.product_name }}
          </div>
          <div class="money">
            <span class="price">{{ product.price }}</span>
            <span class="discount">{{ product.discount_per }}%</span>
            <span class="mrp">{{ product.mrp }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "./adminNav.vue";
import authenticate from "../adminAuth";
import axios from "axios";
import { Buffer } from "buffer";

export default {
  name: "homePage",
  data() {
    return {
      products: [],
      product_Image: [],
      searchKey: ''
    };
  },
  components: {
    navBar,
  },
  mixins: [authenticate],
  methods: {
    getImageBuffer(image) {
      return Buffer.from(image.data);
    },
    getImageUrl(image) {
      console.log(image.data);
      const blob = new Blob([this.getImageBuffer(image)]);
      return URL.createObjectURL(blob);
    },
    searchProduct(){
      const keyword = this.searchKey
      const token = localStorage.getItem('token')
      axios.defaults.headers.common["Authorization"] = token
      const url = `http://localhost:3030/admin/products/${keyword}`
      axios.get(url)
      .then((response) => {
        this.products = [...response.data];
      })
      .catch((err) => console.log(err));
    }
  },
  mounted() {
    const url = `http://localhost:3030/admin/productList`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        this.products = [...response.data];
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
.main {
  margin-top: 9vh;
}
.products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(50px, auto);
  gap: 14px;
  padding: 5px;
}
.card {
  /* background-color: rgb(77, 123, 125); */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2px;
  border: 2px solid grey;
  border-radius: 13px;
}
.card img {
  max-width: 200px;
  max-height: 150px;
}
.details {
  width: 100%;
  text-align: center;
  font-size: large;
}
.prodName {
  font-weight: bold;
  /* align-self: center; */
}
.money {
  font-size: larger;
  margin-top: 2px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
.discount {
  color: green;
  font-weight: bolder;
}
.mrp {
  text-decoration: line-through;
}
.outOfStock{
  border: 2px solid red;
} 
</style>