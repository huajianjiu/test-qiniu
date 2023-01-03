import * as qiniu from 'qiniu-js'
import config from './config';
import {v5 as uuidv5} from 'uuid'

const utils={
    getFileSuffixName(name){
        return name.split('.').pop();
    },
    /**
     * @description 创建uuid文件名
     * @param {String} fileName 
     * @param {String} type 
     * @returns 
     */
    createFileNameByUUID(fileName){
        let type = fileName.split('.').pop();
        fileName = fileName+Date.now();
        let name = uuidv5(fileName,config.MY_NAMESPACE)+"."+type;
        name=name.replace(/-*/g,"");
        return name;
    },
}
export default utils;