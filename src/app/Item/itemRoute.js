const res = require('express/lib/response');
const upload = require('../../../config/multer');

module.exports = function (app) {
    const item = require('./itemController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 상품등록 API (+ 태그, 상품이미지 등)
    app.post('/api/items', jwtMiddleware, upload.uploadItem.array('image', 12), item.postItems);
    // 2. 상품수정 API
    app.put('/api/items/:itemId', jwtMiddleware, upload.uploadItem.array('image', 12), item.putItems);
    // 3. 상품삭제 API
    app.patch('/api/items/:itemId', jwtMiddleware, item.patchItems);
    // 4. 판매상태 변경
    app.patch('/api/items/:itemId/sales/:status', jwtMiddleware, item.patchItemSell);

    // 5. 상품 상세 페이지
    app.get('/api/items/:itemId', jwtMiddleware, item.getItemInfo);
    // 6. 상품 찜한 사람 목록
    app.get('/api/items/:itemId/wishes', jwtMiddleware, item.getItemWishes);

    // 7-1. 상품 검색 (검색어 추천) qs: search
    app.get('/api/items/retrieve/pre', item.getItemsBySearch);
    // 7-2. 상품 검색 디폴트
    app.get('/api/items/retrieve/default', item.readItemsByDefault);
    // 7-3. 상품 검색 필터
    app.get('/api/items/retrieve/filter', item.getItemsByFilter);

    // 8. 추천 상품 목록 (전체 상품 목록 + 조회수 순으로 정렬)
    app.get('/api/items/main/recommends', item.getItemsByCount);
    // 9. 카테고리별 상품 목록
    app.get('/api/items/category/:categoryId', item.getItemsByCategory);
    // 10. 브랜드별 상품 목록
    app.get('/api/items/brand/:brandId', item.getItemsByBrand);
};
