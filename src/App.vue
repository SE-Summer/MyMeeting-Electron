<template>
  <v-app class="mymeeting-app">

    <v-main>
      <cube></cube>
    </v-main>

    <v-footer padless>
      <v-col
          class="text-center"
          cols="12"
      >
       - {{ new Date().getFullYear() }} — <strong>MyMeeting® </strong>-
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import cube from "./components/cube";

export default {
  name: 'App',

  components: {
    cube,
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
</style>