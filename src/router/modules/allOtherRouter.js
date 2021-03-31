const otherRouters = [

    {
        path: '/musicList_detail',
        name: 'musicListD',
        component: () => import('views/music_list_detail/music_list_detail.vue')
    },
    {
        path: '/singer_detail',
        name: 'singerD',
        component: () => import('views/singer_detail/singer_detail.vue')
    },
    {
        path: '/album_detail',
        name: 'albumD',
        component: () => import('views/albumDetail/album_detail.vue')
    }

]


export default otherRouters;