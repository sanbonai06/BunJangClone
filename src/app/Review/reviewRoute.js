const res = require('express/lib/response');
const upload = require('../../../config/multer');
module.exports = function (app) {
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 후기 작성
    app.post('/api/review/:dealId', jwtMiddleware, upload.uploadReview.array('image', 12), review.postReview);

    // 2. 후기 수정
    app.put('/api/review/:dealId', jwtMiddleware, review.updateReview);

    // 3. 후기 삭제
    app.patch('/api/review/:dealId', jwtMiddleware, review.patchReview);

    // 4. 상점 후기 목록
    app.get('/api/review/:userId', review.getReviews);

    // 5. 후기 답변 작성
    app.post('/api/review/answer/:reviewId', jwtMiddleware, review.createComment);

    // 6. 후기 답변 수정
    app.put('/api/review/answer/:commentId', jwtMiddleware, review.updateComment);

    // 7. 후기 답변 삭제
    app.patch('/api/review/answer/:commentId', jwtMiddleware, review.deleteComment);
};
