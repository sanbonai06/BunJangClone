const res = require('express/lib/response');

module.exports = function (app) {
    const wish = require('./wishController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 상품 찜 등록 API
    app.post('/api/wishes/:itemId', jwtMiddleware, wish.createWish);

    // 2. 상품 찜 삭제 API
    app.patch('/api/wishes/:itemId', jwtMiddleware, wish.deleteWish);

    // 3. 상품 찜 목록 API
    app.get('/api/wishes', jwtMiddleware, wish.readWish);
};
