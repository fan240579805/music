import request from '../request';

let cookie
const hasCookie = function () {
    let Cookie = localStorage.getItem("cookie");
    if (Cookie) {
        cookie = Cookie;
    }
    return cookie;
}


// 获取用户收藏/创建的歌单
export const getUsersMusicList = (params) => {
    if (hasCookie) {
        params.cookie = hasCookie();
    }
    return request.get('/user/playlist',{params})

}