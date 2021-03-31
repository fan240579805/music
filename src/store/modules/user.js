export default {
    state: {
        loginStatus: false, // 标记是否登录
        showLoginFlag: false,// 用来操作控制登陆窗口是否显示
        userProfile: {

        },
        cookie: ""
    },
    getters: {
        getFlag(state) {
            return state.showLoginFlag;
        },
        getLoginStatus(state) {
            return state.loginStatus;
        },
        getProfile(state) {
            return state.userProfile;
        },
        getLoginStatus(state) {
            return state.loginStatus;
        },
        getCookie(state) {
            return state.cookie
        }
    },
    mutations: {
        // 更改登录框显示状态
        changeFlag(state) {
            state.showLoginFlag = !state.showLoginFlag;
        },
        // 设置cookie
        setCookie(state, cookie) {
            state.cookie = cookie;
        },
        // 设置个人信息
        setProfile(state, profileObj) {
            state.userProfile = { ...profileObj };
        },
        // 改变登陆状态
        changeLoginStatus(state) {
            state.loginStatus = !state.loginStatus;
        },
        // 登出清空状态
        clearStatus(state) {
            state.loginStatus = false; // 标记是否登录
            state.showLoginFlag = false;// 用来操作控制登陆窗口是否显示
            state.userProfile = {

            };
        }
    },
    actions: {
    },
    modules: {
    }
}