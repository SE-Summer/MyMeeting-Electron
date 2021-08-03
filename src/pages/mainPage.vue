<template>
  <v-app id="mainWindow">
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
        <p style="color: grey; font-size: small">会议号 : {{GLOBAL.roomInfo.id}}</p>
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
        <v-btn small icon color="red" style="margin-left: 5px" @click="leaveMeeting">
          <v-icon>mdi-exit-to-app</v-icon>
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
          <v-img :src="GLOBAL.baseURL + GLOBAL.userinfo.portrait">
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
              clearable
              v-model="filterText"></v-text-field>
        </div>
      </v-sheet>

      <v-list
          class="pl-14"
          shaped
      >
        <v-list-item
            v-for="(user, index) in this.filteredUsers"
            :key="index"
        >
          <v-list-item-avatar>
            <v-img :src="user.getPeerInfo().avatar">
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
            {{user.getPeerInfo().displayName}}
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
                  @click="switchMenuFunc(index, user.getPeerDetails().id)">
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
            v-for="(user, index) in this.subFollowUsers"
            :key="index"
            link
        >
          <v-list-item-content>
            <v-hover v-slot="{hover}">
                <v-card
                  height="150px"
                  outlined
                  elevation="13">
                <video :srcObject="user.videoStream">
                </video>
                <template>
                  <v-expand-transition>
                    <div
                        v-if="hover"
                        class="d-flex transition-fast-in-fast-out white black--text v-card--reveal"
                        style="height: 20%;">
                      <p id="rightSideBarText">
                        {{user.displayName}}
                      </p>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="sub2Main(index)">
                        <v-icon color="blue lighten-2">
                          mdi-account-star
                        </v-icon>
                      </v-btn>
                      <v-btn icon @click="removeSubFollowUser(index)">
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
        <video style="height: 100%; width: 100%" :srcObject="this.mainVideo.videoStream"></video>
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
      <div @click="switchChat(null)" style="margin-right: 5px">
        <v-btn icon>
          <v-fab-transition>
          <v-badge
               v-if="!chatOverlay"
               :color="this.chatBadge"
               light
               dot>
            <v-icon>mdi-chat-outline</v-icon>
          </v-badge>
          <v-icon v-else>mdi-chat-remove-outline</v-icon>
          </v-fab-transition>
        </v-btn>
      </div>
      <v-text-field
          background-color="grey lighten-4"
          dense
          hide-details
          rounded
          outlined
          label="发送消息"
          @focus="switchChat(true)"
          @keypress.13="sendMsg"
          v-model="inputMsg"
      >
      </v-text-field>
      <div>
          <v-menu
              v-model="showEmojiPicker"
              absolute
              offset-x
              transition="scale-transition"
              :close-on-content-click="false">
            <template v-slot:activator="{on, attrs}">
              <v-icon
                  color="yellow darken-3"
                  :disabled="!chatOverlay"
                  style="margin-left:5px;margin-right: 5px;"
                  @click="showEmojiPicker = !showEmojiPicker"
                  v-bind="attrs"
                  v-on="on">
                mdi-emoticon-outline</v-icon>
            </template>
            <v-emoji-picker
                :emojiSize="24"
                :emojisByRow="5"
                @select="selectEmoji"></v-emoji-picker>
          </v-menu>
        <v-icon color="blue" style="margin-right: 5px;">mdi-file</v-icon>
        <v-icon color="green" :disabled="!chatOverlay" @click="sendMsg">mdi-send</v-icon>
      </div>
    </v-footer>
  </v-app>

</template>

<script>
import {VEmojiPicker} from 'v-emoji-picker'
import {MediaService} from '../service/MediaService'

