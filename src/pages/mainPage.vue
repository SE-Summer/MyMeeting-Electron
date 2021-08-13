<template>
  <v-app id="mainWindow">
    <v-snackbar
        top
        color="red white--text"
        timeout="1600"
        light
        v-model="snack">
      {{snackText}}
    </v-snackbar>
    <v-app-bar
        app
        clipped-right
        flat
        height="45"
    >
      <div>
        <v-menu
            bottom
            right
            nudge-right="40px"
            transition="scale-transition"
            attach
            max-width="400px"
            max-height="200px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn small v-bind="attrs" v-on="on" icon color="gray" style="margin-left: 5px">
              <v-icon>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div>会议主题 : {{GLOBAL.roomInfo.topic}}</div>
              <div>会议号 : {{GLOBAL.roomInfo.id}}</div>
              <div>会议密码 : {{GLOBAL.roomInfo.password}}</div>
              <div>会议开始时间 : {{GLOBAL.roomInfo.start_time}}</div>
              <div>会议开始时间 : {{GLOBAL.roomInfo.end_time}}</div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>

      <v-spacer></v-spacer>

      <div style="font-size: small; color: grey;">会议号 : {{GLOBAL.roomInfo.id}}</div>

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
        width="320"
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
          <v-img :src="GLOBAL.baseURL + GLOBAL.userInfo.portrait">
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

        <setting-dialog @changeSettings="changeSettings"></setting-dialog>

        <v-btn
            icon
            class="d-block text-center mx-auto mb-9"
            color="yellow darken-3"
            v-if="isHost"
            @click="muteAll">
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
          height="120"
          width="100%"
      >
        <div id="sheetDiv">
          <p id="sheetTitle">
            参会成员
          </p>
          <v-text-field
              label="搜索成员"
              id="userSearchBar"
              color="teal"
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
        <v-badge :value="isHost" icon="mdi-crown" color="orange--text" overlap offset-x="10px" offset-y="15px">
          <v-list-item :class="['lighten-4 not-host-item', {'host-item':isHost}]" dense>
            <v-list-item-avatar style="border: 1px solid teal" size="44">
              <v-img :src="GLOBAL.baseURL + GLOBAL.userInfo.portrait">
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
            <v-list-item-content>
              <v-list-item-title align="center" style="font-size: 18px; font-weight: bold; width: 120px">
                {{GLOBAL.userInfo.nickname}}
              </v-list-item-title>
              <v-list-item-subtitle align="center">
                <v-btn icon @click="mainVideo(GLOBAL.userInfo.id)">
                  <v-icon color="teal" size="20">
                    mdi-account-star
                  </v-icon>
                </v-btn>
                <v-btn icon @click="subVideo(GLOBAL.userInfo.id)">
                  <v-icon color="teal" size="20">
                    mdi-account-plus
                  </v-icon>
                </v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-badge>
        <v-badge :value="GLOBAL.roomInfo.hostToken === user.getPeerInfo().id" icon="mdi-crown" color="orange--text"
                 overlap offset-x="10px" offset-y="15px"
                 v-for="(user, index) in this.filteredUsers"
                 :key="index">
          <v-list-item style="width: 100%" dense
               :class="['lighten-4 not-host-item', {'host-item':GLOBAL.roomInfo.hostToken === user.getPeerInfo().id}]"
          >
            <v-list-item-avatar style="border: 1px solid teal" size="44">
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
            <v-list-item-content>
              <v-list-item-title style="font-size: 18px; font-weight: bold; width: 120px" align="center">
                {{user.getPeerInfo().displayName}}
              </v-list-item-title>
              <v-list-item-subtitle align="center">
                <v-menu
                    attach>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon>
                      <v-icon size="20">mdi-cog-outline</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="white" dense>
                    <v-list-item
                        v-for="(item, index) in menuItems"
                        :key="index"
                        @click="switchMenuFunc(index, user.getPeerInfo().id)">
                      <v-list-item-icon>
                        <v-icon :color="item.color">
                          {{item.icon}}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{item.text}}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn icon v-if="isHost">
                  <v-icon color="orange" size="20">mdi-microphone-off</v-icon>
                </v-btn>
                <v-btn icon v-if="isHost">
                  <v-icon color="orange" size="20px">mdi-account-remove</v-icon>
                </v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-badge>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
        app
        clipped
        right
    >
      <v-list>
        <v-list-item
            v-for="(user, index) in subFollowUsers"
            :key="index"
            link
        >
          <v-list-item-content>
            <v-hover v-slot="{hover}">
              <v-card
                  height="150px"
                  outlined
                  elevation="13">
                <my-video :src-object="user.mediaStream" :my-id="'sub-video' + index" process-video-type="blur" style="width: 100%; height: 100%"></my-video>
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

    <v-main style="text-align: center" id="main-video-window">
      <div id="mainVideo">
        <v-hover v-slot="{hover}">
          <v-card color="grey lighten-4" height="100%" width="100%">
            <my-video style="height: 100%; width: 100%" my-id="main-video" :src-object="mainFollowUser.mediaStream" process-video-type="blur"></my-video>
            <v-expand-transition>
              <div v-if="hover"
                   class="transition-fast-in-fast-out v-card--reveal-1"
                   style="height: 10% ">
                <p style="color: white;font-weight: bold; height: 10%" v-if="mainFollowUserId">
                  {{mainFollowUser.displayName}}
                </p>
                <v-btn icon @click="removeMainFollowUser" v-if="mainFollowUserId">
                  <v-icon small color="white">mdi-close</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
          </v-card>
        </v-hover>
      </div>
      <div id="chatOverlay" v-show="chatOverlay">
        <v-container id="chatContainer">
          <v-row v-for="(msg, index) in allMsgs" :key="index">
            <v-col>
              <div style="display: inline-block" class="messageCard">
                  <v-avatar
                      color="grey darken-1"
                      size="35"
                      style="margin-right: 8px;">
                    <v-img :src="(msg.fromMyself) ?
                        GLOBAL.baseURL + GLOBAL.userInfo.portrait :
                        mediaService.getPeerDetailsByPeerId(msg.fromPeerId).getPeerInfo().avatar">
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
                  <div style="display: inline-block; font-size: 20px">
                      <span style="font-weight: bold">{{(msg.fromMyself) ?
                          GLOBAL.userInfo.nickname :
                          mediaService.getPeerDetailsByPeerId(msg.fromPeerId).getPeerInfo().displayName}}</span>
                    <span v-if="!msg.broadcast"> to </span>
                    <span  v-if="!msg.broadcast" class="private-chat">{{formatToPeerName(msg)}} </span>
                    <span style="margin:0 20px">{{moment(msg.timestamp).format('hh:mm:ss')}}</span>
                  </div>
                <p class="messageText" v-if="msg.type === 'text'">{{msg.text}}</p>
                <upload-file
                    :file="msg.file"
                    v-else-if="msg.type === 'file'&&msg.fromMyself"
                    @file-sended="sendFile" style="margin-top:20px"></upload-file>
                <download-file :message="msg" v-else style="margin-top:20px"></download-file>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <canvas id="invisibleCanvas" v-show="false"></canvas>
      <video id="invisibleVideo" v-show="false" autoplay></video>
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
              <v-icon color="teal">mdi-chat-outline</v-icon>
            </v-badge>
            <v-icon v-else color="teal">mdi-chat-remove-outline</v-icon>
          </v-fab-transition>
        </v-btn>
      </div>
      <v-text-field
          background-color="grey lighten-4"
          dense
          hide-details
          rounded
          outlined
          color="teal"
          :label="placeholdOfMsg"
          @focus="switchChat(true)"
          @keyup.enter="sendMsg"
          v-model="inputMsg"
      >
        <template v-slot:append>
          <v-menu
              top
              left
              nudge-top="50px"
              nudge-right="50px"
              min-width="150px"
              max-width="500px"
              attach
              close-on-content-click
              transition="scale-transition">
            <template v-slot:activator="{on, attrs}">
              <v-icon
                  :disabled="!chatOverlay"
                  color="teal"
                  v-bind="attrs"
                  v-on="on">
                mdi-broadcast</v-icon>
            </template>
            <v-list dense shaped>
              <v-list-item link @click="privateChat(null)">
                <v-list-item-content style="font-size: 15px; font-family: 'Cascadia Mono'">
                  All
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                  v-for="(user, index) in allUsers"
                  :key="index"
                  link
                  @click="privateChat(user.getPeerInfo().id)">
                <v-list-item-content style="font-size: 15px; font-family: 'Cascadia Mono'">
                  {{user.getPeerInfo().displayName}}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-text-field>
      <div>
        <v-menu
            top
            left
            nudge-top="50px"
            nudge-right="50px"
            attach
            transition="scale-transition"
            :close-on-content-click="false">
          <template v-slot:activator="{on, attrs}">
            <v-icon
                color="yellow darken-3"
                :disabled="!chatOverlay"
                style="margin-left:5px;"
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
        <v-menu
            top
            left
            nudge-top="40px"
            attach
            min-width="200px"
            transition="scale-transition"
            :close-on-content-click="false">
          <template v-slot:activator="{on, attrs}">
            <v-icon
                color="blue"
                :disabled="!chatOverlay"
                style="margin-left:5px;margin-right: 5px;"
                @click="showFilePicker = !showFilePicker"
                v-bind="attrs"
                v-on="on">
              mdi-file</v-icon>
          </template>
          <v-file-input
              v-model="file"
              style="width: 180px"
              :clearable="false"
              append-icon="mdi-file-send-outline"
              @click:append="pickFile"></v-file-input>
        </v-menu>
        <v-icon color="teal" :disabled="!chatOverlay" @click="sendMsg">mdi-send</v-icon>
      </div>
    </v-footer>
  </v-app>

