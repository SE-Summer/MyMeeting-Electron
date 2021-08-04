<template>
  <video id="my-video" autoplay></video>
</template>

<script>
  export default {
    name: "myVideo",
    mounted() {
        document.getElementById('my-video').srcObject = this.srcObject
    },
    props: ["srcObject"],
    watch: {
      srcObject(newValue) {
        document.getElementById('my-video').srcObject = newValue
      }
    }
  }
</script>

<style scoped>

</style>
