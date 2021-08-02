<template>
  <div class="main-page">
    <v-snackbar
        top
        color="teal lighten-1 white--text"
        timeout="1600"
        light
        v-model="snack">
      {{snackText}}
    </v-snackbar>
    <div class="teal-cover">
      <h1 class="title1 white--text" :class="[{'active':click1||click2||click3}]">
        开始你的视频会议
      </h1>
      <h1 class="title2 white--text" :class="[{'active':click1||click2||click3}]">
        MyMeeting — 见我想见的人
      </h1>
      <v-container :class="['cards-container', {'active':click1||click2||click3}]">
        <v-row>
          <v-col align="center" v-show="click1||(!click1&&!click2&&!click3)">
            <v-card
                class="teal lighten-4 function-card"
                :class="[{'active':click1||click2||click3}]"
                elevation="10"
                :loading="loading"
                :disabled="loading"
                color="teal"
                @mouseenter="hover1=true" @mouseleave="hover1=false"
            >
              <v-icon
                  color="#004D4099" size="60px" class="close" v-show="click1" @click.stop="click1=false">
                mdi-close
              </v-icon>
              <v-icon
                  color="teal accent-4" size="160px" :class="['arrow',{'pos1':hover1, 'pos2':click1}]" :disabled="!valid1 || loading" @click="sendReq">
                mdi-arrow-right-thick
              </v-icon>
              <p class="card-title teal--text text--darken-4" @click="click1=true">
                快速入会
              </p>
              <p class="card-text teal--text text--darken-4">
                使用会议号和密码，加入一场现有的会议
              </p>
              <v-form v-model="valid1" ref="form">
                  <v-container v-if="click1">
                    <v-row dense>
                      <v-col>
                        <v-text-field
                            v-model="roomId"
                            height="60px"
                            outlined
                            :rules="idRules"
                            append-icon="mdi-email"
                            label="会议号"
                            color="teal darken-1"
                            required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col>
                        <v-text-field
                            v-model="password"
                            outlined
                            height="60px"
                            type="password"
                            :rules="passwordRules"
                            append-icon="mdi-dialpad"
                            label="密码"
                            color="teal darken-1"
                            required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
            </v-card>
          </v-col>
          <v-col align="center" v-show="click2||(!click1&&!click2&&!click3)">
            <v-card
                class="teal lighten-4 function-card"
                :class="[{'active':click1||click2||click3}]"
                elevation="10"
                :loading="loading"
                :disabled="loading"
                @mouseenter="hover2=true" @mouseleave="hover2=false"
            >
              <v-icon
                  color="#004D4099" size="60px" class="close" v-show="click2" @click.stop="click2=false">
                mdi-close
              </v-icon>
              <v-icon
                  color="teal accent-4" size="160px" :class="['arrow',{'pos1':hover2, 'pos2':click2}]" :disabled="!valid2 || loading" @click="sendReq">
                mdi-arrow-right-thick
              </v-icon>
              <p class="card-title teal--text text--darken-4" @click="click2=true">
                创建会议
              </p>
              <p class="card-text teal--text text--darken-4">
                作为主持人，立即开始一次会议
              </p>
              <v-form v-model="valid2" ref="form">
                <v-container v-if="click2">
                  <v-row dense>
                    <v-col>
                      <v-text-field
                          v-model="topic"
                          height="60px"
                          outlined
                          :rules="topicRules"
                          append-icon="mdi-format-title"
                          label="会议主题"
                          color="teal darken-1"
                          required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-text-field
                          v-model="password"
                          outlined
                          height="60px"
                          type="password"
                          :rules="passwordRules"
                          append-icon="mdi-dialpad"
                          label="设置密码"
                          color="teal darken-1"
                          required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
          <v-col align="center" v-show="click3||(!click1&&!click2&&!click3)">
            <v-card
                class="teal lighten-4 function-card"
                :class="[{'active':click1||click2||click3}]"
                elevation="10"
                :loading="loading"
                :disabled="loading"
                @mouseenter="hover3=true" @mouseleave="hover3=false"
            >
              <v-overlay
                  v-show="selecting_start_time || selecting_end_time || selecting_end_date || selecting_start_date">
                <v-icon @click="selecting_start_date = selecting_start_time = selecting_end_time = selecting_end_date = false" class="close-picker"> mdi-close</v-icon>
                <v-date-picker
                    v-show="selecting_start_date"
                    v-model="start_date"
                    class="mt-4"
                    elevation="8"
                    color="teal"
                    light
                    :min="start_date"
                ></v-date-picker>
                <v-time-picker
                    v-show="selecting_start_time"
                    v-model="start_time"
                    class="mt-4"
                    light
                    elevation="8"
                    format="24hr"
                    color="teal"
                    scrollable
                    :min="start_time"
                ></v-time-picker>
                <v-date-picker
                    v-show="selecting_end_date"
                    v-model="end_date"
                    class="mt-4"
                    elevation="8"
                    color="teal"
                    light
                    :min="start_date"
                ></v-date-picker>
                <v-time-picker
                    v-show="selecting_end_time"
                    v-model="end_time"
                    class="mt-4"
                    light
                    elevation="8"
                    format="24hr"
                    color="teal"
                    scrollable
                    :min="start_time"
                ></v-time-picker>
              </v-overlay>
              <v-icon
                  color="#004D4099" size="60px" class="close" v-show="click3" @click.stop="click3=false">
                mdi-close
              </v-icon>
              <v-icon
                  color="teal accent-4" size="160px" :class="['arrow',{'pos1':hover3, 'pos2':click3}]"  :disabled="!valid3||loading" @click="sendReq">
                mdi-arrow-right-thick
              </v-icon>
              <p class="card-title teal--text text--darken-4" @click="click3=true">
                预约会议
              </p>
              <p class="card-text teal--text text--darken-4">
                作为主持人，预约未来某时刻的会议
              </p>
              <v-form v-model="valid3" ref="form">
                <v-container v-if="click3">
                  <v-row dense>
                    <v-col>
                      <v-text-field
                          v-model="topic"
                          :rules="topicRules"
                          height="50px"
                          outlined
                          append-icon="mdi-format-title"
                          label="会议主题"
                          color="teal darken-1"
                          required
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                          v-model="max_num"
                          height="50px"
                          outlined
                          append-icon="mdi-numeric"
                          label="最大人数"
                          color="teal darken-1"
                          required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                    <v-text-field
                      v-model="password"
                      outlined
                      height="50px"
                      type="password"
                      :rules="passwordRules"
                      append-icon="mdi-dialpad"
                      label="设置密码"
                      color="teal darken-1"
                      required
                    ></v-text-field></v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-text-field
                          v-model="start_date"
                          outlined
                          height="50px"
                          append-icon="mdi-calendar-range"
                          label="开始日期"
                          color="teal darken-1"
                          required
                          @focusin="selecting_start_date = true"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                          v-model="start_time"
                          outlined
                          height="50px"
                          append-icon="mdi-clock-time-four-outline"
                          label="开始时间"
                          color="teal darken-1"
                          required
                          @focusin="selecting_start_time = true"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-text-field
                          v-model="end_date"
                          height="50px"
                          outlined
                          append-icon="mdi-calendar"
                          label="结束日期"
                          color="teal darken-1"
                          required
                          @focusin="selecting_end_date = true"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                          v-model="end_time"
                          height="50px"
                          outlined
                          append-icon="mdi-clock-time-five-outline"
                          label="结束时间"
                          color="teal darken-1"
                          required
                          @focusin="selecting_end_time = true"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "Main",
  components: {
  },
  data(){
    return{
      hover1 : false,
      click1 : false,
      hover2 : false,
      click2 : false,
      hover3 : false,
      click3 : false,
      loading : false,
      snack : false,
      valid1 : false,
      valid2 : false,
      valid3 : false,
      snackText : "",
      roomId : "",
      password : "",
      topic : "",
      start_time :  moment().format("HH:mm"),
      end_time : moment().add(2, 'h').format("HH:mm"),
      start_date : moment().format("YYYY-MM-DD"),
      end_date :  moment().format("YYYY-MM-DD"),
      max_num : 10,
      topicRules: [
        v => !!v || '请输入会议主题',
      ],
      idRules :[
        v => !!v || '请输入会议号',
      ],
      passwordRules: [
        v => /^[0-9]{8}$/.test(v) || '密码是八位数字',
      ],
      selecting_start_time: false,
      selecting_start_date: false,
      selecting_end_time: false,
      selecting_end_date: false,
    }
  },
  methods:{
    async sendReq(){
      if (this.click1){
        this.loading = true;
        try{
          const response = await axios(
              {
                method : 'post',
                url : 'http://se-summer.cn:4446/getRoom',
                data : {
                  'id' : this.roomId,
                  'password' : this.password,
                }
              })
          this.GLOBAL.roomInfo = response.data.room;
          this.snackText = '加入成功';
          this.snack = true;
          this.loading = false;
          this.click1 = false;
          setTimeout(()=>{this.$emit('join');},1000)
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
      else if(this.click3){
        this.loading = true;
        try{
          const response = await axios(
              {
                method : 'post',
                url : 'http://se-summer.cn:4446/reserve',
                data : {
                  'token' : this.GLOBAL.userinfo.token,
                  'topic' : this.topic,
                  'password' : this.password,
                  'start_time' : this.start_date + ' ' + this.start_time + ':00',
                  'end_time' : this.end_date + ' ' + this.end_time + ':00',
                  'max_num' : this.max_num,
                }
              })
          this.GLOBAL.roomInfo = response.data.room;
          this.snackText = '预约成功';
          this.snack = true;
          this.loading = false;
          this.click3 = false;
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
      else if(this.click2){
        this.loading = true;
        try{
          const response = await axios(
              {
                method : 'post',
                url : 'http://se-summer.cn:4446/reserve',
                data : {
                  'token' : this.GLOBAL.userinfo.token,
                  'topic' : this.topic,
                  'password' : this.password,
                  'start_time' : moment().add(1, 'm').format("YYYY-MM-DD HH:mm:ss"),
                  'end_time' : moment().add(2, 'h').format("YYYY-MM-DD HH:mm:ss"),
                  'max_num' : this.max_num,
                }
              })
          this.GLOBAL.roomInfo = response.data.room;
          this.snackText = '创建成功';
          this.snack = true;
          this.loading = false;
          this.click2 = false;
          setTimeout(()=>{this.$emit('join');},1000)
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
}
</script>

<style scoped>
.main-page{
  min-width: 600px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  //background-size: contain;
    background: #000000;
//background-image: url("https://unity-cn-cms-prd-1254078910.cos.ap-shanghai.myqcloud.com/assetstore-cms-media/img-176409f9-fa82-4a95-ab0c-1ecaffe87f55");
}
.teal-cover{
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom left, #00897B00, #00897Bdd);
  //animation: effect 1s infinite;
}
.title1{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 72px;
  font-weight: bold;
  margin-top: 180px;
  margin-left: 60px;
  transition: 0.25s ease-in-out;
}
.title1.active{
  margin-top: 50px;
  transition: 0.25s ease-in-out;
}
.title2{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 24px;
  font-style: italic;
  font-weight: lighter;
  margin-top: 10px;
  margin-left: 60px;
  transition: 0.25s ease-in-out;
}
.title2.active{
  opacity: 0;
  transition: 0.25s ease-in-out;
}
.card-title{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 42px;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
}
.card-title:hover {
  font-weight: normal;
 }
.card-text{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 16px;
  text-align: left;
  margin-left: 10%;
}
.cards-container{
  margin-top: 80px;
  transition: all 0.15s ease-out;
}
.cards-container.active{
  margin-top: 0;
  transition: all 0.15s ease-out;
}
.function-card{
//margin-top: 20%;
  padding: 8% 10%;
//width: 60%;
  margin: 30% 10%;
  opacity: 0.85;
  transition: all 0.2s ease-out;
  overflow: hidden;
}
.function-card:hover{
  transition: all 0.15s ease-out;
  opacity: 1;
  transform: scale(1.05);
  //background-image: linear-gradient(to bottom right, #00897B00, #00897Bff);
}
.function-card.active{
  transform: scale(1);
  margin: 30px;
  width: 66%;
  padding: 4% 10%;
  transition: all 0.2s ease-out;
}
.function-card.active:hover{
  cursor: default;
}
.arrow{
  position: absolute;
  top: 95px;
  left: -90px;
  transition: all 0.15s ease-in;
}
.arrow.pos1{
  transition: all 0.15s ease-in;
  left: -40px;
  cursor: default;
}
.arrow.pos2{
  transition: all 0.3s ease-in;
  top: 30px;
  left: 80%;
  cursor: pointer;
}
.close{
  transition: 0.2s linear;
  position: absolute;
  top: 5px;
  left: 5px;
}
.close:hover{
  transition: 0.2s linear;
  transform: scale(1.1);
  position: absolute;
}
@keyframes effect {
  from {
    background-image: linear-gradient(to bottom left, #00897B00, #00897Bdd);;
  }
  to {
    background-image: linear-gradient(to bottom left, #00897Bdd, #00897B00);;
  }
}

</style>