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
            注 册
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
          <v-col align="center">
            <v-btn
                class="mr-4"
                @click="back"
                large
            >
              返 回
            </v-btn>
          </v-col>
          <v-col align="center">
            <v-btn
                color="teal accent-4 white--text"
                class="mr-4"
                @click="sendEmail"
                :loading="loading"
                :disabled="loading"
                large
            >
              {{btnText}}
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
      btnText : "发送验证邮件",
      loading : false,
      emailRules: [
        v => !!v || '请输入邮箱地址',
        v => /.+@.+\..+/.test(v) || '邮箱地址格式错误',
      ],
    }
  },
  methods:{
    back(){
      this.$emit('back');
    },
    sendEmail(){
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.btnText = '再次发送邮件';
        this.$emit('next')}, 2000);
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