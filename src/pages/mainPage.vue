<template>
  <v-app id="mainWindow">
    <v-system-bar app color="grey darken-4" class="white--text" height="40px">
      <v-app-bar-title class="appbar-title">MyMeeting</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="minimizeWin">
        <v-icon color="white">mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn icon @click="maximizeWin">
        <v-icon color="white">mdi-window-maximize</v-icon>
      </v-btn>
      <v-btn icon @click="closeWin">
        <v-icon color="white">mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-app-bar
        app
        clipped-right
        flat
        height="45"
    >
      <div>
        <v-btn small icon color="gray" style="margin-left: 5px">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <div id="appBarContent">
        <p style="color: grey; font-size: small">会议号 : 1</p>
      </div>

      <v-spacer></v-spacer>

      <div>
        <v-chip small style="color: gray; font-weight: lighter">
          <v-icon left>
            mdi-clock-outline
          </v-icon>
          00:00
        </v-chip>
        <v-btn small icon color="gray" style="margin-left: 5px">
          <v-icon>mdi-window-restore</v-icon>
        </v-btn>
      </div>

    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        app
        width="300"
    >
      <v-navigation-drawer
          v-model="drawer"
          absolute
          color="grey lighten-3"
          mini-variant
      >
        <v-avatar
            class="d-block text-center mx-auto mt-4"
            color="grey darken-1"
            size="36"
        >
          <v-img src="../assets/kendrick.jpg">
            <template v-slot:placeholder>
              <div style="margin-top: 7px">
                <v-progress-circular
                    indeterminate
                    size="20"
                    color="grey lighten-5"
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-avatar>

        <v-divider class="mx-3 my-5"></v-divider>

        <v-btn
            icon
            class="d-block text-center mx-auto mb-9"
            :color="videoIcon.color"
            @click="videoSwitch">
          <v-icon>{{ this.videoIcon.icon }}</v-icon>
        </v-btn>

        <v-btn
            icon
            class="d-block text-center mx-auto mb-9"
            :color="microIcon.color"
            @click="microSwitch">
          <v-icon>{{ this.microIcon.icon }}</v-icon>
        </v-btn>

        <v-btn
            icon
            class="d-block text-center mx-auto mb-9"
            :color="screenIcon.color"
            @click="screenSwitch">
          <v-icon>{{ this.screenIcon.icon }}</v-icon>
        </v-btn>

        <v-btn
            icon
            class="d-block text-center mx-auto mb-9"
            color="gray">
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>

        <v-btn
            icon
            class="d-block text-center mx-auto mb-9"
            color="yellow darken-3">
          <v-badge
            color="yellow darken-3"
            content="all"
            light
            offset-x="28px"
            offset-y="-1px">
            <v-icon>mdi-microphone-off</v-icon>
          </v-badge>
        </v-btn>

      </v-navigation-drawer>

      <v-sheet
          color="grey lighten-5"
          height="108"
          width="100%"
      >
        <div id="sheetDiv">
          <p id="sheetTitle">
            参会成员
          </p>
          <v-text-field
              label="搜索成员"
              id="userSearchBar"
              color="green darken-3"
              prepend-inner-icon="mdi-account-circle-outline"
              outlined
              clearable></v-text-field>
        </div>
      </v-sheet>

      <v-list
          class="pl-14"
          shaped
      >
        <v-list-item
            v-for="n in 5"
            :key="n"
        >
          <v-list-item-avatar>
            <v-img src="../assets/snoopdogg.jpg">
              <template v-slot:placeholder>
                <div style="margin-top: 7px; margin-left: 8px">
                  <v-progress-circular
                      indeterminate
                      size="20"
                      color="grey lighten-5"
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>
          </v-list-item-avatar>
          <v-list-item-content style="font-size: small">
            aaaa
          </v-list-item-content>
          <v-list-item-content style="display: inline-block">
            <v-menu
              top
              :offset-x="true">
              <template v-slot:activator="{on, attrs}">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon>
                <v-icon>mdi-cog-outline</v-icon>
              </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  v-for="(item, index) in menuItems"
                  :key="index"
                  @click="switchMenuFunc(index, n)">
                  <v-list-item-icon>
                    <v-icon :color="item.color">
                      {{item.icon}}
                    </v-icon>
                    </v-list-item-icon>
                  <v-list-item-title>{{item.text}}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-content>
          <v-list-item-content style="display: inline-block">
            <v-btn icon>
              <v-icon>mdi-microphone-off</v-icon>
            </v-btn>
          </v-list-item-content>
          <v-list-item-content style="display: inline-block">
            <v-btn icon>
              <v-icon color="yellow darken-3">mdi-account-remove</v-icon>
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
        app
        clipped
        right
    >
      <v-list>
        <v-list-item
            v-for="n in 4"
            :key="n"
            link
        >
          <v-list-item-content>
            <v-hover v-slot="{hover}">
                <v-card
                  height="150px"
                  outlined
                  elevation="13">
                <video src="../assets/xiangxi.mp4">
                </video>
                <template>
                  <v-expand-transition>
                    <div
                        v-if="hover"
                        class="d-flex transition-fast-in-fast-out white black--text v-card--reveal"
                        style="height: 20%;">
                      <p id="rightSideBarText">
                        TEXT
                      </p>
                      <v-spacer></v-spacer>
                      <v-btn icon>
                        <v-icon color="blue lighten-2">
                          mdi-account-star
                        </v-icon>
                      </v-btn>
                      <v-btn icon>
                        <v-icon color="yellow darken-3">
                          mdi-close
                        </v-icon>
                    </v-btn>
                    </div>
                  </v-expand-transition>
                </template>
              </v-card>
            </v-hover>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="text-align: center">
      <div id="mainVideo">
        <video style="height: 100%; width: 100%" @click="play" id="video" autoplay></video>
      </div>
      <div id="chatOverlay" v-if="chatOverlay">
        <v-container id="chatContainer">
          <v-row v-for="n in 50" :key="n">
            <v-col>
                <v-card id="messageCard" max-width="500px" max-height="80px">
                  <v-card-text  style="height: 30px; font-size: 15px; color: black;">
                    <template>
                      <v-avatar
                          color="grey darken-1"
                          size="25"
                          style="margin-right: 8px;">
                        <v-img src="../assets/kendrick.jpg">
                          <template v-slot:placeholder>
                            <div style="margin-top: 7px">
                              <v-progress-circular
                                  indeterminate
                                  size="20"
                                  color="grey lighten-5"
                              ></v-progress-circular>
                            </div>
                          </template>
                        </v-img>
                      </v-avatar>
                    </template>
                    Kendrick to EveryOne 2021/7/30/15:16</v-card-text>
                  <v-card-text id="messageText">Hello!</v-card-text>
                </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>

    <v-footer
        app
        color="transparent"
        height="72"
        inset
    >
      <v-text-field
          background-color="grey lighten-4"
          dense
          hide-details
          rounded
          outlined
          label="发送消息"
          @focus="showChat(true)"
      >
        <template v-slot:prepend>
          <div @click="showChat(!chatOverlay)">
            <v-badge
                color="green"
                light
                dot>
              <v-icon>mdi-comment-multiple-outline</v-icon>
            </v-badge>
          </div>
        </template>
      </v-text-field>
      <div>
        <v-icon color="yellow darken-3" :disabled="!chatOverlay" style="margin-left:5px;margin-right: 5px;">mdi-emoticon-outline</v-icon>
        <v-icon color="blue" style="margin-right: 5px;">mdi-file</v-icon>
        <v-icon color="green" :disabled="!chatOverlay">mdi-send</v-icon>
      </div>
    </v-footer>
  </v-app>

