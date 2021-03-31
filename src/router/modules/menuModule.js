const menuRouters = [

    {
        path: '/friends',
        name: 'friends',
        component: () => import('views/friends/friends.vue')
    },
    {
        path: '/zhibo',
        name: 'zhibo',
        component: () => import('views/zhibo/zhibo.vue')
    },
    {
        path: '/FM',
        name: 'FM',
        component: () => import('views/FM/FM.vue')
    },
    {
        path: '/download',
        name: 'download',
        component: () => import('views/download/download.vue')
    },
    {
        path: '/local_music',
        name: 'local_music',
        component: () => import('views/local_music/local_music.vue')
    },
    {
        path: '/video',
        name: 'video',
        component: () => import('views/video/video.vue')
    }

]


export default menuRouters;