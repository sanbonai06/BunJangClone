const jwtMiddleware = require('../../../config/jwtMiddleware');
const userProvider = require('../../app/User/userProvider');
const userService = require('../../app/User/userService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

const test = async (req, res) => {
    console.log('test중');
    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /api/users
 */
const postUsers = async (req, res) => {
    const { social_id, name, social_info, shop_name } = req.body;

    // Validation 처리
    const signUpResponse = await userService.createUser(social_id, name, social_info, shop_name);

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /api/auth/login
 * body : social_info, social_id, name
 */
const login = async (req, res) => {
    const { social_info, social_id, name } = req.body;
    if (!social_info || !social_id || !name) return res.send(response(baseResponse.BODY_EMPTY));
    if (typeof social_info != 'string' || typeof social_id != 'string' || typeof name != 'string') {
        return res.send(response(baseResponse.BODY_WRONG));
    }

    const signInResponse = await userService.postSignIn(social_info, social_id, name);
    return res.send(signInResponse);
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
const check = async (req, res) => {
    const userIdResult = req.verifiedToken.userId;
    console.log(`${userIdResult}님이 로그인 하셨습니다`);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/**
 * API No. 4
 * API Name : 상점 검색 API (이름으로 검색)
 * [GET] /app/users
 */
const getUsers = async (req, res) => {
    /**
     * Query String: 이름
     */
    const shop_name = req.query.search;

    if (!shop_name) {
        // Emtpy Error
        return res.send(response(baseResponse.QUERY_STRING_EMPTY));
    } else {
        // 유저 검색 조회
        const shopListResult = await userProvider.retrieveShopList(shop_name);
        if (shopListResult.length < 1) return res.send(response(baseResponse.SUCCESS, '검색된 상점이 없습니다.'));
        return res.send(response(baseResponse.SUCCESS, shopListResult));
    }
};

/**
 * API No. 5
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
const getUserById = async (req, res) => {
    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};

/**
 * API No. 6
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
const patchUsers = async (req, res) => {
    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const { image, shop_name, shop_url, shop_time, shop_introduce, shop_policy, shop_notice } = req.body;

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (shop_name === null || shop_url === null || shop_time === null) {
        return res.send(response(baseResponse.OPTION_IS_NOT_NULL));
    }

    const changeUserInfoResult = await userService.changeUserInfo(
        userId,
        image,
        shop_name,
        shop_url,
        shop_time,
        shop_introduce,
        shop_policy,
        shop_notice
    );

    return res.send(changeUserInfoResult);
};

const postAccount = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const { name, bank, account_num } = req.body;
    let for_sale = 1;
    let for_return = 1;
    if (userId != userIdFromJWT) {
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));
    }

    const readAccountRow = await userProvider.retrieveAccountByUserId(userId);

    if(readAccountRow.length >= 2) {
        return res.send(response(baseResponse.MANY_ACCOUNT));
    }
    if (readAccountRow.length === 1) {
        readAccountRow[0].for_sale === 1 ? (for_sale = 0) : (for_sale = 1);
        readAccountRow[0].for_return === 1 ? (for_return = 0) : (for_return = 1);
    }
    const postAccountResult = await userService.createAccount(userIdFromJWT, name, bank, account_num, for_sale, for_return);

    return res.send(postAccountResult);
};

const patchAccount = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const { changeAccountNum, name, bank, account_num } = req.body;
    const readAccountRow = await userProvider.retrieveAccountByAccountNum(changeAccountNum);
    const readAccountByUserIdRow = await userProvider.retrieveAccountByUserId(userId);

    if (userId != userIdFromJWT) {
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!readAccountRow.length) {
        return res.send(response(baseResponse.ERROR_ACCOUNTNUM));
    }

    let for_sale = 0;
    let for_return = 0;
    let accountRow = [];
    if (readAccountByUserIdRow.length === 2) {
        readAccountByUserIdRow[0].account_number == changeAccountNum ? accountRow = readAccountByUserIdRow[1] : accountRow = readAccountByUserIdRow[0];
        accountRow.for_sale === 1 ? (for_sale = 0) : (for_sale = 1);
        accountRow.for_return === 1 ? (for_return = 0) : (for_return = 1);
    } else {
        for_sale = 1;
        for_return = 1;
    }

    const patchAccountResult = await userService.updateAccount(userIdFromJWT, changeAccountNum, name, bank, account_num, for_sale, for_return);

    return res.send(patchAccountResult);
};

const deleteAccount = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const account_num = req.body.account_num;

    if (userId != userIdFromJWT) {
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));
    }

    const readAccountRow = await userProvider.retrieveAccountByAccountNum(account_num);

    if (!readAccountRow.length) {
        return res.send(response(baseResponse.ERROR_ACCOUNTNUM));
    }

    const deleteAccountResult = await userService.deleteAccountInfo(userIdFromJWT, account_num);

    return res.send(deleteAccountResult);
};

const readAccount = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (userId != userIdFromJWT) {
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));
    }
    const readAccountResult = await userProvider.retrieveAccountByUserId(userId);

    return res.send(response(baseResponse.SUCCESS, readAccountResult));
};

const readUserInfo = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = parseInt(req.params.userId);

    let resultObject = {};

    const readUserInfoResult = await userProvider.getUserInfo(userId);
    const readUserRankResult = await userProvider.getUserRank(userId);
    const readItemList = await userProvider.getItemList(userIdFromJWT, userId);
    const readReviewCount = await userProvider.getReviewCount(userId);
    const readReviewList = await userProvider.getReviewList(userId);
    //console.log(readUserInfoResult[0]);
    //console.log(readItemList);
    //console.log(readReviewList);
    resultObject = {
        userInfoResult: readUserInfoResult[0],
        userAvgRank: readUserRankResult[0].AvgRank,
        itemList: readItemList,
        reviewCount: readReviewCount[0].review_count,
        reviewList: readReviewList,
    };

    return res.send(response(baseResponse.SUCCESS, resultObject));
};

const readMyInfo = async (req, res) => {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (userId != userIdFromJWT) {
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));
    }

    const readUserInfoResult = await userProvider.getMyInfo(userId);
    const readUserRankResult = await userProvider.getUserRank(userId);
    const readReviewCount = await userProvider.getReviewCount(userId);

    const resultObject = {
        user_image: readUserInfoResult[0].image,
        shop_name: readUserInfoResult[0].shop_name,
        user_rank: readUserRankResult[0].AvgRank,
        wish_count: readUserInfoResult[0].wish_count,
        review_count: readReviewCount[0].review_count,
        following_count: readUserInfoResult[0].following_count,
        follower_count: readUserInfoResult[0].follower_count
    };
    
    return res.send(response(baseResponse.SUCCESS, resultObject));
}
module.exports = {
    postUsers,
    login,
    check,
    getUsers,
    getUserById,
    patchUsers,
    postAccount,
    patchAccount,
    deleteAccount,
    readAccount,
    test,
    readUserInfo,
    readMyInfo,
};
