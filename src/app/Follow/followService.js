const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const followProvider = require('./followProvider');
const followDao = require('./followDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');
const res = require('express/lib/response');
const { send } = require('process');

const postFollow = async (userId, followUserId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postFollowRow = await followDao.insertFollow(connection, userId, followUserId);

        connection.release();
        console.log(`${userId}번 회원님이 ${followUserId}번 회원님을 팔로우 합니다.`);
        
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - postFollow Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const deleteFollowUser = async (userId, toDelete) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteFollowRow = await followDao.deleteFollow(connection, userId, toDelete);

        connection.release();
        console.log(`${userId}번 회원님이 ${toDelete}번 회원님을 언팔로우 했습니다.`);

        return response(baseResponse.SUCCESS, deleteFollowRow);
    } catch (err) {
        logger.error(`App - deleteFollow Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const postBrandFollow = async (userId, brandId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postBrandFollowResult = await followDao.insertBrandFollow(connection, userId, brandId);

        connection.release();
        console.log(`${userId}번 회원님이 ${brandId}의 브랜드를 팔로우 합니다.`);

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - postBrandFollow Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const deleteBrandFollow = async (userId, brandId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteBrandFollowRow= await followDao.deleteBrandFollow(connection, userId, brandId);

        connection.release();
        console.log(`${userId}번 회원님이 ${brandId}의 브랜드를 언팔로우 했습니다.`);
        
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - deleteBrandFollow Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
module.exports = {
    postFollow, // 1. 상점 팔로우 API
    deleteFollowUser,   // 2. 상점 팔로우 취소 API
    postBrandFollow,    // 5. 브랜드 팔로우 API
    deleteBrandFollow   // 6. 브랜드 팔로우 취소 API
};