</template>

<script>
import { ipcRenderer } from 'electron';
import AgoraRTC from "agora-rtc-sdk-ng";

export default {
  name: "mainPage.vue",
  data () {
    return {
      drawer: null,
      videoIcon : {
        icon : 'mdi-video-outline',
        color : 'green'
      },
      microIcon : {
        icon : 'mdi-microphone-outline',
        color : 'green'
      },
      screenIcon : {
        icon : 'mdi-laptop',
        color : 'green'
      },
      chatOverlay : false,
      menuItems : [
        {
          icon : 'mdi-chat',
          color : 'green',
          text : '私聊',
          function : 'privateChat'
        },
        {
          icon : 'mdi-account-star',
          color: 'blue',
          text : '设为主关注',
          function: 'mainView'
        },
        {
          icon : 'mdi-account-plus',
          color: 'blue lighten-2',
          text : '添加至侧关注',
          function: 'subView'
        },
      ]
    }
  },
  methods: {
    async play() {
      document.getElementById('video').srcObject =  await this.getCamStream();
    },
    stop() {
      document.getElementById('video').srcObject = null;
    },
    videoSwitch () {
      if (this.videoIcon.icon === 'mdi-video-outline') {
        this.videoIcon.icon = 'mdi-video-off'
        this.videoIcon.color = 'gray'
      } else {
        this.videoIcon.icon = 'mdi-video-outline'
        this.videoIcon.color = 'green'
      }
    },
    microSwitch () {
      if (this.microIcon.icon === 'mdi-microphone-outline') {
        this.microIcon.icon = 'mdi-microphone-off'
        this.microIcon.color = 'gray'
      } else {
        this.microIcon.icon = 'mdi-microphone-outline'
        this.microIcon.color = 'green'
      }
    },
    screenSwitch () {
      if (this.screenIcon.icon === 'mdi-laptop') {
        this.screenIcon.icon = 'mdi-laptop-off'
        this.screenIcon.color = 'gray'
      } else {
        this.screenIcon.icon = 'mdi-laptop'
        this.screenIcon.color = 'green'
      }
    },
    showChat (boolean) {
      this.chatOverlay = boolean
    },
    switchMenuFunc (index, n) {
      switch (index) {
        case 0 :
        {
          this.privateChat(n)
          break
        }
        case 1 :
        {
          this.mainView(n)
          break
        }
        case 2 :
        {
          this.subView(n)
          break;
        }
        default:
        {
          console.log(`switch menu function error!`)
        }
      }
    },
    privateChat (n) {
      console.log('private chat', n)
    },
    mainView (n) {
      console.log('main view', n)
    },
    subView (n) {
      console.log('sub view', n)
    },
    minimizeWin(){
      ipcRenderer.send('window-min')
    },
    maximizeWin(){
      ipcRenderer.send('window-max')
    },
    closeWin(){
      ipcRenderer.send('window-close')
    },
    async getCamStream()
    {
      let stream = null;

      try {
        const iVideoTrack = await AgoraRTC.createCameraVideoTrack();
        await iVideoTrack.setBeautyEffect(true, {
          lighteningContrastLevel: 1,
          lighteningLevel: 0.7,
          rednessLevel: 0.1,
          smoothnessLevel: 0.5
        });
        stream = new MediaStream([iVideoTrack.getMediaStreamTrack()]);
      } catch (err) {
        console.error(err);
      }
      return stream;
    }
  }
}
</script>

<style scoped>

#userSearchBar {
}

#appBarContent {
  margin-top: 15px;
}

#mainVideo {
  width: 1000px ;
  height: 560px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

#sheetTitle {
  font-weight: bold;
  font-size: large;
  color: gray;
  margin-top: 20px
}

#sheetDiv {
  margin-left: 60px;
  text-align: center;
}

.v-card--reveal {
  align-items: center;
  bottom: -10px;
  justify-content: center;
  background-color: #aaaaaa55;
  position: absolute;
  width: 100%;
}

#messageCard {
  background-color: #aaaaaa88;
}

#messageText {
  color: black;
  font-family: "JetBrains Mono ExtraBold";
}

#chatContainer {
  width: 100%;
  height: 100%;
  text-align: left !important;
}

#chatOverlay {
  position: absolute;
  width: 1000px ;
  height: 560px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color: #88888855;
  overflow: scroll;
}

#chatOverlay::-webkit-scrollbar{
  display: none;
}

#rightSideBarText {
  font-size: small;
  margin-top: 18px;
  font-family: "JetBrains Mono ExtraBold";
}
</style>
