const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const userDao = require('./userDao');

// Provider: Read 비즈니스 로직 처리

const retrieveShopList = async (shop_name) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const shopListRow = await userDao.selectShop(connection, shop_name);
    connection.release();

    return shopListRow;
};

const retrieveUser = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await userDao.selectUserId(connection, userId);
    connection.release();

    return userResult;
};

const nameCheck = async (name) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const nameCheckResult = await userDao.selectUserName(connection, name);
    connection.release();

    return nameCheckResult;
};

const socialIdCheck = async (selectSocialIdParams) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const socialIdCheckResult = await userDao.selectSocialId(connection, selectSocialIdParams);
    connection.release();
    return socialIdCheckResult;
};

const retrieveAccountByAccountNum = async (accountNum) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveAccountRow = await userDao.selectAccountByAccountNum(connection, accountNum);
    connection.release();

    return retrieveAccountRow;
};

const retrieveAccountByUserId = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveAccountRow = await userDao.selectAccountByUserId(connection, userId);
    connection.release();

    return retrieveAccountRow;
};

const getCountItem = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getCountItem = await userDao.countItem(connection, userId);
    connection.release();

    return getCountItem;
};

const getUserInfo = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getUserInfoRow = await userDao.selectUserInfo(connection, userId);
    connection.release();

    return getUserInfoRow;
};

const getItemList = async (userId, shopId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getItemListRow = await userDao.selectUserItemList(connection, userId, shopId);
    connection.release();

    return getItemListRow;
};

const getReviewList = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getReviewListRow = await userDao.selectReviewList(connection, userId);
    connection.release();

    return getReviewListRow;
};

const getUserRank = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getUserRank = await userDao.selectUserRank(connection, userId);
    connection.release();

    return getUserRank;
};

const getReviewCount = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getReviewCountRow = await userDao.selectReviewCount(connection, userId);
    connection.release();

    return getReviewCountRow;
};

const getMyInfo = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const getMyInfoRow = await userDao.selectMyInfo(connection, userId);
    connection.release();

    return getMyInfoRow;
};
module.exports = {
    retrieveShopList,
    retrieveUser,
    nameCheck, // 유저 이름 체크
    socialIdCheck, // 소셜ID 체크
    retrieveAccountByAccountNum,
    retrieveAccountByUserId,
    getCountItem,
    getUserInfo,
    getItemList,
    getReviewList,
    getUserRank,
    getReviewCount,
    getMyInfo,
};
