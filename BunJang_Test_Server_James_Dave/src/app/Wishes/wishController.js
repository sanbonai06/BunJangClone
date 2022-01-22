const jwtMiddleware = require('../../../config/jwtMiddleware');
const wishProvider = require('./wishProvider');
const wishService = require('./wishService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');
const { RDS } = require('aws-sdk');

const createWish = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = parseInt(req.params.itemId);
    
    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }

    const readItemResult = await wishProvider.getItemInfo(itemId);

    if(readItemResult[0].user_id === userIdFromJWT) {
        return res.send(errResponse(baseResponse.ERROR_SELF_WISH));
    }
    
    const readWishResult = await wishProvider.getWishByItem(userIdFromJWT, itemId);

    if(readWishResult.length > 0) {
        return res.send(errResponse(baseResponse.ERROR_WISH));
    }

    const createwishResult = await wishService.postWish(userIdFromJWT, itemId);

    return res.send(createwishResult);
    
}

const deleteWish = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const itemId = parseInt(req.params.itemId);

    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }

    const readWishResult = await wishProvider.getWishByItem(userIdFromJWT, itemId);

    if(!readWishResult.length) {
        return res.send(errResponse(baseResponse.ERROR_WISH));
    }
    const deleteWishResult = await wishService.deleteWish(userIdFromJWT, itemId);

    return res.send(deleteWishResult);

}

const readWish = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userIdFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE)); //3000
    }

    const readWishResult = await wishProvider.getWish(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, readWishResult));
}
module.exports = {
    createWish, // 1. 상품 찜 등록
    deleteWish, // 2. 상품 찜 삭제
    readWish,   // 3. 상품 찜 목록 가져오기
};
