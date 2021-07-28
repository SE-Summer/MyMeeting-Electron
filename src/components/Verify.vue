<template>
  <div class="verify-page">
    <v-card
        class="teal lighten-5 register-card"
        shaped
        elevation="10"
    >
      <v-container>
        <v-row>
          <v-col class="title1 teal--text">
            验 证
          </v-col>

        </v-row>
        <v-row>
          <v-text-field
              v-model="email"
              append-icon="mdi-dialpad"
              label="验证码"
              counter="6"
              :rules="verifyRules"
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
                @click="verify"
                :loading="loading"
                :disabled="loading"
                large
            >
              验 证
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
      verifyRules: [
        v => !!v || '请输入验证码',
        v => /^[A-Z0-9]{6}$/.test(v) || '验证码是六位大写字母或数字',
      ],
    }
  },
  methods:{
    back(){
      this.$emit('back');
    },
    verify(){
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$emit('ok');}, 2000);
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