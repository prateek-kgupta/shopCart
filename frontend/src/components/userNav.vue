<template>
  <div class="mHead">
    <h3 class="appName" @click="() => this.$router.push({name: 'user'})"><i>ShopCart</i></h3>
    <slot></slot>
    <p class="userInfo">{{ firstname }} {{ lastname }}</p>
    <p class="roles" @click="() => this.$router.push({name: 'orderHistory'})">Order History</p>
    <p class="roles" @click="this.$router.push({name: 'userCart'})">Cart</p>
    <button @click="logOut()" class="btn">Log Out</button>
  </div>
</template>

<script>
export default {
  name: "headBar",
  data() {
    return {
      firstname: "",
      lastname: "",
    };
  },
  methods: {
    logOut() {
      localStorage.clear();
      this.$router.push({ name: "loginPage" });
    },
  },
  mounted() {
    this.firstname = localStorage.getItem("firstname");
    this.lastname = localStorage.getItem("lastname");
  },
};
</script>

<style scoped>
.mHead {
  user-select: none;
  box-sizing: border-box;
  height: 8vh;
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(77, 123, 125);
  padding: 5px 20px;
}
.userInfo {
  color: white;
  font-size: 22px;
  font-weight: bold;
  border-bottom: 2px solid white;
}
/* .appName {
  color: white;
  font-size: 24px;
  font-family: Century Gothic;
  font-weight: bolder;
} */
</style>