<template>
  <div class="main">
    <navBar />
    <div class="empty" v-if="cart_empty">
      <h1 style="color: red">NO ITEMS PRESENT IN THE CART</h1>
    </div>
    <template v-else>
      <div class="card" v-for="product in products" :key="product.product_id">
        <img
          v-if="product.product_image"
          :src="getImageUrl(product.product_image)"
          alt="Image of the product"
          @click="
            () =>
              this.$router.push({
                path: `/productDetail/${product.product_id}`,
              })
          "
        />
        <div class="details">
          <div class="prodName">
            {{ product.product_name }}
          </div>
          <div class="quantity">
            <div class="sign" @click="updateQuantity(product, 0)">-</div>
            <div>
              {{ product.quantity }}
            </div>
            <div class="sign" @click="updateQuantity(product, 1)">+</div>
          </div>
          <div class="price">Price: {{ product.price }}</div>
          <div class="amount">
            Amount: {{ (product.price * product.quantity).toFixed(2) }}
          </div>
          <button
            class="btn2"
            @click="removeItem(product.item_id)"
            :disabled="updateBox"
          >
            Remove Item
          </button>
        </div>
      </div>
      <h3>Total Amount: {{ total.toFixed(2) }}</h3>
      <div class="contacts">
        <p>
          <u>Address:</u> <span class="deliv">{{ address }}</span>
        </p>
        <p>
          <u>Contact:</u> <span class="deliv">{{ contact }}</span>
        </p>
        <button @click="() => (updateBox = true)" :disabled="updateBox">
          Update Delivery Details
        </button>
      </div>
      <button class="btn2" @click="buyProducts" :disabled="updateBox">
        Buy Now
      </button>
    </template>
    <div class="updateContact" v-show="updateBox">
      <div class="inputField">
        <label>Address </label>
        <input type="text" v-model="address" placeholder="Address" />
      </div>
      <div class="inputField">
        <label
          >Contact Number
          <label v-if="invalidContact" class="invalidInput"
            >*Contact Number must be of 10 digits</label
          ></label
        >
        <input type="text" v-model="contact" placeholder="Contact Number" />
      </div>
      <button @click="updateDetails">Update</button>
    </div>
  </div>
</template>

<script>
import navBar from "./userNav.vue";
import axios from "axios";
import authenticate from "../authenticate.js";
import { Buffer } from "buffer";
export default {
  name: "userCart",
  data() {
    return {
      products: [],
      total: 0,
      cart_empty: false,
      address: "",
      contact: "",
      updateBox: false,
      invalidContact: false,
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
      const blob = new Blob([this.getImageBuffer(image)]);
      return URL.createObjectURL(blob);
    },
    updateQuantity(product, sign) {
      let change = false;
      if (sign === 1) {
        product.quantity += 1;
        change = true;
      } else {
        if (product.quantity !== 1) {
          product.quantity -= 1;
          change = true;
        }
      }
      if (change) {
        this.calcTotal();
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        const url = `http://localhost:3030/user/alterQuantity`;
        const formData = {
          quantity: product.quantity,
          item_id: product.item_id,
        };
        axios
          .put(url, formData)
          .then((response) => console.log(response.data))
          .catch((err) => console.log(err));
      }
    },

    calcTotal() {
      let total = 0;
      for (let i = 0; i < this.products.length; i++) {
        let product = this.products[i];
        total += parseFloat(product.price) * product.quantity;
      }
      this.total = total;
    },
    buyProducts() {
      const email = localStorage.getItem("email");
      const url = `http://localhost:3030/user/checkout/${email}`;
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .post(url, this.products)
        .then((response) => {
          this.products = null;
          this.total = 0;
          this.cart_empty = true;
          alert(response.data);
        })
        .catch((err) => console.log(err));
    },
    removeItem(item_id) {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      const url = `http://localhost:3030/user/removeItem/${item_id}`;
      axios
        .delete(url)
        .then((response) => {
          console.log(response.data);
          this.products = this.products.filter((t) => t.item_id !== item_id);
          this.calcTotal()
          if(this.products.length === 0){
            this.cart_empty = true
          }
        })
        .catch((err) => console.log(err));
    },
    updateDetails() {
      this.updateBox = false;
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      axios.defaults.headers.common["Authorization"] = token;
      const url = `http://localhost:3030/user/updateDetails/${email}`;
      axios
        .put(url, {
          address: this.address,
          contact: this.contact,
        })
        .then((response) => console.log(response.data))
        .catch((err) => console.log(err.message));
    },
  },
  mounted() {
    const email = localStorage.getItem("email");
    const url = `http://localhost:3030/user/cart/${email}`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get(url)
      .then((response) => {
        this.products = [...response.data];
        if (this.products.length === 0) {
          this.cart_empty = true;
        } else {
          this.contact = this.products[0].contact;
          this.address = this.products[0].address;
        }
        this.calcTotal();
      })
      .catch((err) => console.log(err));
  },
  watch: {
    contact(newVal) {
      this.invalidContact = newVal.length !== 10;
    },
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 30vh;
  margin-right: 30vh;
}
.card {
  /* width:70vh; */
  width: 100%;
  border: 2px solid black;
  border-radius: 13px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 5px;
}
.quantity {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.sign {
  user-select: none;
  cursor: pointer;
  border-radius: 50%;
  background-color: black;
  color: white;
  width: 20px;
  height: 20px;
  display: flex;
  align-self: center;
  justify-content: center;
}
.details {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.btn2 {
  width: 100%;
}
.contacts {
  width: 97%;
  border-radius: 13px;
  padding: 14px;
  background-color: rgb(64, 112, 242);
  margin: 4px;
  color: white;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px;
}
.contacts p {
  font-weight: bold;
  font-size: larger;
  text-align: left;
  width: 30%;
  margin: 4px;
  word-wrap: break-word;
  /* text-decoration: underline; */
}
.deliv {
  font-weight: normal;
  /* text-decoration: line-through; */
}

.updateContact {
  position: absolute;
  user-select: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: rgb(77, 123, 125);
  border-radius: 17px;
  margin: 5vh 25vw;
  padding: 2%;
  min-height: 250px;
  top: 25vh;
  /* height: 90vh; */
  align-items: center;
  justify-content: space-around;
  box-shadow: 1px 14px 20px 8px rgba(40, 35, 35, 0.55);
}
.updateContact input {
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
.updateContact input::placeholder {
  font-weight: bold;
  margin-left: 4px;
}
.updateContact .inputField {
  width: 100%;
}
.updateContact label {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-weight: bold;
  color: rgb(28, 25, 25);
}
.updateContact .invalidInput {
  color: rgb(195, 9, 9);
  font-size: 14px;
  font-weight: normal;
  font-style: italic;
}
</style>