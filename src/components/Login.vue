<template>
  <div class="login-page">
    <v-card
        class="teal lighten-5 login-card"
        elevation="10"
        shaped
      >
      <v-container>
        <v-row>
          <v-col class="title1 teal--text">
              登 录
          </v-col>

        </v-row>
        <v-row>
          <v-text-field
              v-model="email"
              append-icon="mdi-email"
              :rules="emailRules"
              label="邮箱"
              background-color="teal lighten-5"
              clearable
              required
              color="teal darken-1"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
              v-model="password"
              :rules="passwordRules"
              append-icon="mdi-dialpad"
              label="密码"
              type="password"
              background-color="teal lighten-5"
              clearable
              required
              color="teal darken-1"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn
                color="teal accent-4 white--text"
                class="mr-4"
                @click="login"
                :loading="loading"
                :disabled="loading"
                large
            >
              登 录
            </v-btn>
          </v-col>
          <v-col align="center">
            <v-btn
                class="mr-4"
                @click="register"
                large
            >
              注 册 >
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "Login",
  components: {
  },
  data(){
    return{
      email : "",
      password : "",
      loading : false,
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
    login(){
      this.loading = true;
      fetch('http://se-summer.cn:4446/login',
       {
         mode : 'no-cors',
         method : 'POST',
         body : {
           'email': this.email,
           'password': this.password,
         }
       }).then(
         (response)=>{
           console.log(response);
          if(response.status === 401){
            alert(response.body.error);
          }else if(response.status === 200){
            alert(response.body);
            this.$emit('logined');
          }else{
            alert("Unknown Error");
          }
          this.loading = false
         }
       )
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

.login-card{
  //margin-top: 20%;
  padding: 5% 10%;
  //width: 60%;
  margin: 20% 15%;
}
</style>