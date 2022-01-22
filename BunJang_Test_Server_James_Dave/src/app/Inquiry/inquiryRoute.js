const res = require('express/lib/response');
module.exports = function (app) {
    const inquiry = require('./inquiryController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 문의 작성
    app.post('/api/inquiry/:itemId', jwtMiddleware, inquiry.postInquiry);

    // 2. 문의 삭제
    app.patch('/api/inquiry/:inquiryId', jwtMiddleware, inquiry.deleteInquiry);

    // 3. 문의 조회
    app.get('/api/inquiry/:itemId', inquiry.getInquiry);
};
