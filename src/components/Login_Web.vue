<template>
  <div class="login-page">
    <v-snackbar
        top
        color="teal lighten-1 white--text"
        timeout="1600"
        light
        v-model="snack">
      {{snackText}}
    </v-snackbar>
    <div class="login-card">
      <v-form
          ref="form"
          v-model="valid">
        <v-container>
          <v-row>
            <v-col class="title1 white--text">
              登 录
            </v-col>
          </v-row>
          <v-row>
            <v-text-field
                v-model="email"
                append-icon="mdi-email"
                :rules="emailRules"
                label="邮箱"
                background-color="transparent"
                required
                color="white"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
                v-model="password"
                :rules="passwordRules"
                append-icon="mdi-dialpad"
                label="密码"
                type="password"
                background-color="transparent"
                required
                color="white"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-col align="center">
              <v-btn
                  color="white"
                  @click="login"
                  :loading="loading"
                  :disabled="loading || !valid"
              >
                登录
              </v-btn>
            </v-col>
            <v-col align="center">
              <v-btn
                  class="mr-4"
                  @click="register"
              >
                注册
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "Login",
  components: {
  },
  data(){
    return{
      email : "jz2000@sjtu.edu.cn",
      password : "",
      loading : false,
      snackText: "",
      snack : false,
      valid : true,
      emailRules: [
        v => !!v || '请输入邮箱地址',
        v => /.+@.+\..+/.test(v) || '邮箱地址格式错误',
      ],
      passwordRules: [
        v => !!v || '请输入密码',
        v => /^[a-zA-Z0-9_]{6,18}$/.test(v) || '密码是六到十八位字母、数字或下划线',
      ],
    }
  },
  methods:{
    register(){
      this.$emit('register');
    },
    async login(){
      this.loading = true;
      try{
        const response =await axios(
            {
              method : 'post',
              url : this.GLOBAL.baseURL + '/login',
              data : {
                'email' : this.email,
                'password' : this.password,
              }
            })
        this.GLOBAL.userInfo = response.data.user;
        this.snackText = '登录成功';
        this.snack = true;
        this.loading = false;
        console.log(response);
        setTimeout(()=>{this.$emit('login');},200)
      }catch(error){
        if (error.response){
          this.snackText = error.response.data.error;
        }
        else{
          this.snackText = '无法连接至服务器'
        }
        this.snack = true;
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.title1{
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
}

.login-card{
  padding: 0 8%;
  width: calc(300px + 10vw);
  position: absolute;
  z-index: 2;
  bottom: calc(60vh - 220px);
  left: calc(45vw - 150px);
  background-position-y: 20px;
  background-image: linear-gradient(to bottom, #26A69A00, #26A69Add);
  border-bottom: 5px solid #A7FFEB;
}

</style>