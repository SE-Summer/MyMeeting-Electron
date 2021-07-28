<template>
  <div class="td-cube">
    <ul :class="[{'page1': currentPage === 'Login',
         'page2': currentPage === 'Register',
         'page3': currentPage === 'Verify',
         'page4': currentPage === 'Password'}, 'ul-page']">
      <li class="front">
        <login @register="currentPage='Register'"></login>
      </li>
      <li class="back">
        <Register @back="currentPage='Login'" @next="currentPage='Verify'"></Register>
      </li>
      <li class="top">
        <Verify @back="currentPage='Register'" @ok="currentPage='Password'"></Verify>
      </li>
      <li class="bottom">
        <Password @finish="currentPage='Login'"></Password>
      </li>
      <li class="left"></li>
      <li class="right"></li>
    </ul>
  </div>
</template>

<script>
import Login from './Login'
import Register from "./Register";
import Verify from "./Verify";
import Password from "./Password";

export default {
  components:{
    Login,
    Register,
    Verify,
    Password
  },

  data() {
    return {
      pages : ['Login', 'Register', 'Verify', 'Password'],
      currentPage : 'Login',
    };
  },

  methods: {},

  created() {}
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
li {
    background-color: white;
    position: absolute;
    width: $width;
    height: $height;
    overflow: hidden;
    //border: 1px solid teal;
}
.ul-page{
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  padding: 0;
}
.ul-page.page1{
  transform: rotateY(0deg);
  transition: 1s ease-in-out;
}
.ul-page.page2{
  transform: rotateY(180deg);
  transition: 1s ease-in-out;
}
.ul-page.page3{
  transform: rotateX(-90deg) rotateY(0);
  transition: 1s ease-in-out;
}
.ul-page.page4{
  transform: rotateX(90deg) rotateY(0);
  transition: 1s ease-in-out;
}
.front {
  transform: translateZ($length / 2);
}
.back {
  transform: rotateY(180deg) translateZ($length / 2);
}
.top {
  transform: rotateX(90deg) translateZ($height / 2);
}
.bottom {
  transform: rotateX(-90deg) translateZ($height / 2);
}
.left {
  transform: rotateY(-90deg) translateZ($width / 2);
}
.right {
  transform: rotateY(90deg) translateZ($width / 2);
}
//@keyframes rotate {
//  from {
//    transform: rotateY(0);
//  }
//  to {
//    transform: rotateY(-1turn);
//  }
//}
</style>