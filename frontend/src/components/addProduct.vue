<template>
  <div class="form">
    <!-- <slot></slot> -->
    <div class="closeBtn" @click="this.$router.go(-1)">X</div>
    <h3>Add New Product</h3>
    <div class="inputField">
      <label>Product Name</label>
      <input
        type="text"
        v-model="formData.product_name"
        placeholder="Product Name"
      />
    </div>
    <div class="inputField">
      <label>Product Description</label>
      <input
        type="text"
        v-model="formData.product_desc"
        placeholder="Product Description"
      />
    </div>
    <div class="prices">
      <div class="inputField">
        <label>MRP</label>
        <input
          type="number"
          v-model="formData.mrp"
          placeholder="MRP (Maximum Retail Price)"
        />
      </div>
      <div class="inputField">
        <label>Discount</label>
        <input
          type="number"
          v-model.lazy="formData.discount_per"
          placeholder="Discount Percentage"
        />
      </div>
      <div class="inputField">
        <label>Price</label>
        <input
          type="number"
          v-model="formData.price"
          placeholder="Price"
          disabled
        />
      </div>
    </div>
    <div class="inputField">
      <label>Product Image</label>
      <input type="file" @change="uploadImage()" ref="image_data"/>
      <!-- v-model="formData.product_image" -->
    </div>
    <div class="inputField">
      <label>Stock</label>
      <input type="number" v-model="formData.stock" placeholder="Stock" />
    </div>
    <div class="inputField">
      <label>Keyword 1</label>
      <input type="text" v-model="formData.keyword1" placeholder="Keyword #1" />
    </div>
    <div class="inputField">
      <label>Keyword 2</label>
      <input type="text" v-model="formData.keyword2" placeholder="Keyword #2" />
    </div>
    <div class="inputField">
      <label>Keyword 3</label>
      <input type="text" v-model="formData.keyword3" placeholder="Keyword #3" />
    </div>
    <div class="btnField">
      <button @click="resetForm">Reset</button>
      <button @click="addProduct">Submit Details</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import authenticate from "../adminAuth";

export default {
  data() {
    return {
      formData: {
        product_name: null,
        product_desc: null,
        mrp: null,
        discount_per: null,
        price: null,
        stock: null,
        keyword1: null,
        keyword2: null,
        keyword3: null,
      },
      product_image: null,
    };
  },
  mixins: [authenticate],
  watch: {
    "formData.discount_per"(newvalue) {
      console.log("Hello");
      if (this.formData.mrp) {
        this.formData.price = (this.formData.mrp * (100 - newvalue)) / 100;
      }
    },
  },
  methods: {
    uploadImage() {
      console.log(event);
      const file = event.target.files[0];
      console.log(file);
      this.product_image = file;
    },

    async addProduct() {
      const url = `http://localhost:3030/admin/addProduct`;
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      const formData = new FormData();
      formData.append("product_image", this.product_image);
      formData.append("formData", JSON.stringify(this.formData));

      axios
        .post(url, formData)
        .then((response) => {
          alert(response.data)
          this.resetForm()
          })
        .catch((err) => console.log(err));
    },

    resetForm() {
      this.product_image = null
      this.$refs.image_data.value = null

      const keys = Object.keys(this.formData);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this.formData[key] = null
      }
    },
  },
};
</script>

<style scoped>
.form {
  user-select: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: rgb(77, 123, 125);
  border-radius: 17px;
  margin: 5vh 25vw;
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
.closeBtn {
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
}
</style>