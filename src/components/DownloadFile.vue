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
              :value="downloaded"
          >
          <v-icon color="teal" size="40px">mdi-{{icon}}</v-icon>
          </v-badge>
        </v-col>
        <v-col cols="7">
          <p class="file-card-text"> {{this.message.filename}} </p>
        </v-col>
        <v-col align="right" cols="2">
          <p class="file-card-progress"> {{this.progress}}% </p>
        </v-col>
        <v-col align="center" cols="2">
          <v-btn text @click="download" color="teal" :loading="downloading"> {{downloaded?'重新下载':'下载'}} </v-btn>
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

export default {
  name: "DownloadFile",
  data(){
    return{
      progress : 0,
      icon : 'close',
      downloaded : false,
      downloading : false,
    }
  },
  props : ['message'],
  methods:{
    async download(){
      let url = this.message.fileURL;
      this.progress = 0;
      this.downloaded = false
      this.downloading = true
      try {
        const response = await axios({
          method: "get",
          url,
          responseType: "blob",
          onDownloadProgress: (evt) => {
            this.progress = ((evt.loaded / evt.total) * 100).toFixed(1);
          }
        })
        console.log(response);
        this.downloaded = true;
        this.downloading = false;
        const filename = this.message.filename;
        const blob = new Blob([response.data]);
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = decodeURIComponent(filename);
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
      }catch(error){
        console.error(error)
        this.downloading = false;
      }
    }
  },
  mounted() {
    this.icon = "file-"+ this.message.fileType.split('/')[0] +"-outline";
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