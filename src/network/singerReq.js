import request from './request';

// 根据歌手id获取歌手详情数据
export const getSingerDetail = (params)=>{
    return request.get('/artist/detail',  { params });
}

// 获取歌手热门50 歌曲列表

export const getTop50Songs = (params)=>{
    return request.get('/artist/top/song',  { params });
}

// 获取歌手专辑
export const getAlbum = (params)=>{
    return request.get('/artist/album',  { params });
}

// 获取专辑详情
export const getAlbumDetail = (params)=>{
    return request.get('/album',  { params });
}


