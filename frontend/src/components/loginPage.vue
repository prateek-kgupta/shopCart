<template>
  <div v-if="login" class="parent">
    <div class="card">
      <div>
        <h2>Login</h2>
        <span :class="messageClass" class="invalidInput"
          >*Invalid Credentials</span
        >
      </div>
      <input type="text" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button @click="loginAction">Login</button>
      <p>
        Don't have an account?
        <span class="signup" @click="signup">Sign Up</span>
      </p>
    </div>
  </div>
  <userRegistration v-else>
    <div class="closeBtn" @click="signup">X</div>
  </userRegistration>
</template>

<script>
import axios from "axios";
import userRegistration from "./userRegistration.vue";

export default {
  name: "loginPage",
  data() {
    return {
      email: "",
      password: "",
      user_type: "",
      messageClass: "hide",
      login: true,
    };
  },
  components: {
    userRegistration,
  },
  methods: {
    loginAction() {
      const url = `http://localhost:3030/login`;
      const formData = {
        email: this.email,
        password: this.password,
      };
      //Password Verification
      axios
        .post(url, formData)
        .then((response) => {
          response = response.data;
          console.log(response);
          if (response !== "Invalid Credentials") {
            this.user_type = response.role;
            localStorage.setItem("firstname", response.firstname);
            localStorage.setItem("lastname", response.lastname);
            localStorage.setItem("email", this.email);
            localStorage.setItem("token", response.token);
            if (this.user_type === "admin") {
              this.$router.push({ name: "admin" });
            } else {
              this.$router.push({ name: "user" });
            }
          } else {
            this.messageClass = "show";
          }
        })
        .catch((error) => console.log(error));
    },

    signup() {
      this.login = !this.login;
    },
  },
  watch: {
    username() {
      this.messageClass = "hide";
    },
    password() {
      this.messageClass = "hide";
    },
  },
};
</script>

<style scoped>
.parent {
  user-select: none;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}
div.card {
  box-sizing: border-box;
  background-color: rgb(77, 123, 125);
  padding: 2% 2%;
  border-radius: 15px;
  height: 50vh;
  width: 50vh;
  box-shadow: 1px 14px 20px 8px rgba(40, 35, 35, 0.55);
  top: 20vh;
}
input {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 10%;
  padding: 6px;
  height: 40px;
  background: none;
  border: none;
  outline: none;
  background-color: white;
  border-radius: 5px;
  font-weight: bold;
}
input::placeholder {
  font-weight: bold;
  margin-left: 4px;
}
p {
  text-align: right;
}
.signup {
  box-sizing: border-box;
  background: none;
  color: white;
  font-size: 16px;
  padding: 3px 10px;
  height: 70%;
  border: none;
  cursor: pointer;
  transition: 0.2s ease-in;
  font-weight: bold;
  border-bottom: 1px solid white;
}
.signup:hover {
  border: none;
  padding: none;
  color: blue;
  border-bottom: 1px solid blue;
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
.invalidInput {
  display: block;
  color: rgb(195, 9, 9);
  font-size: 16px;
  font-weight: normal;
  font-style: italic;
}
.show {
  background-color: none;
  color: red;
}
.hide {
  background-color: none;
  color: transparent;
}
</style>