</template>

<script>
import {VEmojiPicker} from 'v-emoji-picker'
import {MediaService} from '../service/MediaService'
import MyVideo from "../components/myVideo"
import DownloadFile from "../components/DownloadFile"
import UploadFile from "../components/UploadFile";
import {virtualBackground} from "../service/VirtualBackgroundService";
import SettingDialog from "../components/SettingsDialog";
import axios from "axios";
const moment = require("moment");

export default {
  name: "mainPage.vue",
  components : {
    SettingDialog,
    UploadFile,
    DownloadFile,
    MyVideo,
    VEmojiPicker
  },
  data () {
    return {
      mediaService : null,
      drawer: null,
      isHost : false,
      videoIcon : {
        icon : 'mdi-video-outline',
        color : 'teal'
      },
      microIcon : {
        icon : 'mdi-microphone-outline',
        color : 'teal'
      },
      screenIcon : {
        icon : 'mdi-laptop',
        color : 'teal'
      },
      chatBadge : '#00000000',
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
          text : '主关注',
          function: 'mainVideo'
        },
        {
          icon : 'mdi-account-plus',
          color: 'blue lighten-2',
          text : '侧关注',
          function: 'subVideo'
        },
      ],
      showEmojiPicker : false,
      showFilePicker : false,
      filterText : '',
      inputMsg : '',
      allMsgs : [],
      allUsers : [],
      mainFollowUserId : null,
      subFollowUserIds : [],
      mediaDevice : null,
      originVideoTracks : [],
      myMediaStream : new MediaStream(),
      myAudioStream : new MediaStream(),
      video : false,
      audio : false,
      moment : moment,
      placeholdOfMsg : '发送消息 to 所有人',
      privateChatPeerId : null,
      file : null,
      vb : null,
      processVideoType : 'normal',
      stopRAFId : null,
      snack : false,
      snackText : ""
    }
  },
  methods: {
    async videoSwitch () {
      if (this.video) {
        this.video = false
        this.closeRAF()
        this.originVideoTracks.forEach((track) => {
          track.stop()
        })
        let tracks = this.myMediaStream.getVideoTracks()
        for (const track of tracks) {
          await this.mediaService.closeTrack(track)
          track.stop()
          this.myMediaStream.removeTrack(track)
        }
        this.videoIcon.icon = 'mdi-video-off'
        this.videoIcon.color = 'gray'
      } else{
        this.video = true
        this.sendMediaStream(this.video, this.audio)
        this.videoIcon.icon = 'mdi-video-outline'
        this.videoIcon.color = 'teal'
      }
    },
    async microSwitch () {
      if (this.microIcon.icon === 'mdi-microphone-outline') {
        this.audio = false
        let tracks = this.myAudioStream.getAudioTracks()
        for (const track of tracks){
          await this.mediaService.closeTrack(track)
          track.stop()
          this.myAudioStream.removeTrack(track)
        }
        this.microIcon.icon = 'mdi-microphone-off'
        this.microIcon.color = 'gray'
      } else {
        this.audio = true
        this.sendMediaStream(this.video, this.audio)
        this.microIcon.icon = 'mdi-microphone-outline'
        this.microIcon.color = 'teal'
      }
    },
    screenSwitch () {
      if (this.screenIcon.icon === 'mdi-laptop') {
        this.screenIcon.icon = 'mdi-laptop-off'
        this.screenIcon.color = 'gray'
      } else {
        this.screenIcon.icon = 'mdi-laptop'
        this.screenIcon.color = 'teal'
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
      } else {
        this.chatOverlay = true
        this.chatBadge = '#00000000'
        setTimeout(()=>{
          let col = document.getElementById('chatContainer');
          col.scrollTop = col.scrollHeight;
        }, 200)
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
      if (!this.chatOverlay) {
        this.chatOverlay = true
        setTimeout(()=>{
          let col = document.getElementById('chatContainer');
          col.scrollTop = col.scrollHeight;
        }, 200)
      }

      if (userId == null) {
        this.placeholdOfMsg =  this.placeholdOfMsg = '发送消息 to 所有人'
      } else {
        this.placeholdOfMsg = '发送消息 to ' + this.mediaService.getPeerDetailsByPeerId(userId).getPeerInfo().displayName
      }

      this.privateChatPeerId = userId
    },
    mainVideo (userId) {
      for (let i = 0; i < this.subFollowUserIds.length; ++i) {
        if (this.subFollowUserIds[i] === userId) {
          this.subFollowUserIds.splice(i, 1)
          break
        }
      }

      this.mainFollowUserId = userId
      console.log('[Main Video]')
    },
    subVideo (userId) {
      if (this.mainFollowUserId === userId) {
        this.mainFollowUserId = null
      }

      if (this.subFollowUserIds.find((subUserId) => {
        return subUserId === userId
      })) {
        return;
      }

      if (userId === this.GLOBAL.userInfo.id) {
        this.subFollowUserIds.push(userId)
        return
      }

      this.subFollowUserIds.push(this.mediaService.getPeerDetailsByPeerId(userId).getPeerInfo().id)

      console.log('[Add Sub Video]')
    },
    sendMsg () {
      if (this.inputMsg === '') {
        return
      }

      let timestamp = moment()

      this.mediaService.sendText(this.privateChatPeerId, this.inputMsg, timestamp)
      this.allMsgs.push({
        type : 'text',
        broadcast : (!this.privateChatPeerId),
        fromMyself : true,
        fromPeerId : this.GLOBAL.userInfo.id,
        text : this.inputMsg,
        timestamp : timestamp,
        toPeerName : (!this.privateChatPeerId) ? '' :
            this.mediaService.getPeerDetailsByPeerId(this.privateChatPeerId).getPeerInfo().displayName
      })
      this.inputMsg = ''

      console.log('send msgs')
    },
    sendFile (data, file) {

      let timestamp = moment()

      this.mediaService.sendFile(this.GLOBAL.baseURL+ data.path, timestamp, file.name, file.type)
      console.log('send file')
    },
    pickFile () {
      if (this.file) {
        let timestamp = moment()

        this.allMsgs.push({
          type : 'file',
          file : this.file,
          broadcast : true,
          fromMyself : true,
          fromPeerId : this.GLOBAL.userInfo.id,
          timestamp : timestamp,
        })

      }
    },
    selectEmoji (emoji) {
      this.inputMsg += emoji.data
    },
    sub2Main (index) {
      let userId = this.subFollowUserIds[index]
      this.subFollowUserIds.splice(index, 1)
      this.mainFollowUserId = userId
    },
    removeSubFollowUser (index) {
      this.subFollowUserIds.splice(index, 1)
    },
    removeMainFollowUser () {
      this.mainFollowUserId = null
    },
    async leaveMeeting () {
      try {
        this.closeRAF()
        if (this.myMediaStream) {
          this.myMediaStream.getTracks().forEach((track) => {
            track.stop()
          })
        }
        this.originVideoTracks.forEach((track) => {
          track.stop()
        })
        await this.mediaService.leaveMeeting()
      } catch (error) {
        console.log('[LEAVE]', error)
      }

      this.$emit('back')
    },
    async sendMediaStream (video, audio) {
      if (!video &&  !audio) {
        return
      }
      let constraint = {
        video : (video) ? this.GLOBAL.videoConstraint : false,
        audio : audio
      }

      for (let track of this.myMediaStream.getVideoTracks()){
        await this.mediaService.closeTrack(track)
      }

      for (let track of this.myAudioStream.getVideoTracks()){
        await this.mediaService.closeTrack(track)
      }

      navigator.mediaDevices.getUserMedia(constraint)
          .then(async (mediaStream) => {
            this.closeRAF()

            if (this.processVideoType === 'normal') {
              this.myMediaStream = (video) ? new MediaStream(mediaStream.getVideoTracks()) : new MediaStream()
              this.myAudioStream = (audio) ? new MediaStream(mediaStream.getAudioTracks()) : new MediaStream()
              document.getElementById('invisibleVideo').srcObject = null
              await this.mediaService.sendMediaStream(mediaStream)
            } else {
              this.originVideoTracks = mediaStream.getVideoTracks()
              let inVideo = document.getElementById('invisibleVideo')
              inVideo.srcObject = new MediaStream(this.originVideoTracks)
              inVideo.onloadeddata = async () => {
                if (this.processVideoType === 'blur') {
                  this.blurBackground()
                } else {
                  this.replaceBackground()
                }
                this.myMediaStream = (video) ? document.getElementById('invisibleCanvas').captureStream() : new MediaStream()
                this.myAudioStream = (audio) ? new MediaStream(mediaStream.getAudioTracks()) : new MediaStream()
                let tracks = this.myMediaStream.getVideoTracks().concat(this.myAudioStream.getAudioTracks())
                await this.mediaService.sendMediaStream(new MediaStream(tracks))
              }
            }
            if (this.mainFollowUserId !== this.GLOBAL.userInfo.id && this.subFollowUserIds.indexOf(this.GLOBAL.userInfo.id) === -1) {
              this.subFollowUserIds.push(this.GLOBAL.userInfo.id)
            }
          }).catch((error) => {
        console.log(error)
      })
    },
    formatToPeerName (msg) {
      if (msg.broadcast) {
        return 'everyone'
      } else {
        if (msg.fromMyself) {
          return msg.toPeerName
        } else {
          return 'You'
        }
      }
    },
    muteAll(){
      this.mediaService.mutePeer();
    },
    blurBackground () {
      let frame = document.getElementById('invisibleVideo')
      this.vb.blurBackground(frame)
      this.stopRAFId = requestAnimationFrame(this.blurBackground)
    },
    replaceBackground () {
      let frame = document.getElementById('invisibleVideo')
      this.vb.replaceBackground(frame)
      this.stopRAFId = requestAnimationFrame(this.replaceBackground)
    },
    changeSettings(blur, replace, backgroundImg) {
      if (blur) {
        this.processVideoType = 'blur'
      } else if (replace) {
        this.processVideoType = 'replace'
        let img = new Image()
        img.src = backgroundImg
        this.vb.setVBConfig(img)
      } else {
        this.processVideoType = 'normal'
      }

      if (this.video) {
        this.sendMediaStream(this.video, this.audio)
      }
    },
    closeRAF () {
      if (this.stopRAFId) {
        cancelAnimationFrame(this.stopRAFId)
        this.stopRAFId = null
      }
    },
    async getRoomInfo(){
      try{
        console.log('GET ROOM', this.GLOBAL.roomInfo)
        const response = await axios(
            {
              method : 'post',
              url : this.GLOBAL.baseURL + '/getRoom',
              data : {
                'id' : this.GLOBAL.roomInfo.id,
                'password' : this.GLOBAL.roomInfo.password,
              }
            })
        this.GLOBAL.roomInfo = response.data.room;
        this.snackText = '房主变更';
        this.snack = true;
      }catch(error){
        this.snackText = "与服务器失去连接"
        this.snack = true;
        setTimeout(()=>{this.$emit('back')},1600)
      }
    }
  },
  async created() {
    this.GLOBAL.roomInfo.hostToken = "";
    this.mediaService = new MediaService()
    this.mediaService.registerPeerUpdateListener('updateListener', () => {
      console.log('[User Update] HOST: ', this.mediaService.getHostPeerId())
      this.allUsers = this.mediaService.getPeerDetails()

      if(this.mediaService.getHostPeerId() !== this.GLOBAL.roomInfo.hostToken){
        this.GLOBAL.roomInfo.hostToken = this.mediaService.getHostPeerId();
        this.snackText = "房主变更";
        this.snack = true;
      }
      this.isHost = this.GLOBAL.roomInfo.hostToken === this.GLOBAL.userInfo.token;
    })

    this.mediaService.registerNewMessageListener('updateListener', (newMsg) => {
      if (!this.chatOverlay) {
        this.chatBadge = 'green'
      }
      this.allMsgs.push(newMsg);
      let col = document.getElementById('chatContainer');
      col.scrollTop = col.scrollHeight;
    })

    this.mediaService.registerMeetingEndListener('updateListener',() => {

    })

    this.mediaService.registerBeMutedListener('mutedListener', async () => {
      console.log('Be Muted')
      if (this.audio){
        this.audio = false
        let tracks = this.myAudioStream.getAudioTracks()
        for (const track of tracks){
          await this.mediaService.closeTrack(track)
          track.stop()
          this.myAudioStream.removeTrack(track)
        }
        this.microIcon.icon = 'mdi-microphone-off'
        this.microIcon.color = 'gray'
      }
    })

    try {
      await this.mediaService.joinMeeting(
          this.GLOBAL.roomInfo.token,
          this.GLOBAL.userInfo.token,
          this.GLOBAL.userInfo.token,
          this.GLOBAL.userInfo.nickname,
          this.GLOBAL.userInfo.nickname + '\'s PC',
          this.GLOBAL.baseURL + this.GLOBAL.userInfo.portrait)
    }catch (e){
      this.snackText = '房主尚未入会';
      this.snack = true;
      setTimeout(()=>{
        this.$emit('back');
      }, 1600);
    }

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

    moment.locale('zh-cn')

    this.vb = new virtualBackground(document.getElementById('invisibleCanvas'))
  },
  computed : {
    filteredUsers () {
      if (this.filterText === '') {
        return this.allUsers
      }
      else {
        return this.allUsers.filter(user => {
          return user.getPeerInfo().displayName.search(this.filterText) !== -1
        })
      }
    },
    mainFollowUser () {
      if (this.mainFollowUserId == null) {
        return {
          id : "",
          displayName: "",
          mediaStream : null
        }
      }
      if (this.mainFollowUserId === this.GLOBAL.userInfo.id) {
        return {
          id : this.mainFollowUserId,
          displayName : this.GLOBAL.userInfo.nickname,
          mediaStream : this.myMediaStream
        }
      } else {
        for (let i = 0; i < this.allUsers.length; ++i) {
          if(this.allUsers[i].getPeerInfo().id === this.mainFollowUserId) {
            let user = this.allUsers[i]
            return {
              id : this.mainFollowUserId,
              displayName : user.getPeerInfo().displayName,
              mediaStream : new MediaStream(user.getTracks())
            }
          }
        }
      }
      return null
    },
    subFollowUsers () {
      let subUsers = []
      if (this.subFollowUserIds.indexOf(this.GLOBAL.userInfo.id) > -1) {
        subUsers.push({
          id: this.GLOBAL.userInfo.id,
          displayName: this.GLOBAL.userInfo.nickname,
          mediaStream: this.myMediaStream
        })
      }

      this.allUsers.forEach((user) => {
        if (this.subFollowUserIds.indexOf(user.getPeerInfo().id) > -1) {
          subUsers.push({
            id: user.getPeerInfo().id,
            displayName: user.getPeerInfo().displayName,
            mediaStream: new MediaStream(user.getTracks())
          })
        }
      })

      return subUsers
    }
  }
}
</script>

