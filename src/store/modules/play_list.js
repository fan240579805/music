export default {
    state: {
        playList: []
    },
    mutations: {
        // 增加歌曲到播放列表
        AddPlayList(state, playItem) {
            /**
             * ！！！将传进来的对象 进行深拷贝之后再 推入数组，
             * 这样子getters才能完全响应式 更新 数组对象状态，否则不能响应式
             * */
            let playObj = JSON.parse(JSON.stringify(playItem));
            state.playList.push(playObj);
        },
        // 改变歌曲状态，播放列表应该 播放哪首歌
        // 将所有 除了刚刚点击的歌曲和新加入之外的 歌曲 willPlayFlag 全部置为 false
        ChangeMusicStatus(state, id) {
            state.playList.forEach((v) => {
                if (v.id === id) {
                    v.willPlayFlag = true;
                } else {
                    v.willPlayFlag = false;
                }
            })
        },
        // clear播放列表
        clearList(state) {
            state.playList = [];
        },
        // 更新播放列表 为别的歌单或榜单
        changeList(state, newList) {
            state.playList = [];
            newList.forEach(newListItem => {

                newListItem.willPlayFlag = false;

                // 一定要深拷贝
                let deepItem = JSON.parse(JSON.stringify(newListItem));
                state.playList.push(deepItem);
            });
        }
    },
    getters: {
        // 获取播放列表
        GetPlayList(state) {
            return state.playList;
        },
        // 播放列表长度
        PlayListLength(state) {
            return state.playList.length;
        },
        // 找到 标记为true 代表他是要播放的歌曲 结构体
        willPlayMusicItem(state) {
            // 播放列表中有值 才 返回
            if (state.playList.length !== 0) {
                return state.playList.find(v => v.willPlayFlag === true);
            } else {
                return null;
            }
        },


    },
    actions: {
        AddPlayListAction(context, playload) {
            // 判断 播放列表是否已经存在 该首歌曲 ，存在的话则返回
            let index = context.state.playList.findIndex(v => v.id === playload.id);
            if (index === -1) {
                // 不存在该首歌曲 ，添加进数组
                playload.willPlayFlag = true;
                context.commit('AddPlayList', playload);
                context.commit('ChangeMusicStatus', playload.id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
            } else {
                // 存在该歌曲 ， 改变其播放状态
                if (context.state.playList[index].willPlayFlag) {
                    // 这首歌正在播放 ，直接返回，不要占用内存
                    return;
                }
                context.commit('ChangeMusicStatus', playload.id);// 存在的旧歌曲被点击 播放他，其他歌曲willPlayFlag置为false
                return;
            }


        },
        // 改变播放列表正在播放的歌曲
        changePlaylistPlayingMusic(context, id) {
            context.commit('ChangeMusicStatus', id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
        },
        // 切换歌曲
        takeChangeMusic(context, playload) {
            let id = playload.id;
            let OpreateStatus = playload.OpreateStatus;
            // 根据id找到当前这首歌的index
            // 通过index -1 +1 来执行上一首还是下一首
            let index = context.state.playList.findIndex(v => v.id === id);

            if (context.getters.PlayListLength === 1) {
                console.log("只有一首歌");
                return;
            }
            if (index === 0) {
                // index =0 说明是第一首歌，点击下一首按钮，找到前面一首的歌id 更改他的play状态 
                // 点击 上一首按钮则找到 播放列表最后一首歌曲id 更改其 play状态
                if (OpreateStatus) {
                    // OpreateStatus 为true 说明是想播放下一首 ，找到index+1的 id并更改
                    context.commit('ChangeMusicStatus', context.state.playList[index + 1].id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
                    return;
                } else {
                    //OpreateStatus 为false 说明是想播放上一首 ，找到末尾index的 id并更改
                    let playListEndIndex = context.getters.PlayListLength - 1;// 末尾index
                    context.commit('ChangeMusicStatus', context.state.playList[playListEndIndex].id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
                    return;
                }
            }
            if (index === context.getters.PlayListLength - 1) {
                // 当前在播放列表最后一首歌
                if (OpreateStatus) {
                    // OpreateStatus 为true 说明是想播放下一首 ，找到第一首index=0的 id并更改
                    context.commit('ChangeMusicStatus', context.state.playList[0].id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
                    return;
                } else {
                    //OpreateStatus 为false 说明是想播放上一首 ，找到上一首index-1的 id并更改
                    context.commit('ChangeMusicStatus', context.state.playList[index - 1].id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
                    return;
                }
            }
            // 除了列表首尾 和只有一首歌的情况
            if (OpreateStatus) {
                // OpreateStatus 为true 说明是想播放下一首 ，找到第一首index+1的 id并更改
                context.commit('ChangeMusicStatus', context.state.playList[index + 1].id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
                return;
            } else {
                //OpreateStatus 为false 说明是想播放上一首 ，找到上一首index-1的 id并更改
                context.commit('ChangeMusicStatus', context.state.playList[index - 1].id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
                return;
            }


        },

        // 清空播放列表
        clearMusicList(context) {
            context.commit('clearList');
        },
        // 更改播放列表
        AddAllRankMusicList(context, list) {
            context.commit('changeList', list);
            // 更改完成之后将 新列表的第一首歌 置为True
            context.commit('ChangeMusicStatus', list[0].id);// 新歌变为将要播放 ，旧歌曲willPlayFlag置为false
        }
    },
}