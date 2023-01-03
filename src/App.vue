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
      fileList: [],
      imageList: [],
    }
  },
  watch: {
    'imageList.length': {
      handler(newValue, oldValue) {
        console.log("变化");
        if (newValue == this.fileList.length&&newValue!=0) {
          // 发送项目名称
          axios.post('/api/upload/upload-urls',{imageList:this.imageList})
        }
      }
    }
  },
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      axios.get('/api/upload/upload-token')
        .then(({ data }) => {
          data = data.data;
          // console.log();
          // console.log(data.token);
          this.fileList.forEach(i => {
            let that = this;
            i.status = "uploading";
            i.message = "上传中..."
            //七牛信息
            const qiniuUploadInfo = {
              file: i.file, //文件对象
              key: utils.createFileNameByUUID(i.file.name), //文件资源名称
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
                // console.log('next', res)
              },
              error(err) {
                i.status = "fail";
                i.message = "上传失败"
                console.log('err', err)
              },
              complete(res) {//来到这里就是上传成功了。。
                i.status = "success";
                i.message = ""
                that.imageList.push({ key: res.key});
              }
            })
          })
          // 
        })
    }
  },
}
</script>

<style>
</style>
