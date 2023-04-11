<template>
<router-view />
</template>

<script>

export default {
  name: 'App',

}
</script>

<style>
.main{
  margin-top: 9vh
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
button {
  padding: 10px 20px;
  border-radius: 100px;
  border: 2px solid white;
  color: white;
  background: none;
  outline: none;
  cursor: pointer;
  transition: 0.3s ease-in;
}
button:hover {
  background-color: white;
  color: black;
  font-weight: bold;
}
.appName {
  color: white;
  font-size: 24px;
  font-family: Century Gothic;
  font-weight: bolder;
}
.roles{
  color: rgb(241, 240, 240);
  font-weight: bold;
  font-size: large;
}
.roles:hover{
  color: white;
  text-decoration: underline;
}
.btn2{
  color: black;
  border: 2px solid black;
  width: 80%;
}
.btn2:hover{
  color: white;
  background-color: black;
}
</style>
