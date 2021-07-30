<template>
  <v-app class="mymeeting-app">
    <v-main>
      <cube :account="account" @settings="account=true" @back="account = false"></cube>
      <transition name="test">
        <Main v-show="!account"></Main>
      </transition>
    </v-main>

    <v-footer padless v-if="account">
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
import Main from "./components/Main"

export default {
  name: 'App',

  components: {
    cube,
    Main
  },

  data(){
    return{
      account : true,
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
.test-enter,.test-leave-to{
  opacity: 0;
}
.test-enter-to,.test-leave{
  opacity: 1;
}
.test-leave-active{
  transition: all 0.5s;
}
</style>