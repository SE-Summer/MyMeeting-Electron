<template>
  <div class="main-page">
    <div class="teal-cover">
      <h1 class="title1 white--text" :class="[{'active':click1||click2||click3}]">
        开始你的视频会议
      </h1>
      <h1 class="title2 white--text" :class="[{'active':click1||click2||click3}]">
        MyMeeting — 见我想见的人
      </h1>
      <v-container :class="['cards-container', {'active':click1||click2||click3}]">
        <v-row>
          <transition name="cols-transition">
          <v-col align="center" v-show="click1||(!click1&&!click2&&!click3)">
            <v-card
                class="teal lighten-4 function-card"
                :class="[{'active':click1||click2||click3}]"
                elevation="10"
                @mouseenter="hover1=true" @mouseleave="hover1=false" @click="function1"
            >
              <v-icon
                  color="#004D4099" size="60px" class="close" v-show="click1" @click.stop="click1=false">
                mdi-close
              </v-icon>
              <v-icon
                  color="#004D4099" size="160px" :class="['arrow',{'pos1':hover1, 'pos2':click1}]">
                mdi-arrow-right-thick
              </v-icon>
              <p class="card-title teal--text text--darken-4">
                快速入会
              </p>
              <p class="card-text teal--text text--darken-4">
                使用会议号和密码，加入一场现有的会议
              </p>
              <div class="input-text"
                   v-if="click1">
                <v-text-field
                    v-model="roomId"
                    height="60px"
                    outlined
                    append-icon="mdi-email"
                    label="会议号"
                    color="teal darken-1"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="roomId"
                    outlined
                    height="60px"
                    append-icon="mdi-email"
                    label="密码"
                    color="teal darken-1"
                    required
                ></v-text-field>
              </div>
            </v-card>
          </v-col></transition>
          <transition name="cols-transition">
          <v-col align="center" v-show="click2||(!click1&&!click2&&!click3)">
            <v-card
                class="teal lighten-4 function-card"
                :class="[{'active':click1||click2||click3}]"
                elevation="10"
                @mouseenter="hover2=true" @mouseleave="hover2=false" @click="function2"
            >
              <v-icon
                  color="#004D4099" size="60px" class="close" v-show="click2" @click.stop="click2=false">
                mdi-close
              </v-icon>
              <v-icon
                  color="#004D4099" size="160px" :class="['arrow',{'pos1':hover2, 'pos2':click2}]">
                mdi-arrow-right-thick
              </v-icon>
              <p class="card-title teal--text text--darken-4">
                创建会议
              </p>
              <p class="card-text teal--text text--darken-4">
                作为主持人，立即开始一次会议
              </p>
            </v-card>
          </v-col></transition>
          <transition name="cols-transition">
          <v-col align="center" v-show="click3||(!click1&&!click2&&!click3)">
            <v-card
                class="teal lighten-4 function-card"
                :class="[{'active':click1||click2||click3}]"
                elevation="10"
                @mouseenter="hover3=true" @mouseleave="hover3=false" @click="function3"
            >
              <v-icon
                  color="#004D4099" size="60px" class="close" v-show="click3" @click.stop="click3=false">
                mdi-close
              </v-icon>
              <v-icon
                  color="#004D4099" size="160px" :class="['arrow',{'pos1':hover3, 'pos2':click3}]">
                mdi-arrow-right-thick
              </v-icon>
              <p class="card-title teal--text text--darken-4">
                预约会议
              </p>
              <p class="card-text teal--text text--darken-4">
                作为主持人，预约未来某时刻的会议
              </p>
            </v-card>
          </v-col></transition>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>

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
      roomId : "",
    }
  },
  methods:{
    function1(){
      this.click1 = true;
    },
    function2(){
      this.click2 = true;
    },
    function3(){
      this.click3 = true;
    }
  }
}
</script>

<style scoped>
.main-page{
  overflow: hidden;
  width: 100%;
  height: 100%;
  //background-size: cover;
  background: #000000;
  //background-image: url("https://unity-cn-cms-prd-1254078910.cos.ap-shanghai.myqcloud.com/assetstore-cms-media/img-176409f9-fa82-4a95-ab0c-1ecaffe87f55");
}
.teal-cover{
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom left, #00897B00, #00897Bbb);
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
  font-size: 40px;
  font-weight: bold;
  text-align: left;
}
.card-text{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 16px;
  text-align: left;
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
  padding: 5% 10%;
//width: 60%;
  margin: 20% 15%;
  transition: all 0.2s ease-out;
  overflow: hidden;
}
.function-card:hover{
  transition: all 0.15s ease-out;
  transform: scale(1.1);
  cursor: pointer;
  //background-image: linear-gradient(to bottom right, #00897B00, #00897Bff);
}
.function-card.active{
  transform: scale(1);
  margin: 30px;
  width: 66%;
  transition: all 0.2s ease-out;
}
.function-card.active:hover{
  cursor: default;
}
.arrow{
  position: absolute;
  top: 70px;
  left: -90px;
  transition: all 0.15s ease-in;
}
.arrow.pos1{
  transition: all 0.15s ease-in;
  left: -40px;
}
.arrow.pos2{
  transition: all 0.3s ease-in;
  top: 30px;
  left: 580px;
}
.close{
  transition: 0.2s linear;
  position: absolute;
  top: 10px;
  left: 10px;
}
.close:hover{
  transition: 0.2s linear;
  transform: scale(1.1);
  position: absolute;
  top: 10px;
  left: 10px;
}
.input-text{
  float: left;
  font-family: "Microsoft YaHei UI", serif;
  margin: 20px;
  margin-top: 60px;
  width: 80%;
  font-size: 32px;
}

.cols-transition-enter, .cols-transition-leave-to{
  opacity: 0;
}
.cols-transition-leave, .cols-transition-enter-to{
  opacity: 1;
}
.cols-transition-enter-active, .cols-transition-leave-active{
  transition: all 0.5s;
}
</style>