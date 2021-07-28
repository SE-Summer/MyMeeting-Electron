<template>
  <div class="login-page">
    <v-card
        class="teal lighten-5 register-card"
        shaped
        elevation="10"
    >
      <v-container>
        <v-row>
          <v-col class="title1 teal--text">
            设 定
          </v-col>
        </v-row>
        <v-row>
          <v-text-field
              v-model="password"
              append-icon="mdi-dialpad"
              label="密码"
              :rules="passwordRules"
              background-color="teal lighten-5"
              clearable
              required
              color="teal darken-1"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
              v-model="password2"
              append-icon="mdi-dialpad"
              label="再次输入密码"
              :rules="passwordRules"
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
                @click="setPassword"
                :loading="loading"
                :disabled="loading"
                large
            >
              确 认
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
      loading : false,
      password: "",
      password2 : "",
      passwordRules: [
        v => !!v || '请输入密码',
        v => /^[a-zA-Z0-9_]{6,18}$/.test(v) || '密码是六到十八位字母、数字或下划线',
      ],
    }
  },
  methods:{
    setPassword(){
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$emit('finish');
      }, 2000);
    },
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
.register-card{
//margin-top: 20%;
  padding: 5% 10%;
//width: 60%;
  margin: 20% 15%;
}
</style>