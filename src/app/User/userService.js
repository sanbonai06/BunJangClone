const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const userProvider = require('./userProvider');
const userDao = require('./userDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');

// Service: Create, Update, Delete 비즈니스 로직 처리

const createUser = async (social_id, name, social_info, shop_name) => {
    try {
        const hashedSocialId = await crypto.createHash('sha512').update(social_id).digest('hex');
        const insertUserInfoParams = [hashedSocialId, name, social_info, shop_name];

        // 중복 확인
        const selectSocialIdParams = [name, hashedSocialId, social_info];
        const socialIdRows = await userProvider.socialIdCheck(selectSocialIdParams);
        if (socialIdRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_SOCIALID);

        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);

        console.log(`추가된 회원 : ${userIdResult.insertId}번 회원`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// TODO: After 로그인 인증 방법 (JWT)
const postSignIn = async (social_info, social_id, name) => {
    try {
        // 유저 이름 여부 확인
        const nameRows = await userProvider.nameCheck(name);
        console.log(nameRows, 'nameRows');
        if (nameRows.length < 1) return errResponse(baseResponse.SIGNIN_BODY_WRONG);

        const selectName = nameRows[0].user_name
        // 소셜ID 확인 (비밀번호) + status
        const hashedSocialId = await crypto.createHash('sha512').update(social_id).digest('hex');
        const selectSocialIdParams = [selectName, hashedSocialId, social_info];
        const socialIdRows = await userProvider.socialIdCheck(selectSocialIdParams);
        console.log(socialIdRows, 'socialIdRows');
        if (socialIdRows.length < 1) return errResponse(baseResponse.SIGNIN_BODY_WRONG);
        if (socialIdRows[0].social_id !== hashedSocialId) {
            return errResponse(baseResponse.SIGNIN_BODY_WRONG);
        }

        // 계정 상태 확인
        if (socialIdRows[0].status === 0) {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: socialIdRows[0].user_id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: '365d',
                subject: 'userInfo',
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, { user_id: socialIdRows[0].user_id, jwt: token });
    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const changeUserInfo = async (userId, image, shop_name, shop_url, shop_time, shop_introduce, shop_policy, shop_notice) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const changeUserParams = [image, shop_name, shop_url, shop_time, shop_introduce, shop_policy, shop_notice, userId];
        const changeUserInfoResult = await userDao.updateUserInfo(connection, changeUserParams);
        console.log(`${userId}번 회원님의 정보가 변경되었습니다.`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const createAccount = async (user_id, name, bank, account_num, for_sale, for_return) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const createAccountParams = [user_id, name, bank, account_num, for_sale, for_return];
        const createAccountResult = await userDao.createAccount(connection, createAccountParams);
        console.log(`${user_id}번 회원님의 계좌가 새로 등록되었습니다.`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createAccount Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const updateAccount = async (user_id, changeAccountNum, name, bank, account_num, for_sale, for_return) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchAccountParams = [name, bank, account_num, for_sale, for_return, changeAccountNum, user_id];
        const updateAccountResult = await userDao.updateAccount(connection, patchAccountParams);
        console.log(`${user_id}번님의 계좌 정보가 수정되었습니다.`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - updateAccount Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const deleteAccountInfo = async (userId, account_num) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteAccountInfoResult = await userDao.deleteAccount(connection, userId, account_num);
        console.log(`${userId}번 회원님의 계좌번호 ${account_num}의 계좌가 삭제되었습니다.`);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - deleteAccount Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
module.exports = {
    /* 유저 정보 */
    createUser,
    postSignIn,
    changeUserInfo,
    createAccount,
    updateAccount,
    deleteAccountInfo,
    /* 계좌 정보 */
};