<style scoped>
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
}

#sheetDiv {
  margin-left: 60px;
  padding-top: 20px;
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

.v-card--reveal-1 {
  background-color: #00000066;
  position: absolute;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  margin : auto;
  width: 20%;
}

.messageCard {
  padding: 10px 0 0 10px;
  border-top: 6px solid #00838f;
  border-top-right-radius: 30px;
  border-top-left-radius: 12px;
}

.messageText {
  margin: 10px 0 0 15px;
  padding: 0 20px 10px 20px;
  display: block;
  border-bottom-left-radius: 30px;
  border-top-right-radius: 6px;
  border-bottom: 2px solid #00838f;
  border-right: 4px solid #00838f;
}

#chatContainer {
  width: 100%;
  height: 100%;
  text-align: left;
  overflow: auto;
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
}

#chatOverlay::-webkit-scrollbar{
  display: none;
}

#rightSideBarText {
  font-size: small;
  margin-top: 18px;
}

.private-chat {
  color: #FF9800;
  font-weight: bold;
}
.not-host-item.host-item{
  border-left: 8px solid #ff9800aa;
  border-top: 3px solid #ff9800aa;
  border-bottom-left-radius:40px;
  transition: 0.1s ease-in-out;
}
.not-host-item.host-item:hover{
  border-left: 12px solid #ff9800;
  border-top: 3px solid #ff9800;
  border-bottom-left-radius:40px;
  transition: 0.1s ease-in-out;
}
.not-host-item{
  border-left: 8px solid #90CBC488;
  border-top: 2px solid #90CBC488;
  border-bottom-left-radius: 40px;
  transition: 0.1s ease-in-out;
}
.not-host-item:hover{
  border-left: 12px solid #80CBC4;
  border-top: 2px solid #80CBC4;
  border-bottom-left-radius: 40px;
  transition: 0.1s ease-in-out;
}
</style>
