const jwtMiddleware = require('../../../config/jwtMiddleware');
const itemProvider = require('./itemProvider');
const itemService = require('./itemService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

/**
 * API No. 1
 * API Name : 상품 등록 API
 * [POST] /api/items
 * body : reqExample.json 참고
 */
const postItems = async (req, res) => {
    const postBody = req.body; //클라에서 넘어온 값
    const userIdFromJWT = req.verifiedToken.userId;
    const postImage = req.files; // 이미지 파일
    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }

    const imageKey = [];
    if (postImage) {
        postImage.forEach((v) => {
            imageKey.push(v.key);
        });
    }
    const postItemsResponse = await itemService.createItem(postBody, userIdFromJWT, imageKey);
    return res.send(postItemsResponse);
};

/**
 * API No. 2
 * API Name : 상품 수정 API
 * [POST] /api/items/:itemId
 * body : reqExample.json 참고
 */
const putItems = async (req, res) => {
    const postBody = req.body; //클라에서 넘어온 값
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = req.params.itemId;
    const postImage = req.files; // 이미지 파일

    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }

    const imageKey = [];
    if (postImage) {
        postImage.forEach((v) => {
            imageKey.push(v.key);
        });
    }

    const postItemsResponse = await itemService.updateItem(postBody, userIdFromJWT, itemId, imageKey);
    return res.send(postItemsResponse);
};

/**
 * API No. 3
 * API Name : 상품 삭제 API
 * [PATCH] /api/items/:itemId
 */
const patchItems = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = req.params.itemId;

    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }

    const deleteItemsResponse = await itemService.deleteItem(itemId);
    return res.send(deleteItemsResponse);
};

/**
 * API No. 4
 * API Name : 판매상태 - 판매중
 * [PATCH] /api/items/:itemId/sales/:status
 */
const patchItemSell = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = req.params.itemId;
    const sale = req.params.status;
    console.log(userIdFromJWT, itemId, sale);
    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }
    if (sale == 'Sale' || sale == 'Reserved' || sale == 'Sold') {
        const patchItemsSellResponse = await itemService.setItemSale(itemId, sale);
        return res.send(patchItemsSellResponse);
    } else {
        return res.send(errResponse(baseResponse.SALE_STATUS_WRONG)); //2301
    }
};

/**
 * API No. 5
 * API Name : 상품 상세 페이지
 * [GET] /api/items/:itemId/
 */
const getItemInfo = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = req.params.itemId;
    console.log(itemId);

    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }
    if (!itemId) {
        return res.send(errResponse(baseResponse.PATH_VARIABLE_EMPTY));
    }

    const getItemInfoResponse = await itemProvider.readItemInfo(itemId);
    return res.send(getItemInfoResponse);
};

/**
 * API No. 6
 * API Name : 상품 찜한 사람 목록
 * [GET] /api/items/:itemId/wishes
 */
const getItemWishes = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = req.params.itemId;

    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }

    const getItemWishesResponse = await itemProvider.retrieveItemWishes(itemId);
    return res.send(response(baseResponse.SUCCESS, getItemWishesResponse));
};

/**
 * API No. 7-1
 * API Name : 상품 검색 검색어추천
 * [GET] /api/items/retrieve/pre?search=
 */
const getItemsBySearch = async (req, res) => {
    const searchFor = req.query.search;
    if (searchFor == null || searchFor == '') {
        return res.send(errResponse(baseResponse.SEARCH_QUERY_EMPTY));
    }
    const getItemsBySearchResponse = await itemProvider.retrieveItemList(searchFor);
    return res.send(response(baseResponse.SUCCESS, getItemsBySearchResponse));
};

const readItemsByDefault = async (req, res) => {
    const searchFor = req.query.search;
    const limit = req.query.limit;
    const offset = req.query.offset;

    if (searchFor == null || searchFor == '') {
        return res.send(errResponse(baseResponse.SEARCH_QUERY_EMPTY));
    }
    if (!limit || !offset) {
        return res.send(response(baseResponse.QUERY_STRING_EMPTY));
    }

    const readItemsByDefaultResult = await itemProvider.getItemsByDefault(searchFor, limit, offset);
    return res.send(response(baseResponse.SUCCESS, readItemsByDefaultResult));
};
/**
 * API No. 7-3
 * API Name : 상품 검색 필터
 * [GET] /api/items/retrieve/filter?search=&filter=&limit=&offset
 */
const getItemsByFilter = async (req, res) => {
    const searchFor = req.query.search;
    const limit = req.query.limit;
    const offset = req.query.offset;
    const filter = req.query.filter;
    console.log(filter);

    if (searchFor == null || searchFor == '') {
        return res.send(errResponse(baseResponse.SEARCH_QUERY_EMPTY));
    }
    if (!limit || !offset) {
        return res.send(response(baseResponse.QUERY_STRING_EMPTY));
    }
    const getItemsByFilterResponse = await itemProvider.retrieveFilterList(searchFor, filter, limit, offset);
    return res.send(response(baseResponse.SUCCESS, getItemsByFilterResponse));
};

/**
 * API No. 8
 * API Name : 추천 상품 목록
 * [GET] /api/items/main/&limit=&offset=
 */
const getItemsByCount = async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    console.log(limit, offset);
    if (!limit || !offset) {
        console.log(limit, offset);
        return res.send(response(baseResponse.QUERY_STRING_EMPTY));
    }

    const getItemsByCountResponse = await itemProvider.readItemsByCount(parseInt(limit), parseInt(offset));
    return res.send(response(baseResponse.SUCCESS, getItemsByCountResponse));
};

/**
 * API No. 9
 * API Name : 카테고리별 상품 목록
 * [GET] /api/items/:categoryId/&limit=&offset=
 */
const getItemsByCategory = async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const categoryId = req.params.categoryId;
    if (!limit || !offset) {
        return res.send(response(baseResponse.QUERY_STRING_EMPTY));
    }

    const getItemsByCategoryResponse = await itemProvider.readItemsByCategory(categoryId, parseInt(limit), parseInt(offset));
    return res.send(getItemsByCategoryResponse);
};

/**
 * API No. 10
 * API Name : 브랜드별 상품 목록
 * [GET] /api/items/main/:brandId/&limit=&offset=
 */
const getItemsByBrand = async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const brandId = req.params.brandId;

    if (!limit || !offset) {
        return res.send(response(baseResponse.QUERY_STRING_EMPTY));
    }

    const getItemsByBrandResponse = await itemProvider.readItemsByBrand(brandId, parseInt(limit), parseInt(offset));
    return res.send(response(baseResponse.SUCCESS, getItemsByBrandResponse));
};

module.exports = {
    postItems, // 1. 상품 등록
    putItems, // 2. 상품 수정
    patchItems, // 3. 상품 삭제
    patchItemSell, // 4. 판매상태 - 판매중/예약됨/판매 완료
    getItemInfo, // 5. 상품 상세페이지
    getItemWishes, // 6. 상품 찜한 사람 목록

    getItemsBySearch,
    getItemsByFilter,
    getItemsByCount, //8. 추천 상품 목록
    getItemsByCategory, // 9. 카테고리별 상품 목록
    getItemsByBrand, // 10. 브랜드별 상품 목록
    readItemsByDefault,
};
