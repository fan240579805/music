import axios from 'axios'
import { Message, Loading } from 'element-ui' //项目已经全局引入element的话可以不单独引入

let loading = null //定义loading变量

const request = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
    withCredentials: true
})


//axios拦截器
// (1)请求拦截器，一般用于config不符合服务器的要求时，要对config进行一些变化，如请求头
// (2)用于给每次发送网络请求，都加上一个加载中的样式 loading...
request.interceptors.request.use(config => {//拦截config


    loading = Loading.service({
        lock: true,
        text: '加载中……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0,.0)',
        customClass: 'asd'
    })

    return config//将config返回去
}, err => {
    //console.log(err);
});

//响应拦截器     ----- 拦截之后一定记得返回，否则无法获取
request.interceptors.response.use(res => {//拦截相应的结果result
    // console.log(res);
    loading.close();
    return res;//将result返回去
}, err => {
    console.log('interceptors：' + err);
})

export default request