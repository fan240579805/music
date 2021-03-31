import request from '../request';

// post 手机登录
export const phoneLogin = (params) => {
    return request.post('/login/cellphone', params);

}

// 登出
export const logout = () => {
    return request.get('/logout');

}
