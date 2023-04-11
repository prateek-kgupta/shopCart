<template>
  <div class="main">
    <navBar>
      <div>
        <input type="search" placeholder="Search Products" v-model="searchKey"/>
        <input type="button" value="Search"  @click="searchProduct"/>
      </div>
      </navBar>
    <div class="products">
      <div
        class="card"
        v-for="product in products"
        :key="product.product_id"
        @click="() => this.$router.push({path: `/productDetail/${product.product_id}`})"        
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
            <span class="discount">{{ product.discount_per }}% Off</span>
            <span class="mrp">{{ product.mrp }}</span>
          </div>
          <!-- <button class="btn2" @click="() => this.$router.push({path: `/productDetail/${product.product_id}`})">View Details</button> -->
        </div>
        </div>          
    </div>
  </div>
</template>

<script>
import navBar from "./userNav.vue";
import axios from "axios";
import authenticate from "../authenticate.js";
import { Buffer } from "buffer";

export default {
  name: "homePage",
  data() {
    return {
      products: [],
      searchKey: '',
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
    searchProduct(){
      const keyword = this.searchKey
      const token = localStorage.getItem('token')
      axios.defaults.headers.common["Authorization"] = token
      const url = `http://localhost:3030/user/products/${keyword}`
      axios.get(url)
      .then((response) => {
        this.products = [...response.data];
      })
      .catch((err) => console.log(err));
    }
  },
  mounted() {
    const url = `http://localhost:3030/user/products`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get(url)
      .then((response) => {
        this.products = [...response.data];
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
/* .product_area {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: minmax(50px, auto);
} */
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
}
.money {
  font-size: large;
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
/* .btn{
  color: black;
  border: 2px solid black;
  width: 80%;
}
.btn:hover{
  color: white;
  background-color: black;
} */
</style>