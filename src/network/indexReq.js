import request from './request';

// 首页数据
const getIndex = () => {
    return request.get('/homepage/block/page');

}
// 首页每日推荐歌单（要登陆）
const getRecommendList = () => {

    return request.get('/recommend/resource');
}
// 不用登陆推荐歌单
const getNonLoginRec = () => {

    return request.get('/personalized?limit=10');
}
// 首页推荐音乐
const getRecMusic = () => {

    return request.get('/personalized/newsong?limit=12');
}
// 获取 歌单 所有标签
const getMusicListTags = () => {
    return request.get('/playlist/highquality/tags');

}
// 获取净瓶歌单
const getMusicList = (params) => {

    return request.get('/top/playlist/highquality', { params });
}
// 获取歌曲url
const getMusicUrl = (params) => {
    let cookie = localStorage.getItem("cookie")
    if (cookie) {
        params.cookie = cookie;
    }
    return request.get('/song/url', { params });
}
// 获取歌曲详情数据
export const getMusicListDetail = (params) => {
    return request.get('/playlist/detail', { params });
}
// 获取歌单是否被收藏
export const getDynamicList = (params) => {

    return request.get('/playlist/detail/dynamic', { params });
}

// 获取 歌手列表
export const getSingerList = (params) => {
    return request.get('/artist/list', { params });
}



export default {
    getIndex,
    getMusicList,
    getMusicListTags,
    getMusicUrl,
    getRecMusic,
    getRecommendList,
    getNonLoginRec
}