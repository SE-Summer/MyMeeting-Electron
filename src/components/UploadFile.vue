<template>
  <div class="file-card">
    <v-container>
      <v-row>
        <v-col cols="1">
          <v-badge
              bordered
              color="success"
              icon="mdi-check"
              overlap
              :value="uploaded"
          >
            <v-icon color="teal" size="40px">mdi-{{icon}}</v-icon>
          </v-badge>
        </v-col>
        <v-col cols="7">
          <p class="file-card-text"> {{this.file.name}} </p>
        </v-col>
        <v-col align="right" cols="2">
          <p class="file-card-progress"> {{this.progress}}% </p>
        </v-col>
        <v-col align="center" cols="2">
          <v-btn text @click="upload" color="teal" :loading="uploading" v-show="!uploaded"> 重新上传 </v-btn>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-progress-linear v-model="progress" color="teal">
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import FormData from "form-data";

export default {
  name: "UploadFile",
  data(){
    return{
      progress : 0,
      icon : 'close',
      uploaded : false,
      uploading : false,
    }
  },
  props : ['message', 'file'],
  methods:{
    async upload(){
      let url = this.GLOBAL.baseURL + '/file?token=' + this.GLOBAL.userInfo.token;
      this.progress = 0;
      this.uploaded = false;
      this.uploading = true;
      console.log(this.file);
      const formData = new FormData();
      formData.append('file', this.file);
      try {
        const response = await axios({
          method: "post",
          url,
          data: formData,
          headers:{'Content-Type': 'multipart/form-data'},
          onUploadProgress: (evt) => {
            this.progress = ((evt.loaded / evt.total) * 100).toFixed(2);
          }
        })
        console.log(response);
        this.uploaded = true;
        this.uploading = false;
        this.$emit('file-sended', response.data, this.file)
      }catch(error){
        console.error(error)
        this.uploading = false;
      }
    }
  },
  mounted() {
    this.upload();
    this.icon = "file-"+ this.file.type.split('/')[0] +"-outline";
  }
}
</script>

<style scoped>
.file-card{
  background: white;
  border-radius: 10px;
  border: 3px solid teal;
  margin: 15px 0;
}
.file-card-text{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 24px;
  color: #00796B;
  padding: 0;
  width: 300px;
  margin: 0;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.file-card-progress{
  font-family: "Microsoft YaHei UI", serif;
  font-size: 14px;
  color: #00796B;
  padding: 0;
  margin: 6px 0 0 0;
  text-align: right;
}
</style>