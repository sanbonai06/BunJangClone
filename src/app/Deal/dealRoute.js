const res = require('express/lib/response');

module.exports = function (app) {
    const deal = require('./dealController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 결제하기 API
    app.post('/api/deal/:itemId', jwtMiddleware, deal.createDeal);

    // 2. 구매내역 API
    app.get('/api/deal/buyer', jwtMiddleware, deal.readDealBuy);

    // 3. 판매내역 API
    app.get('/api/deal/seller', jwtMiddleware, deal.readDealSell);  //거래 안된 물건들도 보여주자 (item에서 끌고옴)

    // 4. 판매승인 API
    app.patch('/api/deal/:itemId/approve', jwtMiddleware, deal.approveDeal);

    // 5. 구매확정 API
    app.patch('/api/deal/:itemId/confirm', jwtMiddleware, deal.confirmDeal);
};
