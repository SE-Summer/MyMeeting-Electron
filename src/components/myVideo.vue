<template>
  <video :id="myId" :autoplay="srcObject"></video>
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
        console.log('[My Video]', newValue)
          document.getElementById(this.myId).srcObject = newValue
      }
    }
  }
</script>

<style scoped>

</style>
