const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const dealProvider = require('./dealProvider');
const dealDao = require('./dealDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');
const res = require('express/lib/response');
const { send } = require('process');

const postDeal = async (itemId, buyerId, sellerId, deal_type, address, pay) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertDealParams = [itemId, buyerId, sellerId, deal_type, address, pay];

        const postDealRow = await dealDao.insertDeal(connection, insertDealParams);
        connection.release();

        console.log(`${buyerId}번 회원님이 ${sellerId}번 회원님의 ${itemId}번 물건을 구입신청하셨습니다.`);
        
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - postDeal Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const patchApproveDeal = async (itemId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchApproveDealResult = await dealDao.updateApproveDeal(connection, itemId);
        
        connection.release();

        console.log(`${itemId}번 상품이 판매 승인되었습니다.`);

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - approveDeal Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const patchConfirmDeal = async (itemId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchConfirmDealResult = await dealDao.updateConfirmDeal(connection, itemId);
        
        connection.release();

        console.log(`${itemId}번 상품이 구매확정 되었습니다.`);

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - confirmDeal Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

const changeStateItemSale = async (itemId, state) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const changeStateItemSaleResult = await dealDao.updateItemSale(connection, itemId, state);

        connection.release();

        console.log(`${itemId}번 상품의 sale이 ${state}로 업데이트 되었습니다.`)
    } catch (err) {
        logger.error(`App - changestate Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
module.exports = {
    postDeal,
    patchApproveDeal,
    patchConfirmDeal,
    changeStateItemSale
};
