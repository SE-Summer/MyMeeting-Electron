<template>
  <v-dialog
          v-model="dialog"
          width="500"
          attach="#mainWindow"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
              icon
              class="d-block text-center mx-auto mb-9"
              color="gray"
              v-bind="attrs"
              v-on="on">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="grey lighten-4">
        <v-tabs background-color="grey lighten-4" color="teal" v-model="tab">
          <v-tab>
            音量设置
          </v-tab>
          <v-tab>
            虚拟背景
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-divider></v-divider>
      <v-tabs-items v-model="tab">
        <v-tab-item>
        </v-tab-item>
        <v-tab-item style="margin-left: 25%">
          <v-switch
                  v-model="blurSwitch"
                  @click="clickVBSwitch('blur')"
                  label="背景虚化"
                  inset
                  dense
                  color="teal"
                  style="margin-left: 25%">
          </v-switch>
          <v-switch
                  v-model="replaceSwitch"
                  @click="clickVBSwitch('replace')"
                  label="虚拟背景"
                  inset
                  dense
                  color="teal"
                  style="margin-left: 25%">
          </v-switch>
          <v-expand-transition>
            <div v-show="this.replaceSwitch" style="display: flex; align-items: center">
              <v-btn icon @click="prev" >
                <v-icon style="color: teal">mdi-chevron-left</v-icon>
              </v-btn>
              <v-card
                      style="margin-left: 5px;margin-right: 5px"
                      width="200px"
                      height="100px">
                <v-img
                        :src="backgroundImgs[imgIter]"
                        width="100%"
                        height="100%">
                </v-img>
              </v-card>
              <v-btn icon @click="next">
                <v-icon style="color: teal">mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-expand-transition>
        </v-tab-item>
      </v-tabs-items>
      <v-divider style="margin-top: 10px"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
                color="primary"
                text
                @click="changeSettings"
        >
          应用
        </v-btn>
        <v-btn
                color="warning"
                text
                @click="cancelChangeSetting"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "settingDialog",
    components: {},
    methods : {
      pickImg (img) {
        this.background = img
      },
      clickVBSwitch (switchName) {
        if (switchName === 'blur') {
          this.replaceSwitch = false
        } else {
          this.blurSwitch = false
        }
      },
      changeSettings () {
        this.oldBlurSwitch = this.blurSwitch
        this.oldReplaceSwitch = this.replaceSwitch
        this.oldImgIter = this.imgIter
        this.$emit('changeSettings', this.blurSwitch, this.replaceSwitch, this.backgroundImgs[this.imgIter])
        this.dialog = false
      },
      cancelChangeSetting () {
        this.blurSwitch = this.oldBlurSwitch
        this.replaceSwitch = this.oldReplaceSwitch
        this.imgIter = this.oldImgIter
        this.dialog = false
      },
      prev () {
        this.imgIter = (this.imgIter === 0) ? this.backgroundImgs.length - 1 : this.imgIter - 1
      },
      next () {
        this.imgIter = (this.imgIter === this.backgroundImgs.length - 1) ? 0 : this.imgIter + 1
      }
    },
    data () {
      return{
        dialog : false,
        tab : null,
        backgroundImgs : [
          'http://122.112.175.61:4446/static/images/bg_1.jpg',
          'http://122.112.175.61:4446/static/images/bg_2.jpg',
          'http://122.112.175.61:4446/static/images/bg_3.jpg',
          'http://122.112.175.61:4446/static/images/bg_4.jpg',
          'http://122.112.175.61:4446/static/images/bg_5.jpg'
        ],
        blurSwitch : false,
        oldBlurSwitch : false,
        replaceSwitch : false,
        oldReplaceSwitch : false,
        imgIter : 0,
        oldImgIter : 0,
      }
    }
  }
</script>

<style scoped>

</style>
