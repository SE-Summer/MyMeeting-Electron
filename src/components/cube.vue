<template>
  <div :class="['td-cube', {'td-cube-main': !account}]" @click="openSettings">
    <ul :class="[{'page1': currentPage === 'Login',
         'page2': currentPage === 'Register',
         'page3': currentPage === 'Verify',
         'page4': currentPage === 'Password',
         'page5': currentPage === 'Settings',
         'page6': !account, 'rot':rot}, 'ul-page']">
      <li :class="[{'main':!account}, 'front']">
        <login @register="currentPage='Register'" @login="currentPage='Settings'"></login>
      </li>
      <li :class="[{'main':!account}, 'back']">
        <Register @back="currentPage='Login'" @next="currentPage='Verify'"></Register>
      </li>
      <li :class="[{'main':!account}, 'top']">
        <Verify @back="currentPage='Register'" @ok="currentPage='Password'"></Verify>
      </li>
      <li  :class="[{'main':!account}, 'bottom']">
        <Password @finish="currentPage='Login'"></Password>
      </li>
      <li  :class="[{'main':!account}, 'left']"></li>
      <li  :class="[{'main':!account}, 'right']">
        <Settings @logout="currentPage='Login'" @back="backToMain" v-if="currentPage==='Settings'"></Settings>
      </li>
    </ul>
    <div v-if="rot">
      <p class="hint">用户设置</p>
    </div>
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
      rot : false,
    };
  },

  props:{
    account : Boolean,
  },

  methods: {
    backToMain(){
      this.$emit('back');
      setTimeout(()=>{
        this.rot = true;
      }, 1000)
    },
    openSettings(){
      if (this.rot){
        this.rot = false;
        setTimeout(()=>{
          this.$emit('settings');
        }, 200);
      }
    }
  },

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
  transition: 0.5s ease-out;
  position: absolute;
  top: 100px;
  left: 30%;
}
.td-cube.td-cube-main {
  transition: 0.5s ease-out;
  width: 200px;
  height: 200px;
  top: -30px;
  left: calc(100% - 200px);
}
.td-cube.td-cube-main:hover {
  cursor: pointer;
  transform: scale(1.15);
  transition: 0.5s ease-in-out;
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
  transition: 0.8s ease-in-out;
  padding: 0;
}
.ul-page.rot {
  transition: 0.5s ease-in-out;
  animation: rotate 12s infinite linear;
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
  //animation: rotate 8s infinite linear;
  transform: rotateY(0) rotateX(35deg) rotateZ(45deg) scaleX(0.1) scaleY(0.1) scaleZ(0.1);
}
.front {
  background-color: #ffffff;
  transform: translateZ($length / 2);
}
.front.main {
  background-image: linear-gradient(to bottom left, #00897B55, #00897Bff);
  transition: 1s ease-in-out;
  border: 4px solid #009688;
}
.back {
  background-color: #ffffff;
  transform: rotateY(180deg) translateZ($length / 2);
}
.back.main {
  background-image: linear-gradient(to bottom left, #00897B55, #00897Bff);
  transition: 1s ease-in-out;
  border: 4px solid #009688;
}
.top {
  background-color: #ffffff;
  transform: rotateX(90deg) translateZ($height / 2);
}
.top.main {
  background-image: linear-gradient(to bottom left, #00897B55, #00897Bff);
  transition: 1s ease-in-out;
  border: 4px solid #009688;
}
.bottom {
  background-color: #ffffff;
  transform: rotateX(-90deg) translateZ($height / 2);
}
.bottom.main {
  background-image: linear-gradient(to bottom left, #00897B55, #00897Bff);
  transition: 1s ease-in-out;
  border: 4px solid #009688;
}
.left {
  background-color: #ffffff;
  transform: rotateY(-90deg) translateZ($width / 2);
}
.left.main {
  background-image: linear-gradient(to bottom left, #00897B55, #00897Bff);
  transition: 1s ease-in-out;
  border: 4px solid #009688;
}
.right {
  background-color: #ffffff;
  transform: rotateY(90deg) translateZ($width / 2);
}
.right.main {
  background-image: linear-gradient(to bottom left, #00897B55, #00897Bff);
  transition: 1s ease-in-out;
  border: 4px solid #009688;
}

.hint{
  text-align: center;
  color: white;
  font-family: "Microsoft YaHei UI", serif;
  font-size: 24px;
  font-weight: bold;
}

@keyframes rotate {
 from {
   transform: rotateY(0) rotateX(35deg) rotateZ(45deg) scaleX(0.1) scaleY(0.1) scaleZ(0.1);
 }
 to {
   transform: rotateY(-1turn) rotateX(35deg) rotateZ(45deg) scaleX(0.1) scaleY(0.1) scaleZ(0.1);
 }
}
</style>