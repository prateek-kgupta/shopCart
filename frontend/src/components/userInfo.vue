<template>
  <adminNav>
    <div>
      <input type="search" placeholder="Search User" />
      <input type="button" value="Search" />
    </div>
  </adminNav>
  <div class="main">
    <table>
      <tr>
        <th>NAME</th>
        <th>EMAIL</th>
        <th>ACTIONS</th>
      </tr>
      <tr v-for="user in userList" :key="user.email">
        <td>{{ user.firstname }} {{ user.lastname }}</td>
        <td>{{ user.email }}</td>
        <td>
          <button
            @click="this.$router.push({ path: `/viewUsersOrder/${user.email}` })"
          >
            View
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import adminNav from "./adminNav.vue";
import authenticate from "../adminAuth";

export default {
  name: "viewUsers",
  data() {
    return {
      userList: [],
    };
  },
  mixins: [authenticate],
  components: {
    adminNav,
  },
  mounted() {
    const url = `http://localhost:3030/admin/get`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios.get(url).then((response) => {
      this.userList = [...response.data];
    });
  },
};
</script>

<style scoped>
.main {
  margin-top: 10vh;
}
table {
  width: 70vw;
  margin-left: 15vw;
  margin-right: 15vw;
  padding: 5px;
  background-color: rgb(77, 123, 125);
  border: 1px solid black;
  border-collapse: collapse;
  text-align: center;
  color: white;
}
th {
  color: black;
}
th,
td {
  padding: 5px;
  border: 1px solid black;
  border-collapse: collapse;
}
</style>