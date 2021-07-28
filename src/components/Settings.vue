<template>
  <div class="settings-page">
    <v-card
        class="teal lighten-5 settings-card"
        elevation="10"
        shaped
      >
      <v-container>
        <v-row>
          <v-col class="title1 teal--text">
              设 置
          </v-col>

        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn
                color="teal accent-4 white--text"
                class="mr-4"
                @click="logout"
                :loading="loading"
                :disabled="loading"
                large
            >
              退出登录
            </v-btn>
          </v-col>
          <v-col align="center">
            <v-btn
                class="mr-4"
                @click="back"
                large
            >
              返 回 >
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "Settings",
  components: {
  },
  data(){
    return{
      email : "",
      password : "",
      loading: false,
    }
  },
  methods:{
    logout(){
      this.$emit('logout');
    },
    back(){
        this.$emit('back');
    }
  }
}
</script>

<style scoped>
.title1{
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.settings-card{
  //margin-top: 20%;
  padding: 5% 10%;
  //width: 60%;
  margin: 20% 15%;
}
</style>