export default {
  name: "mainPage.vue",
  components : {
    VEmojiPicker
  },
  data () {
    return {
      mediaService : null,
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
      chatBadge : 'green',
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
          function: 'mainVideo'
        },
        {
          icon : 'mdi-account-plus',
          color: 'blue lighten-2',
          text : '添加至侧关注',
          function: 'subVideo'
        },
      ],
      showEmojiPicker : false,
      filterText : '',
      inputMsg : '',
      allMsgs : [],
      allUsers : [],
      mainFollowUser : null,
      subFollowUsers : [],
      mediaDevice : null,
      videoStream : null,
      audioStream : null,
      video : false,
      audio : false
    }
  },
  methods: {
    async videoSwitch () {
      if (this.video) {
        this.video = false
        let res = await this.mediaService.closeTrack(this.videoStream.getTracks())
        console.log('[Video Close]', res)
        this.videoIcon.icon = 'mdi-video-off'
        this.videoIcon.color = 'gray'
      } else{
        this.video = true
        this.sendMediaStream(true, false)
        this.videoIcon.icon = 'mdi-video-outline'
        this.videoIcon.color = 'green'
      }
    },
    async microSwitch () {
      if (this.microIcon.icon === 'mdi-microphone-outline') {
        this.audio = false
        let res = await this.mediaService.closeTrack(this.audioStream.getTracks())
        console.log(res)
        this.microIcon.icon = 'mdi-microphone-off'
        this.microIcon.color = 'gray'
      } else {
        this.audio = true
        this.sendMediaStream(false, true)
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
    switchChat (boolean) {
      let toStat;
      if (boolean == null) {
        toStat = !this.chatOverlay
      } else {
        toStat = boolean
      }

      if (!toStat) {
        this.chatOverlay = false
        this.chatIcon.icon = 'mdi-comment-multiple-outline'
        this.chatIcon.color = 'green'
      } else {
        this.chatOverlay = true
        this.chatIcon.icon = 'mdi-comment-multiple'
        this.chatIcon.color = 'red'
      }
    },
    switchMenuFunc (index, userId) {
      switch (index) {
        case 0 :
        {
          this.privateChat(userId)
          break
        }
        case 1 :
        {
          this.mainVideo(userId)
          break
        }
        case 2 :
        {
          this.subVideo(userId)
          break;
        }
        default:
        {
          console.log(`switch menu function error!`)
        }
      }
    },
    privateChat (userId) {
      console.log('private chat', userId)
    },
    mainVideo (userId) {
      let user = this.mediaService.getPeerDetailsByPeerId(userId)

      let mediaStream = new MediaStream(user.getTracks())

      let peerInfo = user.getPeerInfo()

      this.mainFollowUser = {
        id : peerInfo.id,
        displayName : peerInfo.displayName,
        mediaStream : mediaStream
      }

      console.log('[Main Video]', peerInfo.displayName)
    },
    subVideo (userId) {
      let user = this.mediaService.getPeerDetailsByPeerId(userId)

      let mediaStream = new MediaStream(user.getTracks())

      let peerInfo = user.getPeerInfo()

      this.subFollowUsers.push(
        {
          id : peerInfo.id,
          displayName : peerInfo.displayName,
          mediaStream : mediaStream
        }
      )
      console.log('[Add Sub Video]', peerInfo.displayName)
    },
    sendMsg () {
      this.inputMsg = ''
      console.log('send msgs')
    },
    selectEmoji (emoji) {
        this.inputMsg += emoji.data
    },
    sub2Main (index) {
      let user = this.subFollowUsers[index]
      this.subFollowUsers.splice(index, 1)
      this.mainFollowUser = user
    },
    removeSubFollowUser (index) {
      this.subFollowUsers.splice(index, 1)
    },
    leaveMeeting () {
      this.mediaService.leaveMeeting()
    },
    sendMediaStream (video, audio) {
      if (video) {
        let constraint = {
          video : this.GLOBAL.videoConstraint
        }

        this.navigator.mediaDevices.getUserMedia(constraint)
          .then(async (mediaStream) => {
            this.videoStream = mediaStream
            let res = await this.mediaService.sendMediaStream(mediaStream)

            this.subFollowUsers.push({
              id : this.GLOBAL.userinfo.id,
              displayName: this.GLOBAL.userinfo.nickname,
              mediaStream : new MediaStream(mediaStream.getTracks())
            })
            console.log('[Send Video]',res)
          }).catch((error) => {
          console.log(error)
        })
      }

      if (audio) {
        let constraint = {
          audio : true
        }

        this.navigator.mediaDevices.getUserMedia(constraint)
          .then(async (mediaStream) => {
            this.audioStream = mediaStream
            let res = await this.mediaService.sendMediaStream(mediaStream)

            console.log('[Send Audio]',res)
          }).catch((error) => {
          console.log(error)
        })
      }
    }
  },
  async created() {
    this.mediaService = new MediaService()
    this.mediaService.registerPeerUpdateListener(() => {
      this.allUsers = this.mediaService.getPeerDetails()
    })

    this.mediaService.registerNewMessageListener((newMsg) => {
      this.allMsgs.push(newMsg)
    })

    this.mediaService.registerMeetingEndListener(() => {

    })

    let res = await this.mediaService.joinMeeting(
      this.GLOBAL.roomInfo.token,
      this.GLOBAL.userInfo.token,
      this.GLOBAL.userInfo.nickname,
      this.GLOBAL.userInfo.nickname + '\'s PC',
      this.GLOBAL.userInfo.avatar)

    console.log(res)

    navigator.getUserMedia  = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (!navigator.getUserMedia) {
      console.log('Browser DOES NOT support!')
    }

    this.video = this.GLOBAL.openMicrophoneWhenEnter
    this.audio = this.GLOBAL.openCameraWhenEnter

    this.sendMediaStream(this.video, this.audio)

    if (!this.video) {
      this.videoIcon.icon = 'mdi-video-off'
      this.videoIcon.color = 'gray'
    }

    if (!this.audio) {
      this.microIcon.icon = 'mdi-microphone-off'
      this.microIcon.color = 'gray'
    }


  },
  computed : {
    filteredUsers () {
      if (this.filterText === '') {
        return this.allUsers
      }
      else {
        return this.allUsers.filter(user =>
          user.displayName.search(this.filterText) !== -1
        )
      }
    },
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
