<template>
  <login-page v-if="false"></login-page>
  <main-page v-else></main-page>
</template>

<script>
import LoginPage from "./pages/loginPage";
import MainPage from "./pages/mainPage";
export default {
  name: 'App',

  components: {
    LoginPage,
    MainPage,
  },

  data: () => ({
    //
  }),
};
</script>
<style>
html::-webkit-scrollbar{
  display: none;
}

body {

}
</style>
