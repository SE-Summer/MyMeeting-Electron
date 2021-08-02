<template>
  <div class="settings-page">
    <v-card
        class="teal lighten-5 settings-card"
        elevation="10"
      >
      <v-container>
        <v-row>
          <v-col class="title1 teal--text">
              用 户
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-avatar
                size="100px"
                class="teal lighten-4"
            >
              <v-icon
              size="64px">
                mdi-account
              </v-icon>
            </v-avatar>
          </v-col>
          <v-col>
            <p class="nickname">{{GLOBAL.userinfo.nickname}}</p>
            <p class="userid">ID: {{GLOBAL.userinfo.id}}</p>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col align="center" class="title2" cols="7">
            麦克风默认开启
          </v-col>
          <v-col align="center">
            <v-switch
                v-model="microphone"
                label=""
                color="teal"
                hide-details
            ></v-switch>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col align="center" class="title2" cols="7">
            摄像头默认开启
          </v-col>
          <v-col align="center">
            <v-switch
                v-model="camera"
                label=""
                color="teal"
                hide-details
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn
                color="red accent-4 white--text"
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
                class="mr-4 teal white--text"
                @click="back"
                large
            >
              会 议 >
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
      loading: false
    }
  },
  methods:{
    logout(){
      this.$emit('logout');
    },
    back(){
      this.$emit('back');
    }
  },
}
</script>

<style scoped>
.title1{
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.title2{
  font-size: 22px;
  text-align: center;
  margin: 16px;
}
.settings-card{
  //margin-top: 20%;
  padding: 5% 5%;
  //width: 60%;
  margin: 15% 10%;
}
.userid{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 16px;
  text-align: left;
  margin-top: 5px;
}
.nickname{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 40px;
  text-align: left;
  margin-bottom: 10px;
}
</style>