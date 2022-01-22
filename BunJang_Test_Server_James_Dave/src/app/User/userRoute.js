module.exports = function (app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0 test API
    app.post('/api/test', user.test);

    // 1. 회원가입 API
    app.post('/api/users', user.postUsers);

    // 2. 로그인 API (JWT 생성)
    app.post('/api/auth/login', user.login);

    // 3. 자동로그인 API (JWT 검증)
    app.get('/api/auth/auto-login', jwtMiddleware, user.check);

    // 4. 상점 검색 API (qs : search)
    app.get('/api/users', user.getUsers);

    // 5. 특정 유저 조회 API (상점 조회)
    app.get('/api/users/:userId', jwtMiddleware, user.readUserInfo);

    // 6. 회원 정보 수정 API
    app.put('/api/users/:userId', jwtMiddleware, user.patchUsers);

    // 7. 계좌 등록 API
    app.post('/api/users/account/:userId', jwtMiddleware, user.postAccount);

    // 8. 계좌 수정 API
    app.put('/api/users/account/:userId', jwtMiddleware, user.patchAccount);

    // 9. 계좌 삭제 API
    app.patch('/api/users/account/:userId', jwtMiddleware, user.deleteAccount);

    // 10. 계좌 조회 API
    app.get('/api/users/account/:userId', jwtMiddleware, user.readAccount);

    // 11. 마이페이지 API
    app.get('/api/users/myPage/:userId', jwtMiddleware, user.readMyInfo);
};
