const res = require('express/lib/response');

module.exports = function (app) {
    const follow = require('./followController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 상점 팔로우 API
    app.post('/api/follow/users/:userId', jwtMiddleware, follow.createFollow);

    // 2. 상점 팔로우 취소 API
    app.patch('/api/follow/users/:userId', jwtMiddleware, follow.deleteFollow);

    // 3. 상점 팔로잉 목록 API
    app.get('/api/follow/users/following', jwtMiddleware, follow.readFollow);

    // 4. 나의 팔로워 목록 API
    app.get('/api/follow/users/follower', jwtMiddleware, follow.readFollower);

    // 5. 브랜드 팔로우 API
    app.post('/api/follow/brands/:brandId', jwtMiddleware, follow.createBrandFollow);

    // 6. 브랜드 팔로우 취소 API
    app.patch('/api/follow/brands/:brandId', jwtMiddleware, follow.deleteBrandFollow);

    // 7. 팔로우한 브랜드 목록 API
    app.get('/api/follow/brands/following', jwtMiddleware, follow.readBrandFollow);

    // 8. 전체 브랜드 목록 API
    app.get('/api/follow/brands', jwtMiddleware, follow.readBrand);
};
