import request from './request';

// 获取歌曲评论
export const getSongComments = (params) => {
    return request.get('/comment/music', { params });
}
// 获取 歌曲封面 等详情
export const getMusicDetail = (params) => {

    return request.get('/song/detail', { params });
}
// 获取 歌词
export const getGeci = (params) => {

    return request.get('/lyric', { params });
}

const isCookie = function () {
    let cookie = localStorage.getItem("cookie")
    if (cookie) {
        return true;
    } else {
        return false;
    }
}
// 喜欢歌曲
export const like = (params) => {

    return request.get('/like', { params });

}

// 喜欢歌曲列表的id数组

export const getlikeList = (params) => {

    return request.get('/likelist', { params });

}
