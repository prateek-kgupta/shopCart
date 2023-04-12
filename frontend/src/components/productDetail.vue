<template>
  <div class="main">
    <userNav/>
    <div class="product_view">
      <div class="image">
        <img
          v-if="product.product_image"
          :src="getImageUrl(product.product_image)"
          alt="Product Image"
        />
      </div>
      <div class="details">
        <div>
          <p class="name">{{ product.product_name }}</p>
          <p class="desc">{{ product.product_desc }}</p>
        </div>
        <p class="money">
          <span class="price">{{ product.price }}</span>
          <span class="discount">{{ product.discount_per }}% Off</span>
          <span class="mrp">{{ product.mrp }}</span>
        </p>
        <button class="btn2" @click="addToCart(product.product_id)">Add to Cart</button>
      </div>
    </div>
    <div class="related">
      <h2>Related Products:</h2>
      <div class="products">
        <div
          class="card"
          v-for="product in relatives"
          :key="product.product_id"
          @click="updatePage(product.product_id)"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import userNav from "./userNav.vue";
import authenticate from "../authenticate.js";
import { Buffer } from "buffer";

export default {
  name: "productDetail",
  data() {
    return {
      product_id: "",
      product: null,
      relatives: [],
    };
  },
  mixins: [authenticate],
  components: {
    userNav,
  },
  methods: {
    getImageBuffer(image) {
      return Buffer.from(image.data);
    },
    getImageUrl(image) {
      const blob = new Blob([this.getImageBuffer(image)]);
      return URL.createObjectURL(blob);
    },
    updatePage(product_id) {
      this.$router.push({ path: `/productDetail/${product_id}` });
    },
    addToCart(id){
      const token = localStorage.getItem('token')
      axios.defaults.headers.common["Authorization"] = token;
      const url = `http://localhost:3030/user/addToCart`
      const formData = {
        product_id: id,
        email: localStorage.getItem('email')
      }
      axios.post(url, formData)
      .then(response => alert(response.data))
      .catch(err => console.log(err))
    }
  },
  created() {
    this.product_id = this.$route.params.product_id;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    let url = `http://localhost:3030/user/prodInfo/${this.product_id}`;
    axios
      .get(url)
      .then((response) => {
        this.product = response.data[0];
        console.log(this.product);
      })
      .catch((err) => console.log(err));
  },
  mounted() {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const url = `http://localhost:3030/user/relatedItems`;
    console.log("Mounted");
    const keywords = {
      key1: this.product.keyword1.toLowerCase(),
      key2: this.product.keyword2.toLowerCase(),
      key3: this.product.keyword3.toLowerCase(),
      id: this.product.product_id
    };
    axios
      .post(url, keywords)
      .then((response) => {
        this.relatives = [...response.data];
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
.product_view {
  box-sizing: border-box;
  display: flex;
  width: 100vw;
  align-items: center;
  justify-content: space-between;
  min-height: 400px;
  padding: 10px;
}
.product_view img {
  max-height: 500px;
}
.details {
  display: flex;
  flex-direction: column;
  width: 50%;
  justify-content: space-around;
}
.image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
}
.name {
  font-size: xx-large;
  font-weight: bolder;
}
.desc {
  font-size: x-large;
}
.money {
  font-size: xx-large;
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
.btn2 {
  align-self: center;
}
.products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(50px, auto);
  gap: 14px;
  padding: 5px;
}
.card {
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
.related .money {
  font-size: large;
  margin-top: 2px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
.related .discount {
  color: green;
  font-weight: bolder;
}
.related .mrp {
  text-decoration: line-through;
}
</style>