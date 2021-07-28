<template>
  <div :class="['td-cube', {'td-cube-main': !account}]">
    <ul :class="[{'page1': currentPage === 'Login',
         'page2': currentPage === 'Register',
         'page3': currentPage === 'Verify',
         'page4': currentPage === 'Password',
         'page5': currentPage === 'Settings',
         'page6': currentPage === 'Main'}, 'ul-page']">
      <li :class="[{'main':currentPage === 'Main'}, 'front']">
        <login @register="currentPage='Register'" @login="currentPage='Main'" v-if="!account"></login>
      </li>
      <li :class="[{'main':currentPage === 'Main'}, 'back']">
        <Register @back="currentPage='Login'" @next="currentPage='Verify'" v-if="currentPage !== 'Main'"></Register>
      </li>
      <li :class="[{'main':currentPage === 'Main'}, 'top']">
        <Verify @back="currentPage='Register'" @ok="currentPage='Password'" v-if="currentPage !== 'Main'"></Verify>
      </li>
      <li  :class="[{'main':currentPage === 'Main'}, 'bottom']">
        <Password @finish="currentPage='Login'" v-if="currentPage !== 'Main'"></Password>
      </li>
      <li  :class="[{'main':currentPage === 'Main'}, 'left']"></li>
      <li  :class="[{'main':currentPage === 'Main'}, 'right']">
        <Settings @logout="currentPage='Login'" @back="currentPage ='Main'" v-if="currentPage !== 'Main'"></Settings>
      </li>
    </ul>
  </div>
</template>

<script>
import Login from './Login'
import Register from "./Register";
import Verify from "./Verify";
import Password from "./Password";
import Settings from "./Settings"

export default {
  components:{
    Login,
    Register,
    Verify,
    Password,
    Settings,
  },

  data() {
    return {
      pages : ['Login', 'Register', 'Verify', 'Password', 'Settings'],
      currentPage : 'Login',
    };
  },

  props:{
    account : Boolean,
  },

  methods: {},

  created() {
  }
};
</script>
<style lang="scss" scoped>
$width: 600px;
$height: 600px;
$length: 600px;
.td-cube {
  width: 600px;
  height: 600px;
  perspective: 1200px;
  position: absolute;
  top: 100px;
  left: 300px;
}
.td-cube.td-cube-main {
  transition: 1s ease-out;
  top: -200px;
  left: -200px;
}
li {
    position: absolute;
    width: $width;
    height: $height;
    overflow: hidden;
}
.ul-page{
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  padding: 0;
}
.ul-page.page1{
  transform: rotateY(0deg);
  transition: 0.8s ease-in-out;
}
.ul-page.page2{
  transform: rotateY(180deg);
  transition: 0.8s ease-in-out;
}
.ul-page.page3{
  transform: rotateX(-90deg) rotateY(0);
  transition: 0.8s ease-in-out;
}
.ul-page.page4{
  transform: rotateX(90deg) rotateY(0);
  transition: 0.8s ease-in-out;
}
.ul-page.page5{
  transform: rotateX(0) rotateY(-90deg);
  transition: 0.8s ease-in-out;
}
.ul-page.page6{
  transition: 1s ease-out;
  animation: rotate 10s infinite ease-in-out;
}
.front {
  background-color: #ffffff;
  transform: translateZ($length / 2);
}
.front.main {
  //background-color: teal;
  transition: 1s ease-in-out;
  border: 4px solid teal;
}
.back {
  background-color: #ffffff;
  transform: rotateY(180deg) translateZ($length / 2);
}
.back.main {
  //background-color: teal;
  transition: 1s ease-in-out;
  border: 4px solid teal;
}
.top {
  background-color: #ffffff;
  transform: rotateX(90deg) translateZ($height / 2);
}
.top.main {
  //background-color: teal;
  transition: 1s ease-in-out;
  border: 4px solid teal;
}
.bottom {
  background-color: #ffffff;
  transform: rotateX(-90deg) translateZ($height / 2);
}
.bottom.main {
  //background-color: teal;
  transition: 1s ease-in-out;
  border: 4px solid teal;
}
.left {
  background-color: #ffffff;
  transform: rotateY(-90deg) translateZ($width / 2);
}
.left.main {
  //background-color: teal;
  transition: 1s ease-in-out;
  border: 4px solid teal;
}
.right {
  background-color: #ffffff;
  transform: rotateY(90deg) translateZ($width / 2);
}
.right.main {
  //background-color: teal;
  transition: 1s ease-in-out;
  border: 4px solid teal;
}
@keyframes rotate {
 from {
   transform: rotateY(0) rotateX(0) rotateZ(0) scaleX(0.2) scaleY(0.2) scaleZ(0.2);
 }
 to {
   transform: rotateY(-1turn) rotateX(-1turn) rotateZ(-1turn) scaleX(0.2) scaleY(0.2) scaleZ(0.2);
 }
}
</style>