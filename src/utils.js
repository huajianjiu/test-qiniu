import * as qiniu from 'qiniu-js'
const utils={
    getFileSuffixName(name){
        return name.split('.').pop();
    },
    
}
export default utils;