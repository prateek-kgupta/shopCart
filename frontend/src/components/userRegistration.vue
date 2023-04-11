<template>
  <div class="form">
    <slot></slot>
    <h3>Join <i class="appName">ShopCart</i></h3>
    <div class="inputField">
      <label>Firstname</label>
      <input type="text" v-model="formData.firstname" placeholder="Firstname" />
    </div>
    <div class="inputField">
      <label>Lastname</label>
      <input type="text" v-model="formData.lastname" placeholder="Lastname" />
    </div>
    <div class="inputField">
      <label
        >Email
        <label v-if="unavailableEmail" class="invalidInput"
          >*Email is already in use</label
        ></label
      >
      <input type="text" v-model="formData.email" placeholder="Email" />
    </div>
    <div class="inputField">
      <label>Address </label>
      <input type="text" v-model="formData.address" placeholder="Address" />
    </div>
    <div class="inputField">
      <label
        >Contact Number
        <label v-if="invalidContact" class="invalidInput"
          >*Contact Number must be of 10 digits</label
        ></label
      >
      <input
        type="text"
        v-model="formData.contact"
        placeholder="Contact Number"
      />
    </div>
    <div class="inputField">
      <label>Password</label>
      <input
        type="password"
        v-model="formData.password"
        placeholder="Password"
      />
    </div>
    <div class="inputField">
      <label
        >Retype Password
        <label v-if="unmatchedPass" class="invalidInput"
          >*Password does not match</label
        ></label
      >
      <input
        type="password"
        v-model="retypedPassword"
        placeholder="Retype Password"
      />
    </div>
    <div class="btnField">
      <button @click="resetForm">Reset</button>
      <button @click="register">Submit Details</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "userRegistration",
  data() {
    return {
      formData: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        address: "",
        contact: "",
      },
      retypedPassword: "",
      unmatchedPass: false,
      unavailableUsername: false,
      unavailableEmail: false,
      invalidContact: false,
    };
  },
  methods: {
    register() {
      let proceed = true;
      for (const key in this.formData) {
        if (!this.formData[key]) {
          proceed = false;
          alert("Each field is required");
          break;
        }
      }
      if (this.unmatchedPass) {
        proceed = false;
        alert("Password mismatch");
      }
      console.log("Proceed before post:", proceed);
      if (proceed) {
        const url = "http://localhost:3030/login/post";
        axios
          .post(url, this.formData)
          .then((response) => {
            console.log(response.data);
            if (response.data === "Insertion successfull") {
              this.resetForm();
              alert("Registered Successfully");
            } else {
              this.unavailableEmail = true;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    resetForm() {
      this.formData.firstname = "";
      this.formData.lastname = "";
      this.formData.password = "";
      this.formData.email = "";
      this.retypedPassword = "";
      this.formData.address = "";
      this.formData.contact = "";
      this.unmatchedPass = false;
      this.unavailableUsername = false;
      this.invalidContact = false;
    },
  },
  watch: {
    retypedPassword(newvalue) {
      if (newvalue !== this.formData.password) {
        this.unmatchedPass = true;
      } else {
        this.unmatchedPass = false;
      }
    },

    "formData.email"() {
      this.unavailableEmail = false;
    },
    "formData.contact"(newVal) {
      // if (newVal.lengtht === 0) {
      //   this.invalidContact = false;
      // } else {
      this.invalidContact = newVal.length !== 10;
      // }
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
  padding: 2%;
  height: 90vh;
  align-items: center;
  justify-content: space-between;
  box-shadow: 1px 14px 20px 8px rgba(40, 35, 35, 0.55);
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
  justify-content: space-evenly;
}
.invalidInput {
  color: rgb(195, 9, 9);
  font-size: 14px;
  font-weight: normal;
  font-style: italic;
}
</style>