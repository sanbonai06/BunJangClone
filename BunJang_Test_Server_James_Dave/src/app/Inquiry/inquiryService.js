const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const inquiryProvider = require('./inquiryProvider');
const inquiryDao = require('./inquiryDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');
const res = require('express/lib/response');
const { send } = require('process');

const createInquiry = async (content, itemId, userId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postInquiryRow = await inquiryDao.insertInquiry(connection, content, itemId, userId);
        console.log(`문의 등록 완료 : ${postInquiryRow.insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createInquiry Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

const deleteInquiry = async (inquiryId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteInquiryRow = await inquiryDao.deleteInquiry(connection, inquiryId);
        console.log(`문의 삭제 완료 : ${inquiryId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createInquiry Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

module.exports = {
    createInquiry,
    deleteInquiry,
};
