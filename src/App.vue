<template>
  <v-app class="mymeeting-app">

    <v-main>
      <cube @click="account = true" @back="account = false" account="account"></cube>
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

  data(){
    return{
      accont : true,
    }
  },

  methods :{

  }
};
</script>
<style>
html::-webkit-scrollbar{
  display: none;
}
</style>