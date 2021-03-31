import request from './request';


const getAllRank = ()=>{
    return request.get('/toplist');
}

export const getRankMusicList = (params) => {
    return request.get('/playlist/detail',{params})
}

export const getArtistMusicList = (params) => {
    
    return request.get('/artist/songs',{params})
}
export default {
    getAllRank,
}