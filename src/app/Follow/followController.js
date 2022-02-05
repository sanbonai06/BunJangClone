const jwtMiddleware = require('../../../config/jwtMiddleware');
const followProvider = require('./followProvider');
const followService = require('./followService');
const userProvider = require('../User/userProvider');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

const createFollow = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const followUser = req.body.follow;

    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    if(userId != userIdFromJWT) {
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));
    }

    if(!followUser) {
        return res.send(response(baseResponse.BODY_EMPTY));
    }

    if(userId == followUser) {
        return res.send(response(baseResponse.ERROR_SELF_FOLLOW));
    }

    const getFollowResult = await followProvider.checkFollow(userId, followUser);

    if(getFollowResult.length > 0) {
        return res.send(response(baseResponse.ALEREDY_FOLLOW));
    }
    const createFollowResult = await followService.postFollow(userId, followUser);

    return res.send(createFollowResult);
}

const readFollow = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;

    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
    
    const readFollowResult = await followProvider.getFollow(userIdFromJWT);
    if(readFollowResult.length < 1) {
        return res.send(response(baseResponse.EMPTY_FOLLOW));
    }

    const resultArr = [];
    let idx = 0;

    while(readFollowResult[idx]) {
        const countItem = await userProvider.getCountItem(readFollowResult[idx].follow_to);
        const countFollower = await followProvider.getCountFollower(readFollowResult[idx].follow_to);
        const getItemResult = await followProvider.getItemByShop(readFollowResult[idx].follow_to);
        const inputArr = {
            userId: readFollowResult[idx].follow_to,
            shopName: readFollowResult[idx].shop_name,
            howManyItem: countItem[0].countItem,
            howManyFollowers: countFollower[0].countFollower,
            getItemResult
        }
        resultArr.push(inputArr);
        idx = idx + 1;
    }
    console.log(resultArr);
    
    return res.send(response(baseResponse.SUCCESS, resultArr));
 }

 const deleteFollow = async (req, res) => {
     const userIdFromJWT = req.verifiedToken.userId;
     const userId = req.params.userId;
     const toDelete = req.body.delete;

     if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    if(userId != userIdFromJWT) {
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));
    }

    const followList = await followProvider.checkFollow(userId, toDelete);
    
    if(followList.length < 1) {
        return res.send(response(baseResponse.NOT_FOLLOW));
    }

    const deleteFollowResult = await followService.deleteFollowUser(userId, toDelete);

    return res.send(response(deleteFollowResult));
 }

 const readFollower = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    
    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const readFollowerResult = await followProvider.getFollower(userIdFromJWT);
    if(readFollowerResult.length < 1) {
        return res.send(response(baseResponse.EMPTY_FOLLOWER));
    }
    
    const resultObject = {
        followerInfo: readFollowerResult
    }

    return res.send(response(baseResponse.SUCCESS, resultObject));
 }

 const createBrandFollow = async (req, res) => {
     const userIdFromJWT = req.verifiedToken.userId;
     const brandId = req.params.brandId;

     if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const getBrandResult = await followProvider.getBrand(brandId);

    if(getBrandResult.length < 1) {
        return res.send(response(baseResponse.EMPTY_BRAND));
    }

    const getBrandFollowResult = await followProvider.checkBrandFollow(userIdFromJWT, brandId);

    if(getBrandFollowResult.length > 0) {
        return res.send(response(baseResponse.ALEREDY_FOLLOW));
    }
    const createBrandFollowResult = await followService.postBrandFollow(userIdFromJWT, brandId);

    return res.send(createBrandFollowResult);
 }

 const deleteBrandFollow = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const brandId = req.params.brandId;

    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const getBrandResult = await followProvider.getBrand(brandId);

    if(getBrandResult.length < 1) {
        return res.send(response(baseResponse.EMPTY_BRAND));
    }

    const getBrandFollowResult = await followProvider.checkBrandFollow(userIdFromJWT, brandId);

    if(getBrandFollowResult.length < 1) {
        return res.send(response(baseResponse.EMPTY_BRAND_FOLLOW));
    }

    const deleteBrandFollowResult = await followService.deleteBrandFollow(userIdFromJWT, brandId);

    return res.send(deleteBrandFollowResult);

}

const readBrandFollow = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;

    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const readBrandFollowResult = await followProvider.getBrandFollow(userIdFromJWT);

    if(readBrandFollowResult.length < 1) {
        return res.send(response(baseResponse.EMPTY_BRAND_FOLLOW));
    }

    
    const resultArr = [];
    let idx = 0;
    while(readBrandFollowResult[idx]) {
        const countBrandItem = await followProvider.getCountBrandItem(readBrandFollowResult[idx].brand_id);
        const inputArr = {
            brandId: readBrandFollowResult[idx].brand_id,
            brandName: readBrandFollowResult[idx].name,
            howManyItem: countBrandItem[0].counterBrandItem
        }
        resultArr.push(inputArr);
        idx = idx + 1;
    }

    return res.send(response(baseResponse.SUCCESS, resultArr));

}

const readBrand = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;

    if(!userIdFromJWT) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const readBrandResult = await followProvider.getTotalBrand();
    console.log(readBrandResult);
    const resultArr = [];
    
    let idx = 0;
    while(readBrandResult[idx]) {
        const inputArr = {
            brandId: readBrandResult[idx].brand_id,
            brandName: readBrandResult[idx].name,
            countItem: readBrandResult[idx].countItem
        }
        resultArr.push(inputArr);
        idx = idx + 1;
    }

    return res.send(response(baseResponse.SUCCESS, resultArr))

}
module.exports = {
    createFollow, // 1. 상점 팔로우 API
    deleteFollow,   // 2. 상점 팔로우 삭제 API
    readFollow,   // 3. 상점 팔로잉 목록 API
    readFollower,   // 4. 나의 팔로워 목록 API
    createBrandFollow,  // 5. 브랜드 팔로우 API
    deleteBrandFollow,  // 6. 브랜드 팔로우 취소 API
    readBrandFollow,
    readBrand
};
