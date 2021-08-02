<template>
  <v-app class="mymeeting-app">
    <v-app-bar app color="grey darken-4" class="white--text" dense>
      <v-app-bar-title class="appbar-title">MyMeeting</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="minimizeWin">
        <v-icon color="white">mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn icon @click="maximizeWin">
        <v-icon color="white">mdi-window-maximize</v-icon>
      </v-btn>
      <v-btn icon @click="closeWin">
        <v-icon color="white">mdi-window-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main class="main">
      <cube :account="page === 'account'" @settings="page = 'account'" @back="page = 'main'"></cube>
      <transition name="test">
        <Main v-show="page === 'main'" @join="page = 'meeting'"></Main>
      </transition>
    </v-main>

    <v-footer padless v-if="page === 'account'" color="grey darken-4" class="white--text">
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
import Main from "./components/Main";
import { ipcRenderer } from 'electron';
export default {
  name: 'App',

  components: {
    cube,
    Main
  },

  data(){
    return{
      page : 'account',
    }
  },

  methods :{
    minimizeWin(){
      ipcRenderer.send('window-min') // 通知主进程我要进行窗口最小化操作
    },
    maximizeWin(){
      ipcRenderer.send('window-max')
    },
    closeWin(){
      ipcRenderer.send('window-close')
    }
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
.main{
  background-color: #102220;
}
.appbar-title{
  -webkit-app-region: drag;
  width: 100%;
}
</style>