<template>
  <video :id="myId" :autoplay="srcObject" style="transform: rotateY(180deg)"></video>
</template>

<script>
  export default {
    name: "myVideo",
    mounted() {
        document.getElementById(this.myId).srcObject = this.srcObject
    },
    props: ["srcObject", "myId"],
    watch: {
      srcObject(newValue) {
          document.getElementById(this.myId).srcObject = newValue
      }
    }
  }
</script>

<style scoped>

</style>
