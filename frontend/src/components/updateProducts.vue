<template>
  <div class="main">
    <navBar/>
    <div class="image">
    <img :src="getImageUrl(product.product_image)" alt="Image of the product">
    <input type="file" @change="uploadImage()"/>
    </div>
    <div class="inputField">
      <label>Product Name</label>
      <input
        type="text"
        v-model="product.product_name"
        placeholder="Product Name"
      />
    </div>
    <div class="inputField">
      <label>Product Description</label>
      <input
        type="text"
        v-model="product.product_desc"
        placeholder="Product Description"
      />
    </div>
    <div class="prices">
      <div class="inputField">
        <label>MRP</label>
        <input
          type="number"
          v-model="product.mrp"
          placeholder="MRP (Maximum Retail Price)"
        />
      </div>
      <div class="inputField">
        <label>Discount</label>
        <input
          type="number"
          v-model.lazy="product.discount_per"
          placeholder="Discount Percentage"
        />
      </div>
      <div class="inputField">
        <label>Price</label>
        <input
          type="number"
          v-model="product.price" placeholder="Price"
          disabled
        />
      </div>
    </div>
    <!-- <div class="inputField">
      <label>Product Image</label>
      <input type="file" @change="uploadImage()" ref="image_data"/>
    </div> -->
    <div class="stock">
    <div class="inputField">
      <label>Stock</label><br>
      <input type="number" v-model="product.stock" placeholder="Stock" />
    </div>
    <button class="btn3">Order Stocks</button>
    </div>
    <div class="inputField">
      <label>Keyword 1</label>
      <input type="text" v-model="product.keyword1" placeholder="Keyword #1" />
    </div>
    <div class="inputField">
      <label>Keyword 2</label>
      <input type="text" v-model="product.keyword2" placeholder="Keyword #2" />
    </div>
    <div class="inputField">
      <label>Keyword 3</label>
      <input type="text" v-model="product.keyword3" placeholder="Keyword #3" />
    </div>
    <div class="btnField">
      <button @click="updateProduct">Update Product</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import authenticate from "../adminAuth";
import navBar from './adminNav.vue'
import { Buffer } from "buffer";

export default {
  name: "updateProducts",
  data() {
    return {
      product_id: null,
      product: [],
    };
  },
  components:{
    navBar,
  },
  mixins: [authenticate],
  methods:{
    getImageBuffer(image) {
      return Buffer.from(image.data);
    },
    getImageUrl(image) {
      const blob = new Blob([this.getImageBuffer(image)]);
      return URL.createObjectURL(blob);
    },
    uploadImage() {
      const file = event.target.files[0];
      this.product.product_image = file;
    },
    async updateProduct() {
      const url = `http://localhost:3030/admin/updateProduct`;
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      const formData = new FormData();
      formData.append("product_image", this.product.product_image);
      formData.append("formData", JSON.stringify(this.product));

      axios
        .put(url, formData)
        .then((response) => {
          alert(response.data)
          if(response.data === "Update Successfull"){
            location.reload()
          }
          })
        .catch((err) => console.log(err));
    },
  },
  created() {
    this.product_id = this.$route.params.product_id;
    const url = `http://localhost:3030/admin/productDetail/${this.product_id}`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        this.product = response.data;
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
.main {
  user-select: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: rgb(77, 123, 125);
  border-radius: 17px;
  margin-left:  25vw;
  margin-right:  25vw;
  padding: 1.5%;
  min-height: 90vh;
  align-items: center;
  justify-content: space-around;
  box-shadow: 1px 14px 20px 8px rgba(40, 35, 35, 0.55);
}
.prices {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(40px, auto);
  column-gap: 4px;
}
input {
  box-sizing: border-box;
  width: 100%;
  padding: 6px;
  height: 40px;
  background: none;
  border: none;
  outline: none;
  background-color: white;
  border-radius: 5px;
  font-weight: bold;
  margin-top: 2px;
}

input::placeholder {
  font-weight: bold;
  margin-left: 4px;
}
.inputField {
  width: 100%;
}
/* .prices .inputField{
  width: 80%;
}
.prices input{
  margin: 4px;
} */
label {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-weight: bold;
  color: rgb(28, 25, 25);
}
h3 {
  font-size: 24px;
}
.btnField {
  display: flex;
  width: 100%;
  margin-top: 4px;
  justify-content: space-evenly;
}
.image{
  display: flex;
  flex-direction: column;
}
.stock{
  display: flex;
  width: 100%;
  align-items: flex-end;
  /* justify-content: space-between; */
  /* justify-content: baseline; */
}
.stock input{
  width: 70%;
}
.btn3{
  width: 20%;
}
/* .closeBtn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 6vh;
  right: 25.5vw;
  padding: 0;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: white;
  font-weight: bold;
  color: rgb(195, 9, 9);
}
.closeBtn:hover {
  color: white;
  background-color: rgb(195, 9, 9);
} */
</style>