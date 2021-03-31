import request from './request';

// 获取搜索记录
export const search = (params) => {
    return request.get('/search', { params });
}
// 热搜榜
export const GetHotList = () => {
    return request.get('/search/hot/detail');
}

