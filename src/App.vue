<template>
  <div id="app">
    <van-uploader
      v-model="fileList"
      multiple
      :max-count="2"
      :after-read="afterRead"
    />
    <van-button type="primary">主要按钮</van-button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios';
import utils from './utils';
import config from './config'
import * as qiniu from 'qiniu-js'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      uploadFile: {},
      formData: {},
      fileList: []
    }
  },
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
      axios.get('/api/upload/upload-token')
        .then(({ data }) => {
          console.log(data);
          this.fileList.forEach(i => {
            //七牛信息
            const qiniuUploadInfo = {
              file: i.file, //文件对象
              key: i.file.name, //文件资源名称
              token: data.token, //从后端获取的uplodaToken
            }
            const putExtra = {
              fname: i.file.name, // 文件原文件名
              params: {}, // 用来放置自定义变量
              mimeType: null // 用来限制上传文件类型，为 null 时表示不对文件类型限制；eg: ["image/png", 	  "image/jpeg"]
            }
            const config = {
              useCdnDomain: true,//cdn加速
              region: qiniu.region.z2 //区域
            }
            const observable = qiniu.upload(
              qiniuUploadInfo.file,
              qiniuUploadInfo.key,
              qiniuUploadInfo.token,
              putExtra,
              config
            )
            //上传开始
            observable.subscribe({
              next(res) {
                console.log('next', res)
              },
              error(err) {
                console.log('err', err)
              },
              complete(res) {//来到这里就是上传成功了。。
                console.log('complete', res)
              }
            })
          })

        })
    },
    uploadFileFunc() {
      console.log(1111);
      let files = this.$refs.upload.files;
      files = Array.from(files);
      axios.get('/api/upload/upload-token')
        .then(({ data }) => {
          console.log(data);
          files.forEach(element => {
            let formdata = new FormData()
            formdata.append('file', element);
            const observable = qiniu.upload(formdata, Date.now(), data.token, { fname: element.name, mimeType: element.type, }, { upprotocol: 'http' })
            const subscription = observable.subscribe({
              next(res) {
                // ...
              },
              error(err) {
                // ...
              },
              complete(res) {

                console.log("上传成功" + res);
              }
            }) // 上传开始
          });

        })


    }
  },
}
</script>

<style>
</style>
