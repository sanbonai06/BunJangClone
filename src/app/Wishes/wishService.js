const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const wishProvider = require('./wishProvider');
const wishDao = require('./wishDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');
const res = require('express/lib/response');
const { send } = require('process');

const postWish = async (userId, itemId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postwishRow = await wishDao.insertWish(connection, userId, itemId);
        
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createwish Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const deleteWish = async (userId, itemId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteWishRow = await wishDao.deleteWish(connection, userId, itemId);

        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - deleteWish Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
module.exports = {
    postWish,
    deleteWish
};
